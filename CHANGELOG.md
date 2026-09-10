# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **No Jira host ships as a default.** The base URL starts empty, and issue keys stay plain text until you set it in the plugin's settings. The previous default pointed at one organisation's Jira, so every other install linked to an instance it had no access to. A base URL you've already saved is kept.
- **CI runs `make check`** on Ubuntu for every push and pull request. `make check` now also fails when `manifest.json`, `package.json` and `versions.json` disagree about the version.
- **A release workflow.** Pushing a tag equal to the version in `manifest.json`, with no leading `v`, builds the plugin and publishes a GitHub release with `main.js`, `manifest.json` and `styles.css` attached, which is what Obsidian's installer downloads.
- The repository gains a contributing guide, which also covers releasing, and a security policy.
- **`make install` and `make plan` need a vault named.** Pass `VAULT=`, or set `OBSIDIAN_VAULT`. The old default pointed at a folder that only existed on the author's machine. When `obsidian-plugin-install` is not on your `PATH`, `scripts/install-plugin.sh` does the build and the copy instead.

## [1.1.0]

### Fixed

- **Roughly half of all issue keys were never linked.** One `/g` regex was shared across every text node and used with `.test()`, so `lastIndex` carried from one node to the next and each surviving node was searched from an arbitrary offset. Measured on a four-node sample it matched two. Each call now builds its own regex, and two tests pin it.
- **A Jira issue summary containing markup executed in the vault.** The preview card was assembled with `innerHTML` and interpolated `key`, `summary`, `status` and `assignee` straight from the API response. Every value now goes through `textContent`, and the test harness's fake document throws on any `innerHTML` assignment, so the shape cannot come back.
- **Preview cards drifted away from their link when a note was scrolled.** `getBoundingClientRect` is viewport-relative and the card was positioned `absolute` against the document. It is `fixed` now, in the stylesheet and in the code that places it.
- **Links opened with `target="_blank"` and no `rel`**, leaving the opened page able to reach back through `window.opener`. They carry `noopener noreferrer`.
- **A failed fetch was swallowed silently.** A 401, a 404 or a network error all produced nothing at all. Failures are logged at warning level with the key and the status, the link still works, and a negative result is cached so a dead key is not re-fetched on every hover.

### Changed

- **The plugin has a source tree.** 1.0.0 kept its `main.ts`, `tsconfig.json`, `package.json` and 32 MB of `node_modules` *inside the installed plugin folder* — the artefact was the only copy of the source. It now has a repository of its own: five modules, bundled by esbuild, type-checked strict, with **11 assertions across two suites**.
- **Hover handlers are registered through `registerDomEvent`**, so they are released when the plugin unloads instead of accumulating on every re-render.
- Preview cards are removed on `mouseleave` and on unload, rather than only when the next one replaces them.
- Settings use `setHeading()` rather than a hand-made `<h2>`, and the base URL is trimmed on entry.

### Removed

- The commented-out Jira host on line 1 of `main.ts`.
- `any` from the response cache, which is typed to the four fields the preview reads.

## [1.0.0]

- Initial version: link Jira issue keys, with an optional hover preview.
