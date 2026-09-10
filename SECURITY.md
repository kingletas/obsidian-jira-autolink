# Security policy

## Supported versions

The latest release is supported. There are no long-term support branches, and fixes ship in the next release.

## Reporting a vulnerability

**Don't open a public issue.**

Report privately through GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) on this repository, which opens a draft advisory only the maintainers can see. Or email **code@kingletas.com**.

Tell us what it does wrong, how to reach it, and what an attacker gets. A failing test is the clearest report there is.

You'll get an acknowledgement, a triage verdict, and for anything confirmed, a fix with a regression test.

## What the plugin touches

- **Your notes, read-only.** In reading view it replaces issue keys with links. It never writes to a note.
- **Your Jira, only when the hover preview is on.** Hovering a link sends one `GET` to `<base URL>/rest/api/2/issue/<KEY>`. Nothing else is sent anywhere, and nothing is sent until you set a base URL.
- **No credentials.** The plugin stores no token. The request uses whatever Jira session the app already has.

Turn the hover preview off in settings to make the plugin link-only, with no network requests at all.

## In scope

- Markup or script from a Jira response running inside the vault
- A request to any host other than the configured base URL
- A link that opens with access back to the vault window

## Out of scope

- Vulnerabilities in Obsidian or in Jira. Report those to their makers
- Anything that needs an attacker who can already edit your vault or the plugin's settings
