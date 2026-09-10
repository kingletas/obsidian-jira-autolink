<h1 align="center">🔗 Jira Auto Link</h1>

<p align="center">
  Turns <code>PROJ-123</code> into a link to your Jira, wherever it appears in a note.<br>
  Hover it to see the summary, status and assignee.
</p>

<p align="center">
  <img alt="Obsidian" src="https://img.shields.io/badge/obsidian-0.15.0%2B-7c3aed">
  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-strict-2a6db2">
  <img alt="Tests" src="https://img.shields.io/badge/tests-13-brightgreen">
  <img alt="Mobile" src="https://img.shields.io/badge/mobile-supported-16a34a">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

---

## What it does

Any Jira issue key in reading view becomes a link to `<your Jira>/browse/<KEY>`. A key is an uppercase project code, a hyphen and digits — `ACME-1`, `PROJ-4821`, `AB12-9`.

Keys inside code spans, code blocks, existing links, `<script>` and `<style>` are left alone, so a ticket id quoted in a snippet stays text.

With **hover preview** on, pointing at a link fetches the issue and shows its summary, status and assignee. The result is cached for the session.

## Settings

| Setting | Default | What it does |
|---|---|---|
| Jira base URL | empty | The instance to link to, such as `https://example.atlassian.net`. Nothing is linked until you set it. Trailing slashes are trimmed. |
| Enable hover preview | on | Fetch the summary on hover. Turn it off to make the plugin link-only and network-free. |

## Install

New to building Obsidian plugins? [`docs/from-nothing.md`](docs/from-nothing.md) walks through every step, from a clean machine to your first linked key.

```bash
make install VAULT=/path/to/your/vault
```

Then enable **Jira Auto Link** in Obsidian's community plugins list. `make plan` shows what would be copied without doing it.

## Develop

```bash
make check
```

Type-checks strict, builds the production bundle, and runs the suite. `make dev` rebuilds on change.

**This tree is the source; the installed plugin folder is an artefact.** Edit here and install — never the other way round.

## What the hover preview needs

The preview calls `\<base\>/rest/api/2/issue/\<KEY\>` from the app, with no credentials of its own. It works when the app already carries a Jira session for that host, and returns nothing when it does not — a failed fetch is logged at warning level and the link still works. **No token is stored by this plugin and none should be.**

## Architecture

| Module | Responsibility |
|---|---|
| `src/types.ts` | Settings and the shape of the Jira response |
| `src/issues.ts` | Finding keys in text, deciding what to skip, building URLs |
| `src/preview.ts` | Reducing a response to strings and building the card |
| `src/settings.ts` | The settings tab |
| `src/main.ts` | The plugin: walking the DOM, replacing text, positioning the card |

The pure half — key matching, skip rules, URL building, card construction — is tested without a running Obsidian, which is most of the logic that can be wrong.
