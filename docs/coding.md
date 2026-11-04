# Coding with Docent

Docent is an AI coding harness for the terminal. Open it in a code project, ask for a change, and the answer comes back as files written into the folder, checked with the project's own build, and fixed until the check passes. Work that isn't a file, such as committing, installing a dependency or running the tests, comes back as shell commands that Docent runs for you once you say so.

```sh
cd my-project
docent
```

```
> add a --verbose flag that prints each file as it's processed
```

## Engine and harness

The work is split in two:

- **The framework** is the engine, the same one behind Smartloop Studio. It takes a prompt with its sources and returns the best answer it can. Its orchestrator picks the model that answers and decides on its own whether to search the web, for code as for anything else. See [Model orchestration](./model-orchestration.md).
- **Docent** is the harness around it. It builds the prompt from your folder, then takes the answer apart into files to write, checks to run and commands to run, and sends what happened back to the agent.

So the models run on your machine, the same as for documents and chat, and only a web search query ever leaves it. See [Web search](./web-search.md).

## When a prompt is coding work

A folder is a **code project** when a manifest sits at its top: `Cargo.toml`, `package.json`, `pyproject.toml`, `go.mod`, `pom.xml` and the like. This is read off the folder on every prompt, so a project you scaffold after linking the folder counts from then on.

In a code project, a prompt that asks for a change or asks about the code is answered with code. Anywhere else, a prompt that asks for something to be made (create, generate, scaffold, write, add, fix…) is answered with files too, and so is one that's plainly about programming.

| Command | Action |
|---|---|
| `/code` | Say whether this folder is treated as a code project, and why |
| `/code on` | Treat this folder as a code project, whatever its files say |
| `/code off` | Treat it as a documents project |
| `/code auto` | Go back to deciding from its files |

The choice is kept in `.docent/manifest.json`, next to the folder's [sync](./command-line-tool.md#syncing-a-folder) link.

## What the agent is sent

Each coding turn, Docent sends the agent:

1. The project's file list, its git state (branch, remotes and changed files) and its manifests.
2. The contents of the files the prompt concerns.
3. Your request last, with how to answer it: from the files, with the web for what they don't tell, such as a library's current API.

How much goes in follows the widest context window among the project's enabled models: about 60,000 characters for a 32k-token local model, up to 400,000 for a cloud model with a million. If the orchestrator picks a smaller model, the framework fits the prompt to that model's window by keeping the head and the tail and dropping the middle. That's why the file list, git state and manifests come first and the request closes the message: what's cut is file contents, never the question.

## Files in the reply

The agent answers with whole files, each in a fenced block with its path above. As the reply streams in, each file shows as a diff against the one in the folder: only the changed hunks, each under its `@@` header with a few lines of context, every line numbered in the old and new file, additions on green and removals on red. A new file shows as additions, folded past 40 lines.

When the reply finishes, its files are written into the folder and the chat lists what each one gained and lost by lines.

A file the agent wasn't shown whole is never replaced by a shorter reply, since that would drop the rest of the file. Its part shows as it is, and `/write` puts it down if it's what you want:

| Command | Action |
|---|---|
| `/write` | Write the last reply's files that were held back |
| `/write <path>` | Write just that one |

## Checks and the fix loop

Once the files are written, the project is checked with a quick command for its kind:

| Project | Check |
|---|---|
| Rust | `cargo check` |
| Go | `go build ./...` |
| JavaScript / TypeScript | the package's `build` script, or `tsc --noEmit` |
| Scripts with no build | each file by what it is: `bash -n`, `python3 -m py_compile`, `node --check`, `ruby -c`, `php -l`… |

The check runs in the chat like a shell command, its output showing as it comes. If it fails, the errors go back to the agent, which answers with fixed files, which are checked again, round after round until the check passes. It stops early only when a round changes nothing (the same failure again, or a reply with no file), or when you press **Esc**.

## Shell commands

Work that isn't a file the agent answers with shell commands, in a fenced block marked `sh` with no path. After the reply's files are written and checked, Docent shows the commands and asks before running anything:

| Key | Action |
|---|---|
| Enter | Run them in the folder, each block as one script in turn |
| Tab | Run them, and turn on auto-approve so later replies' commands run without asking |
| Esc | Skip them |

Tab on an empty prompt turns auto-approve on or off at any time, and the footer says when it's on. A command with a placeholder to fill in, like `<your-username>`, is left out and the chat says so.

Each command shows on its own `$` line over what it printed, streaming as it runs, so a build or test run is watched, not waited on. What the commands print goes back to the agent, the way a tool's result does: a failure to be put right with other commands or files, and the last result so it can say what was done and what's left. That runs for up to three rounds, or until Esc. So "commit and push the changes" ends in a commit, a push and a line saying so.

### Running your own

Type `!` followed by a command to run it in the working directory. The prompt turns pink and the footer says shell mode. The output shows as it comes and goes to the agent with your next prompt, so it stays part of the session:

```
!cargo test
!git log --oneline -5
```

### Background tasks

A command that keeps running, such as a dev server or a watcher, ends with `&`: the agent writes `npm run dev &`, and so can you after `!`. It starts in the background, the next command and the next prompt don't wait for it, and several can run at once. Each one still running is listed under the prompt with how long it's been going.

| Action | How |
|---|---|
| See all it printed | Click its line under the prompt, or its command in its entry; Esc closes it |
| Pick one from the keyboard | `/tasks` or Ctrl+B (twice under tmux), then ↑ ↓ and Enter |
| Stop one | `x` in `/tasks`, or click its `✕ stop` |
| Stop several | `/stop` ends every running command; `/stop <word>` ends those with the word in their command |

Quitting Docent ends them all.

## Models for coding

Which model answers is the orchestrator's call: it steps through the project's enabled models by size, what they declare and your machine's resources, and takes the largest that fits. There is no "coding" tag to set. Capabilities describe what a model has (`text`, `vision`, `reasoning`, `thinking`), and `/models` shows each one's.

For a model the catalog doesn't describe, set its capabilities yourself:

```
/models my-model caps text,reasoning
/models my-model caps auto
```

`auto` goes back to the catalog's.

## Commands at a glance

| Command | Action |
|---|---|
| `/code [on\|off\|auto]` | Whether prompts in this folder are answered with code |
| `/write [path]` | Write the last reply's held-back files |
| `!<command>` | Run a shell command; its output goes to the agent |
| `!<command> &` | Run it in the background |
| `/tasks`, Ctrl+B | The commands still running |
| `/stop [word]` | Stop running commands |
| Tab (empty prompt) | Auto-approve the agent's commands, on or off |
| `/models <name> caps <list\|auto>` | Set a model's capabilities |
