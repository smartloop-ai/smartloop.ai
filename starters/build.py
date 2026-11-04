"""Build each starter project through the local agent, wait for indexing, and export it."""
import json, os, sys, time, urllib.request, uuid

BASE = "http://127.0.0.1:38540"
S = os.path.dirname(os.path.abspath(__file__))
STARTERS = {
    "legal": ("Legal starter", "Sample contracts for a fictional company, with contract review skills."),
}

def req(method, path, body=None, headers=None, raw=False):
    r = urllib.request.Request(BASE + path, data=body, method=method, headers=headers or {})
    with urllib.request.urlopen(r, timeout=300) as resp:
        data = resp.read()
    return data if raw else json.loads(data or b"{}")

def jpost(path, obj):
    return req("POST", path, json.dumps(obj).encode(), {"Content-Type": "application/json"})

def multipart(fields, files):
    b = uuid.uuid4().hex
    out = b""
    for k, v in fields.items():
        out += f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
    for k, (name, data) in files.items():
        out += f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"; filename=\"{name}\"\r\nContent-Type: application/octet-stream\r\n\r\n".encode() + data + b"\r\n"
    return out + f"--{b}--\r\n".encode(), {"Content-Type": f"multipart/form-data; boundary={b}"}

for key in sys.argv[1:]:
    name, desc = STARTERS[key]
    skills = [{"content": open(os.path.join(S, "skills", key, f)).read()} for f in sorted(os.listdir(os.path.join(S, "skills", key)))]
    cwd = os.path.join(S, "work", key)
    os.makedirs(cwd, exist_ok=True)
    proj = jpost("/v1/projects", {"name": name, "description": desc, "skills": skills, "cwd": cwd})
    pid = proj["id"]
    print(key, "project", pid, flush=True)
    docdir = os.path.join(S, "docs", key)
    for f in sorted(os.listdir(docdir)):
        body, h = multipart({"cwd": cwd}, {"file": (f, open(os.path.join(docdir, f), "rb").read())})
        print(" upload", f, req("POST", f"/v1/projects/{pid}/documents/upload", body, h), flush=True)
    for _ in range(120):
        docs = req("GET", f"/v1/projects/{pid}/documents")
        docs = docs.get("documents", docs) if isinstance(docs, dict) else docs
        states = [(d.get("name") or d.get("document_name"), d.get("status")) for d in docs]
        print(" status", states, flush=True)
        if len(docs) == len(os.listdir(docdir)) and all(str(s).lower() in ("indexed", "ready", "completed", "done") for _, s in states):
            break
        time.sleep(10)
    else:
        sys.exit("indexing did not finish")
    print(json.dumps(docs, indent=1)[:1500])
    with open(os.path.join(S, f"{key}-starter.zip"), "wb") as fh:
        fh.write(req("POST", f"/v1/projects/{pid}/export", raw=True))
    # The build project is scaffolding: remove it so it doesn't sit in Studio's
    # sidebar next to an imported starter and get mistaken for it.
    req("DELETE", f"/v1/projects/{pid}")
    print(" exported", key, flush=True)
