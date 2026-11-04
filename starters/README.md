# Starter projects

Source for the sample project offered for download on the Legal use-case page
(`static/starters/Halbrook-Wren-LLP.zip`). Every document is fictional.

## Rebuilding

Needs Studio (or `docent`) running so the local agent is on `localhost:38540`, plus
`pip install reportlab python-docx`. From this folder:

```bash
python3 gen_docs.py docs                 # write the sample documents to docs/legal
python3 build.py legal                   # create the project, upload, wait for indexing, export
python3 finalize.py legal
cp Halbrook-Wren-LLP.zip ../static/starters/
```

`build.py` deletes each project it creates once the export is written.

`finalize.py` turns an export into something safe to publish. It keeps only the documents and
skills, names the project after its fictional firm, blanks the manifest's machine-specific fields (project directory, working folder,
document paths), and writes the skills from `skills/` under their real names, since the API
renames skills it is given. The vector index is left out on purpose: it is tied to the
exporting machine's embedding model, and Studio re-indexes `documents/` on import anyway.

Web search can't be switched off from the archive (import always starts with it on), so the
guides tell people to turn it off.
