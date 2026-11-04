import ThemedVideo from '@site/src/components/ThemedVideo';

# Docent - Command Line Interface

**Docent**, powered by Smartloop, is your private AI assistant in the terminal: think Claude Code for your personal documents, running 100% locally. Chat with your PDFs and Office files, search the web, connect MCP servers, and set up your own local AI infrastructure: the agent, its models, and your projects. It started as the command line companion to Smartloop Studio and still works alongside it. If no local agent is running, Docent downloads the framework and models it needs and starts one itself.

It installs as `docent`, and as `smartloop`, its old name, so existing commands and scripts keep working; the two are the same binary. For an overview, see [Docent](/#docent) on the home page.

<div className="doc-figure">
<ThemedVideo
  label="docent in a terminal: a welcome card with the Docent logo, the project, agent and versions, and commands to get started; typing /, which lists the commands, including /mcp; asking what clauses a mutual NDA should include; a status line above the prompt while the assistant works; then the answer with its web references and a line with the model, tokens and time"
  sources={{
    light: require('./cli-run-latte.mp4').default,
    dark: require('./cli-run-mocha.mp4').default,
  }}
/>
</div>

## Installation

macOS and Linux:

```sh
curl -fsSL https://smartloop.ai/install | sh
```

Windows (PowerShell):

```powershell
irm https://smartloop.ai/install.ps1 | iex
```

On macOS and Linux the binary goes to `~/.local/bin` (or `~/.cargo/bin` if a Rust toolchain already owns it). If that directory isn't on your `PATH`, the installer adds it to your shell's startup file. On Windows it goes to `%USERPROFILE%\.smartloop\bin` and is added to your user `PATH`.

Open a new terminal after installing, then verify:

```sh
docent --version
```

Set `SMARTLOOP_CLI_INSTALL_DIR` to install elsewhere, or `SMARTLOOP_CLI_VERSION` to pin a specific release.

## First run

The first command that needs the agent sets everything up. The steps show as a checklist that updates in place:

```
■ Start agent                    port 50578
■ Embeddings (bge-m3)                417 MB
■ Decision model sl-mini
  ██████████████▋░░░░░░░░░░░░░░░   49%  377 MB/769 MB
□ Default project
□ Load model
□ Skills and connections
```

1. **Start agent**: the agent is built into Docent, with GPU inference through Metal on macOS and Vulkan on Linux and Windows. It starts in the background on a free port it picks itself, writes that port to `~/.smartloop/server.port`, and logs to `~/.smartloop/server.log`. If Studio is already running the same framework version on the same home, Docent uses its agent instead.
2. **Embeddings**: the model behind document search.
3. **Decision model, default project, load model**: the default `sl-mini` orchestration model is downloaded and loaded, and a default project is created.
4. **Skills and connections**: the project's skills and connections are set up.

A step without a progress bar shows its elapsed time once it runs past a couple of seconds, and setup ends with `✓ Setup complete in …`. The chat opens once the agent is ready. Any step whose files are already on disk is skipped, so later runs start straight away. To run setup up front, or to stop the agent:

```sh
docent agent start
docent agent stop
```

## Signing in

Some models, and hosted features such as [web search](./web-search.md), need a Smartloop account. Sign in from the chat:

```
/login
```

This opens [app.smartloop.ai](https://app.smartloop.ai) in your browser, the same way Studio does. Once you're in, the page hands the session to the local agent, which stores it. `/login --token` pastes a token into a masked field instead, and `/logout` signs out.

## Projects

`/project` (or Ctrl+P) lists your projects to switch to, create, import or delete. Switching starts a new session in that project.

| Command | Action |
|---|---|
| `/project <name>` | Switch to a project by its name or ID |
| `/project new <name>` | Create a project and switch to it |
| `/project import <zip>` | Import an exported project and switch to it; dropping a `.zip` on an empty prompt fills this in |

An import gets a fresh project ID, and connection credentials are stripped from the archive, so you will need to reconnect its services.

Opening Docent in a folder that isn't linked to a project yet gives it one of its own, named after the folder, and [syncs](#syncing-a-folder) the folder to it.

## Checking the agent

See where the local agent is listening, whether it is healthy, which model it has loaded, and the agent running for each project. `agent status` only reports: it never starts anything, and it exits with status 1 when no agent is running, so scripts can use it as a health check.

```sh
docent agent status
```

```
Endpoint: http://localhost:50578
Status:   healthy
Model:    sl-mini (Q4_K_M, 32768 ctx, 769 MB)
Process:  pid 8738, 249 MB
+--------------+------+-------+-------+------+--------+
| Project      | PID  | Port  | Alive | Idle | Memory |
+--------------+------+-------+-------+------+--------+
| general_chat | 2668 | 62110 | true  | 766s | 122 MB |
+--------------+------+-------+-------+------+--------+
```

## Chatting with the assistant

Start an interactive chat:

```sh
docent
```

`docent` on its own is short for `docent run`. In a terminal this opens a full-screen chat. A welcome card shows the project, the agent's address and the versions, with a few commands to get started. While a reply runs, a status line above the prompt shows what the assistant is doing (choosing a model, searching the web, reading a page) and for how long. Replies stream in as they're generated, followed by the sources they used and a line with the model that answered, the token count, speed and time:

```
● Here are some places to visit in the United States: …

  References
  [1] https://www.historictours.com/usa-bucket-list-destinations
  └  qwen3.5-2b · 322 tokens · 5.2 tok/s · 62s
```

Web sources show their URL and documents show their name. The chat runs in the project given with `--project`, else the one the current folder [syncs to](#syncing-a-folder), else the server's current project.

| Key | Action |
|---|---|
| Enter | Send the prompt |
| Esc | Interrupt the reply |
| ↑ / ↓ | Earlier prompts |
| Shift+Enter, Alt+Enter or Ctrl+J | New line in the prompt |
| Mouse wheel, PgUp / PgDn | Scroll the conversation |
| Drag | Select text and copy it to the clipboard |
| Ctrl+O | Models: enable one (downloading it first) or disable it |
| Ctrl+S | Turn web search on or off for the project |
| Ctrl+P | Projects: switch, create, import or delete |
| Tab (empty prompt) | Turn auto-approve for the agent's shell commands on or off |
| ? | All shortcuts |

Typing `/` lists the commands, narrowing as you type:

| Command | Action |
|---|---|
| `/login` | Sign in in the browser without leaving the chat; `/login --token` pastes a token into a masked field instead |
| `/logout` | Log out |
| `/models` | The project's models: enable one (downloading it first) or disable it |
| `/mcp` | The project's MCP servers, with each one's state and tool count; `/mcp add <url>` connects a new one |
| `/project` | Switch projects (in a new session), or create, import and delete them; `/project <name>` switches straight to one |
| `/sync` | Keep this folder's documents in the project; `/sync status` and `/sync stop` too (see [Syncing a folder](#syncing-a-folder)) |
| `/code [on\|off\|auto]` | Whether prompts in this folder are answered with code (see [Coding with Docent](./coding.md)) |
| `/write [path]` | Write the last reply's files that were held back, or one of them |
| `!<command>` | Run a shell command in the working directory; its output goes to the agent with your next prompt |
| `!<command> &` | Run it in the background, as a dev server, listed under the prompt until it ends |
| `/tasks` | The commands still running: ↑ ↓ pick one, Enter shows all it printed, `x` stops it (also Ctrl+B) |
| `/stop [word]` | Stop the commands still running, or those with the word in their command |
| `/status` | The project, session, account, agent, loaded model and versions |
| `/usage` | Web searches and cloud model credits left this month, with your plan and reset date, plus the last 7 days' tokens and the estimated cost saved |
| `/upgrade` | Open [app.smartloop.ai/upgrade](https://app.smartloop.ai/upgrade) to buy more searches or manage billing |
| `/clear` | Clear the chat and start a new session |
| `/help` | All shortcuts and commands |
| `/quit` | Quit |

Models, MCP servers, status, usage and help open under the prompt, where the commands are listed; Esc closes them. When you quit, the session ID is printed so you can resume it.

### Syncing a folder

`/sync` links the folder you opened Docent in to the current project and keeps the project in step with it: documents you add, change or delete there are added, updated or removed in the project a few seconds later, and indexed for search. Each pass reports what it sent, such as `Synced: 2 added, 1 removed`, and the status line shows the indexing that follows.

It picks up PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), CSV, Markdown and text files, skipping hidden folders and anything in `.gitignore` or a `.docentignore`. Skills go in `.docent/skills/<name>.md` (or `<name>/SKILL.md`) and are pushed to the project too. The link itself is kept in `.docent/manifest.json`, which stays out of git; the skills are meant to be committed.

A project syncs from one folder, and keeps syncing from it whichever folder you open Docent in, or when you switch to it with `/project`; a notice says where when it isn't the one you're in.

| Command | Action |
|---|---|
| `/sync` | Link this folder to the current project and start syncing it. A first sync of more than 200 documents or 500 MB asks for `/sync --yes`; your home folder is never synced. |
| `/sync --move` | Sync this folder for a project that already syncs another; the old folder is paused |
| `/sync status` | The project's folder, how many documents and skills are synced, and what's waiting to go |
| `/sync stop` | Pause syncing until `/sync` again |

Drop a file on the terminal, or paste its path, to attach it. It shows in the prompt as `[Image 1]` or `[Doc 1]`, Backspace removes it, and it's uploaded with your message so the answer can draw on it. Images can be PNG or JPEG; documents can be PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), CSV, text, HTML or JSON. Any other file is turned away with a note in the chat.

Pass a first prompt to send right away:

```sh
docent run "what are some places to visit in the united states?"
```

When stdin or stdout isn't a terminal, or with `--plain`, `run` chats line by line instead, for scripts and pipes. It keeps reading prompts until `/quit`, `/exit` or `exit`. The answer streams on stdout, with its sources listed under it, and the assistant's progress is printed as `[step] message` lines on stderr, followed by a `[stats]` line, so a piped reply stays clean.

| Option | Meaning |
|---|---|
| `--project <project-id>` | Project to chat in. With `--plain`, `run` otherwise lists your projects and asks which one to use. |
| `--session <session-id>` | Resume an existing conversation. A new one is started when omitted. |
| `--plain` | Chat line by line instead of in the full-screen app. |

## Coding

Open Docent in a code project and ask for a change: the reply's files show as live diffs, are written into the folder, and are checked with the project's build (`cargo check`, `go build`, `tsc --noEmit`…), with errors sent back to the agent until the check passes. Commits, installs and test runs come back as shell commands that run once you press Enter. See [Coding with Docent](./coding.md).

## Checking your usage

`/usage` shows how many of the month's [web searches](./web-search.md) you have left as a bar, with your plan and when the count resets, and the share of the month's cloud model credits left. When credits are spent, answers come from local models. Under it are the tokens your local models used over the last 7 days and an estimate of what they would have cost on a hosted model. Once you've used 70% of the month's searches, the footer under the prompt says how many are left and points at `/upgrade`; you can buy more from the dashboard. You can also check your searches at [app.smartloop.ai/settings/websearch](https://app.smartloop.ai/settings/websearch/).

## Models

The orchestrator picks which model handles each step of a request, choosing from the models enabled for the project. See [Model orchestration](./model-orchestration.md). `/models` (or Ctrl+O) lists the available models with their state and capabilities, and enables or disables them.

Enabling a model downloads it first if it isn't on disk yet, with the same checklist as the first run. Models are shared across projects, so each one downloads only once. Models marked `(sign in)` need [`/login`](#signing-in) first. Disabling one also unloads it from memory. The `sl-mini` orchestration model is always on, so it isn't listed.

A model's capabilities (`text`, `vision`, `reasoning`, `thinking`) come from the catalog. For a model the catalog doesn't describe, set them yourself with `/models <name> caps text,vision,reasoning`; `/models <name> caps auto` goes back to the catalog's.

## Connections

Connect an MCP server from the chat by its URL:

```
/mcp add https://mcp.8raise.com/mcp
```

A server that needs a sign-in opens it in your browser, and the chat says when the server is connected and how many tools it has. `/mcp` lists the project's servers; in that list, Ctrl+D removes the selected one and Ctrl+R refreshes. Servers added in Studio's Connections panel show up here too, and the other way round — see [Connections](./mcp-servers.md).

Some servers to try: [Tavily](https://docs.tavily.com/documentation/mcp) for web search, [8Raise](https://8raise.com/connect) for investor search, and [Clera](https://www.getclera.com/mcp) for startup hiring.

## Using Docent with Studio

Studio and Docent share one agent: whichever starts first runs it, and the other connects to it. Projects, models, and your sign-in are the same in both.

- If you quit Studio, it stops the agent, including one Docent started. The next `docent` command starts it again.
- `docent agent stop` stops the agent Studio is using too.
- The Mac App Store edition of Studio keeps its data inside its app container, not in `~/.smartloop`, so it doesn't share projects or models with Docent. Don't run the two at the same time.

## Configuration

Docent connects to the local agent on the port in `~/.smartloop/server.port`, and starts the agent when none is running. To use an agent somewhere else, set `SMARTLOOP_API_URL`. Docent then only connects: it never installs or starts anything for that address.

```sh
SMARTLOOP_API_URL=http://localhost:9000 docent agent status
```

| Variable | Default | Effect |
|---|---|---|
| `SLP_HOME` | `~/.smartloop` | Where the framework, projects, models, and logs live. |
| `SLP_PORT` | a free port | Pin the local agent to this port instead. |
| `SMARTLOOP_APP_URL` | `https://app.smartloop.ai` | Where `/login` signs you in. |

## Platforms

Prebuilt binaries are published for macOS (Apple Silicon and Intel), Linux (x86_64 and aarch64), and Windows (x86_64).
