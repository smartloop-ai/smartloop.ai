"""Generate the fictional sample documents for the legal starter project."""
import os
import sys

from docx import Document
from docx.shared import Pt
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT = sys.argv[1]
SAMPLE = "SAMPLE DOCUMENT — fictional, created by Smartloop for demonstration. Any resemblance to real persons or companies is coincidental."

styles = getSampleStyleSheet()
banner = ParagraphStyle("banner", parent=styles["Normal"], fontSize=8, textColor=colors.HexColor("#B42318"))
body = ParagraphStyle("body", parent=styles["Normal"], fontSize=10, leading=14, spaceAfter=6)
h1 = styles["Title"]
h2 = ParagraphStyle("h2", parent=styles["Heading3"], spaceBefore=8)


def pdf(path, title, sections, tables=None):
    """sections: list of (heading or None, [paragraphs]); tables: {index_after_section: rows}"""
    story = [Paragraph(SAMPLE, banner), Spacer(1, 8), Paragraph(title, h1)]
    for i, (head, paras) in enumerate(sections):
        if head:
            story.append(Paragraph(head, h2))
        for p in paras:
            story.append(Paragraph(p, body))
        if tables and i in tables:
            # Lists as plain lines, the way most clinical documents print them;
            # PDF tables lose their structure when converted to text.
            head_row, *rows = tables[i]
            for r in rows:
                cells = [f"{h}: {c}" for h, c in zip(head_row[1:], r[1:]) if c and c != "—"]
                story.append(Paragraph(f"&bull; <b>{r[0]}</b> — " + "; ".join(cells), body))
    SimpleDocTemplate(path, pagesize=LETTER, leftMargin=inch, rightMargin=inch).build(story)


def docx(path, title, sections):
    d = Document()
    d.styles["Normal"].font.size = Pt(10.5)
    p = d.add_paragraph(SAMPLE)
    p.runs[0].font.size = Pt(8)
    d.add_heading(title, 0)
    for head, paras in sections:
        if head:
            d.add_heading(head, 2)
        for t in paras:
            d.add_paragraph(t.replace("<b>", "").replace("</b>", ""))
    d.save(path)


# ── Legal ────────────────────────────────────────────────────────────────

def legal(dir_):
    os.makedirs(dir_, exist_ok=True)
    parties = ("This Master Services Agreement (the \"Agreement\") is entered into as of March 1, 2024 (the \"Effective Date\") "
               "between <b>Halvorsen Analytics, Inc.</b>, a Delaware corporation (\"Customer\"), and <b>Corvid Cloud Services LLC</b>, "
               "a New York limited liability company (\"Provider\").")
    pdf(os.path.join(dir_, "Halvorsen-Corvid-MSA-2024.pdf"), "Master Services Agreement", [
        (None, [parties]),
        ("1. Services", ["1.1 Provider will provide the managed data hosting and analytics services described in each Statement of Work (\"SOW\").",
                         "1.2 Service levels are set out in Exhibit B. Service credits are Customer's sole remedy for failure to meet them."]),
        ("2. Fees and Payment", ["2.1 Customer will pay the fees in each SOW within thirty (30) days of invoice.",
                                 "2.2 Provider may increase fees once per renewal term by no more than three percent (3%), on sixty (60) days' written notice."]),
        ("3. Term and Renewal", ["3.1 The Agreement begins on the Effective Date and continues for an initial term of three (3) years.",
                                 "3.2 It then renews automatically for successive one (1) year terms unless either party gives written notice of non-renewal at least ninety (90) days before the end of the then-current term."]),
        ("4. Termination", ["4.1 Either party may terminate for material breach not cured within thirty (30) days of written notice.",
                            "4.2 Customer may terminate for convenience on sixty (60) days' written notice, subject to payment of fees for Services rendered through the termination date.",
                            "4.3 <b>Change of Control.</b> If either party undergoes a Change of Control, the other party may terminate this Agreement on thirty (30) days' written notice given within ninety (90) days after it learns of the Change of Control."]),
        ("5. Confidentiality", ["5.1 Each party will protect the other's Confidential Information with at least reasonable care and use it only to perform under this Agreement. These obligations survive for five (5) years after termination."]),
        ("6. Data Protection", ["6.1 Provider will process Customer Data only on Customer's documented instructions, maintain the safeguards in Exhibit C, and notify Customer of a Security Incident within forty-eight (48) hours of discovery."]),
        ("7. Indemnification", ["7.1 Each party (the \"Indemnifying Party\") will defend and indemnify the other against third-party claims arising from its breach of Sections 5 or 6, or its gross negligence or willful misconduct. The obligations in this Section are mutual."]),
        ("8. Limitation of Liability", ["8.1 Except for the Excluded Claims, each party's total liability under this Agreement will not exceed the fees paid or payable by Customer in the twelve (12) months preceding the claim.",
                                        "8.2 \"Excluded Claims\" means breach of Section 5 (Confidentiality), breach of Section 6 (Data Protection), and indemnification obligations under Section 7, which are subject to a cap of three (3) times the fees paid in the preceding twelve (12) months."]),
        ("9. Assignment", ["9.1 Neither party may assign this Agreement without the other's prior written consent, which will not be unreasonably withheld, except to a successor in a merger or sale of substantially all assets, subject to Section 4.3."]),
        ("10. Governing Law", ["10.1 This Agreement is governed by the laws of the State of New York. The parties submit to the exclusive jurisdiction of the state and federal courts in New York County."]),
        (None, ["<b>HALVORSEN ANALYTICS, INC.</b> By: Priya Halvorsen, CEO &nbsp;&nbsp;&nbsp; <b>CORVID CLOUD SERVICES LLC</b> By: Marcus Teel, Managing Member"]),
    ])

    pdf(os.path.join(dir_, "Halvorsen-Corvid-MSA-Amendment-1-2025.pdf"), "Amendment No. 1 to Master Services Agreement", [
        (None, ["This Amendment No. 1 is made as of September 15, 2025 between Halvorsen Analytics, Inc. (\"Customer\") and Corvid Cloud Services LLC (\"Provider\") and amends the Master Services Agreement dated March 1, 2024 (the \"Agreement\")."]),
        ("1. Notice of Non-Renewal", ["Section 3.2 is amended by replacing \"ninety (90) days\" with \"one hundred twenty (120) days\"."]),
        ("2. Additional Services", ["SOW No. 3 (Disaster Recovery) is added to the Agreement at a fee of $4,200 per month, effective October 1, 2025."]),
        ("3. Effect", ["Except as amended here, the Agreement remains in full force and effect. If this Amendment conflicts with the Agreement, this Amendment controls."]),
        (None, ["Signed by Priya Halvorsen (Customer) and Marcus Teel (Provider)."]),
    ])

    docx(os.path.join(dir_, "Halvorsen-Corvid-MSA-2026-DRAFT.docx"), "Master Services Agreement — 2026 Renewal (Provider Draft v2)", [
        (None, ["DRAFT FOR DISCUSSION — prepared by Provider's counsel, February 2, 2026. Not for signature.",
                "This Master Services Agreement is entered into as of March 1, 2026 between Halvorsen Analytics, Inc. (\"Customer\") and Corvid Cloud Services LLC (\"Provider\")."]),
        ("2. Fees and Payment", ["2.1 Customer will pay the fees in each SOW within thirty (30) days of invoice.",
                                 "2.2 Fees increase automatically by seven percent (7%) at the start of each renewal term."]),
        ("3. Term and Renewal", ["3.1 Initial term of three (3) years from the Effective Date.",
                                 "3.2 Renews automatically for successive one (1) year terms unless either party gives notice of non-renewal at least one hundred twenty (120) days before the end of the then-current term."]),
        ("4. Termination", ["4.1 Either party may terminate for material breach not cured within thirty (30) days of written notice.",
                            "4.2 Customer may terminate for convenience on ninety (90) days' written notice and payment of an early termination fee equal to fifty percent (50%) of the fees remaining in the current term.",
                            "4.3 [Change of Control — deleted.]"]),
        ("6. Data Protection", ["6.1 Provider will process Customer Data on Customer's documented instructions and notify Customer of a Security Incident without undue delay."]),
        ("7. Indemnification", ["7.1 Customer will defend and indemnify Provider against third-party claims arising from Customer Data or Customer's use of the Services."]),
        ("8. Limitation of Liability", ["8.1 Each party's total liability under this Agreement will not exceed the fees paid by Customer in the six (6) months preceding the claim.",
                                        "8.2 The cap in Section 8.1 applies to all claims, including breach of confidentiality and data protection obligations."]),
        ("9. Assignment", ["9.1 Provider may assign this Agreement to an affiliate or successor without consent. Customer may not assign without Provider's prior written consent."]),
        ("10. Governing Law", ["10.1 This Agreement is governed by the laws of the State of Delaware."]),
    ])

    pdf(os.path.join(dir_, "Halvorsen-Brightwater-Mutual-NDA.pdf"), "Mutual Non-Disclosure Agreement", [
        (None, ["This Mutual Non-Disclosure Agreement is made as of June 10, 2025 between <b>Halvorsen Analytics, Inc.</b> and <b>Brightwater Labs Ltd.</b>, each a \"Party\", to evaluate a possible joint product offering (the \"Purpose\")."]),
        ("1. Confidential Information", ["Any non-public information disclosed by one Party to the other, in any form, that is marked confidential or would reasonably be understood to be confidential."]),
        ("2. Obligations", ["The receiving Party will use Confidential Information only for the Purpose and will not disclose it except to employees and advisers who need to know it and are bound by similar obligations."]),
        ("3. Exclusions", ["Information that is public through no fault of the receiving Party, already known to it, independently developed, or rightfully received from a third party."]),
        ("4. Residuals", ["Either Party may use for any purpose information retained in the unaided memory of its personnel who had access to Confidential Information, without obligation to the other Party."]),
        ("5. Term", ["This Agreement lasts two (2) years from its date. Obligations for information disclosed during the term survive for three (3) years after it ends."]),
        ("6. Non-Solicitation", ["For twelve (12) months, neither Party will solicit for employment any employee of the other Party it met through the Purpose."]),
        ("7. Governing Law", ["The laws of the State of New York govern this Agreement."]),
        (None, ["Signed by Priya Halvorsen (Halvorsen Analytics, Inc.) and Dr. Aoife Brennan (Brightwater Labs Ltd.)."]),
    ])

    docx(os.path.join(dir_, "Pell-Crane-Supply-Agreement.docx"), "Supply Agreement", [
        (None, ["This Supply Agreement is entered into as of January 6, 2025 between Pell & Crane Office Supply Co., an Illinois corporation (\"Supplier\"), and Halvorsen Analytics, Inc. (\"Buyer\")."]),
        ("1. Products", ["Supplier will supply office furniture and consumables listed in Schedule 1 at the prices stated there."]),
        ("2. Term", ["The Agreement runs for one (1) year and renews automatically for further one (1) year terms unless Buyer gives written notice of non-renewal at least thirty (30) days before the renewal date."]),
        ("3. Price Changes", ["Supplier may change prices on fifteen (15) days' notice."]),
        ("4. Termination", ["Supplier may terminate on thirty (30) days' notice for any reason. Buyer may terminate only for Supplier's uncured material breach."]),
        ("5. Indemnity", ["Buyer will indemnify Supplier against all claims, losses and expenses arising from Buyer's use of the Products."]),
        ("6. Assignment", ["Supplier may assign this Agreement without Buyer's consent."]),
        ("7. Governing Law", ["The laws of the State of Illinois govern this Agreement."]),
    ])


if __name__ == "__main__":
    legal(os.path.join(OUT, "legal"))
    print("done")
