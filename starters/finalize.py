"""Clean an export and put the authored skills in place under their real names."""
import json, os, sys, zipfile
# The project name is a fictional firm. Studio names an imported project after
# the zip's file name (dashes become spaces), so the file carries it too.
NAMES = {"legal": "Halbrook Wren LLP"}
k = sys.argv[1]
name = NAMES[k]
src, dst = f"{k}-starter.zip", name.replace(" ", "-") + ".zip"
with zipfile.ZipFile(src) as zi, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zo:
    m = json.loads(zi.read("manifest.json"))
    m["project"].update(name=name, id="", project_dir="", cwd=None, documents=[], sessions=[], current=False, web_search_enabled=False)
    m["exported_at"] = "2026-10-10T00:00:00Z"
    zo.writestr("manifest.json", json.dumps(m, indent=2))
    zo.writestr("workspace/.workspace_manifest.json", "{}")
    for i in zi.infolist():
        n = i.filename
        if n.startswith("workspace/documents/") or (n.startswith("workspace/skills/") and not n.startswith("workspace/skills/skill-")):
            zo.writestr(n, zi.read(i))
    for f in sorted(os.listdir(f"skills/{k}")):
        zo.writestr(f"workspace/skills/{f[:-3]}/SKILL.md", open(f"skills/{k}/{f}").read())
