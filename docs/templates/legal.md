# Legal

Contracts, case files, and client correspondence are some of the most sensitive documents an organization holds, and attorney–client privilege depends on keeping them in confidence. A cloud AI assistant asks you to send that material to someone else's servers before it can help. Smartloop runs its models on your own machine, so you can put AI to work on privileged material without it ever leaving the device.

This page shows how to set up Smartloop for legal work and the tasks it is best suited to.

## Why private AI for legal work

| Concern | With Smartloop |
|---|---|
| **Privilege and confidentiality** | Documents are read and indexed on your device. Prompts, files, and answers are not sent to a hosted model. |
| **Client and regulator questions** | You can say plainly where the data goes: nowhere. There is no third-party processor to list or vet for the model itself. |
| **Retention and training** | Nothing you add is used to train anyone else's model, and there is no provider-side log of your prompts. |
| **Verifiability** | Every answer lists the documents it drew from in a **REFERENCES** block, so a claim can be checked against the source before it is relied on. |
| **Cost** | The models and document processing are free and run locally — no per-token billing as matters grow. |

:::caution Keep the matter fully offline
Two features reach off your machine, and only when you use them: [web search](../web-search.md) sends the search query, and [connections](../mcp-servers.md) send what a tool call needs to the service you connected. For a privileged matter, turn search off in **Project Settings** and leave connections off for that project. Everything else stays local.
:::

## Try it with the starter project

The quickest way to see this is the legal starter, **Halbrook Wren LLP**: a project for a fictional law firm reviewing its client Halvorsen Analytics' contracts, with the contracts already in it and two skills for reviewing them.

<a href="/starters/Halbrook-Wren-LLP.zip" download>**Download Halbrook Wren LLP**</a> (zip, 80 KB)

1. In Studio, click **+ New Project**.
2. Choose **Import**, then pick the zip (or drop it onto the dialog), and click **Create**. The project is named **Halbrook Wren LLP**.
3. Turn web search off with the toggle under the prompt (⌘⌥S, or Ctrl+Alt+S), so the project works only from its own documents.
4. Enable the selected models below.

The documents are indexed in the background; they show as **INDEXING** in the Documents panel for a few seconds.

:::tip Selected models
Press `Ctrl+Shift+M`, or click **Auto** in the prompt box, and enable a model for each role:

| Role | Model | Used for |
|---|---|---|
| Vision | Qwen Vision (`qwen2-vl-2b`) | Reading scanned exhibits or photographed pages |
| Document processing | Ministral 3 (`ministral3-3b`) | Parsing and indexing the documents |
| Reasoning | Qwen 3.5 (`qwen3.5-2b`) | Answering your questions |

OCR support requires Smartloop v1.0.57+.

Bigger is better: if your machine has the memory, a larger model in each role gives better answers. From the [command line](../command-line-tool.md#models), enable each one with `/models` in the chat.
:::

| Document | What it is |
|---|---|
| `Halvorsen-Corvid-MSA-2024.pdf` | Signed master services agreement between Halvorsen Analytics and a cloud provider |
| `Halvorsen-Corvid-MSA-Amendment-1-2025.pdf` | Amendment that changes the non-renewal notice period |
| `Halvorsen-Corvid-MSA-2026-DRAFT.docx` | The provider's draft for the 2026 renewal, with less favorable terms |
| `Halvorsen-Brightwater-Mutual-NDA.pdf` | Mutual NDA with a residuals clause |
| `Pell-Crane-Supply-Agreement.docx` | One-sided office supply agreement |

Then try:

- *"Quote the limitation of liability in the 2026 draft."*
- *"Which agreements let the other side assign without our consent?"*
- `/contract-review` on the Pell & Crane supply agreement.
- `/compare-versions` for the 2024 MSA against the 2026 draft.

The firm, its client, and every company, person, and term in the starter are made up.

## One project per matter

Each project has its own documents, [memory](../memory.md), and agent process, isolated from every other project. That maps naturally onto how legal work is already organized:

1. Create a project for each matter or client — for example, `acme-v-globex` or `acme-msa-renewal`.
2. Add the matter's documents through the **Documents** panel, or copy a whole folder into the project folder (⚙️ → folder icon). PDFs, Word, Excel, scanned pages, and images are all supported — see [Bring your documents](../documents.md).
3. Turn web search off for the project if the matter is privileged.

Because projects are isolated, a question in one matter never draws on another client's files.

## What you can do

### Review contracts

Ask about a single agreement or across a whole set of them:

- *"List the termination clauses in these agreements, with the notice period for each."*
- *"Which contracts have a change-of-control provision, and what does each one require?"*
- *"Compare the limitation of liability in the 2024 MSA with the 2026 draft. What changed?"*
- *"Put the governing law, renewal date, and auto-renewal terms for every vendor contract in a table."*

The answer cites the documents it came from, so each row can be checked against the agreement itself.

### Work through discovery and case files

Drop in deposition transcripts, exhibits, and correspondence, then ask:

- *"Build a timeline of every communication between Smith and the supplier, with dates and the document each comes from."*
- *"Where does the witness describe the March 12 meeting, and are the accounts consistent?"*
- *"Summarize what each exhibit establishes in two sentences."*

Scanned exhibits and photographed pages go through the vision model, so a scan is searchable the same way a Word file is.

### Draft from your own precedent

Add your firm's templates and past work product to a project and ask for drafts grounded in them rather than written from a blank page:

- *"Draft a mutual NDA using our standard form, for a two-year term under New York law."*
- *"Write a first-draft response to the demand letter, following the position in our memo."*

Give a **thumbs up** to a draft or summary you want the project to keep, and it is stored in the project's [memory](../memory.md) for later conversations.

## A contract review skill

Repeated reviews are a good fit for a [skill](../skills.md). This is the `contract-review` skill from the starter project; it runs a first-pass review of any agreement in the project against a fixed checklist:

````markdown
---
name: contract-review
description: When the user asks to review a contract or agreement, run a first-pass review against the checklist and flag anything that needs attention
---

# Contract review
Review the named agreement in this project and produce a first-pass issues list.

## Checklist
- Parties, effective date, and term
- Renewal and the notice needed to stop it
- Termination rights and notice periods
- Limitation of liability and any carve-outs
- Indemnities, and whether they are mutual
- Assignment and change of control
- Governing law and dispute resolution
- Confidentiality and data protection obligations

## Guidelines
- Quote the clause and give its section number for every item
- If an amendment in the project changes a clause, use the amended version and say so
- Mark an item **Missing** if the agreement does not address it
- List anything unusual or one-sided under a separate "Attention" heading
- Do not give a legal conclusion; the output is for attorney review
````

Run it from the prompt with `/contract-review`, and edit the checklist to match how your team reviews.

## Automating with the API

The local agent serves an OpenAI-compatible API on `localhost:38540`, so the same review can be scripted — across a folder of contracts, say, with results written to a spreadsheet. The request never leaves the machine:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:38540/v1", api_key="not-needed")

response = client.chat.completions.create(
    model="sl-mini",
    messages=[
        {"role": "user", "content": "For each agreement, give the renewal date and notice period as a table."}
    ],
    extra_body={"project_id": "<your-matter-project-id>"},
)

print(response.choices[0].message.content)
```

See [Local AI](../local-ai.md) for finding a project's ID, multi-turn requests, and reading citations from the response.

:::info
Smartloop assists with legal work; it does not replace professional judgment. Review every answer against its cited sources before relying on it, and check your own professional obligations on the use of AI tools.
:::
