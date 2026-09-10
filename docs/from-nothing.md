# From nothing to a working Jira Auto Link

This guide takes you from a machine with none of this project on it to Jira issue keys showing up as links in an Obsidian note. It takes about ten minutes.

Every command below was run while this guide was written, and the output shown is what it printed. The steps that happen inside Obsidian's own window weren't run, and each one says so.

## Contents

- [What this is](#what-this-is)
- [What you need](#what-you-need)
- [Step 1: get the source](#step-1-get-the-source)
- [Step 2: install the build tools](#step-2-install-the-build-tools)
- [Step 3: build and check it](#step-3-build-and-check-it)
- [Step 4: see which keys it links](#step-4-see-which-keys-it-links)
- [Step 5: make a test vault and install it](#step-5-make-a-test-vault-and-install-it)
- [Step 6: turn it on and point it at your Jira](#step-6-turn-it-on-and-point-it-at-your-jira)
- [Where to go next](#where-to-go-next)

## What this is

Jira Auto Link is an Obsidian plugin. When a note mentions a Jira issue key, such as `ACME-123`, it turns the key into a link to that issue in your Jira. If you hover the link, it can show the issue's summary, status and assignee.

It changes how a note looks in reading view. It never edits the note itself.

## What you need

- **Git**, to fetch the source.
- **Node.js 20 or newer, with npm.** This guide was run on Node 20.20.2 and npm 10.8.2.
- **Make.** It's already installed on most Linux and macOS machines. This guide wasn't tried on Windows.
- **Obsidian 0.15.0 or newer.**
- **The address of your Jira**, such as `https://example.atlassian.net`. The plugin links nothing until you give it one.

## Step 1: get the source

```bash
git clone https://github.com/kingletas/obsidian-jira-autolink
cd obsidian-jira-autolink
```

This clone from GitHub is not verified: the guide was written before the repository was published, so it was run against a local copy of the same code. That copy printed:

```text
Cloning into 'obsidian-jira-autolink'...
done.
```

## Step 2: install the build tools

```bash
npm ci
```

```text
added 17 packages, and audited 18 packages in 2s

1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

`npm ci` installs exactly the versions listed in `package-lock.json`. These are build tools only: the plugin itself has no runtime dependencies.

## Step 3: build and check it

```bash
make check
```

This type-checks the code, builds `main.js`, runs the test suite, and checks the version numbers agree. The end of the output looks like this:

```text
preview
  ok  reduces a response to four strings
  ok  falls back when fields are missing
  ok  never assigns innerHTML
  ok  writes hostile text verbatim through textContent
  ok  renders key, summary and meta
preview: 5 passed

settings
  ok  ships with no Jira host, so nothing links until one is set
  ok  ships with the hover preview on
settings: 2 passed
3 suites passed
jira-autolink 1.1.0: manifest.json, package.json and versions.json agree

  the bundle builds, the suite passes and the versions agree
```

If any line says `FAIL`, stop here. The lines under it say what went wrong.

## Step 4: see which keys it links

You can check the key matching before you open Obsidian. `make check` left a test build of the matching code in `tests/build/`, and this runs it on a sample sentence:

```bash
node -e 'const { findIssueKeys, issueUrl } = require("./tests/build/issues.cjs"); for (const m of findIssueKeys("Fixed in ACME-123, follow-up in acme-124 and ACME-125.")) console.log(m.key, "->", issueUrl("https://example.atlassian.net", m.key))'
```

```text
ACME-123 -> https://example.atlassian.net/browse/ACME-123
ACME-125 -> https://example.atlassian.net/browse/ACME-125
```

`acme-124` isn't linked, because a key needs an uppercase project code. That's on purpose: it keeps ordinary hyphenated words from turning into links.

## Step 5: make a test vault and install it

Try the plugin in a throwaway vault before your real one. A vault is just a folder with an `.obsidian` folder inside it. This makes one next to the source folder, then installs the plugin into it:

```bash
mkdir -p ../jira-test-vault/.obsidian
make install VAULT=../jira-test-vault
```

```text
> obsidian-jira-autolink@1.1.0 build
> tsc -noEmit -skipLibCheck && node esbuild.config.mjs production

copied main.js -> ../jira-test-vault/.obsidian/plugins/jira-autolink/
copied manifest.json -> ../jira-test-vault/.obsidian/plugins/jira-autolink/
copied styles.css -> ../jira-test-vault/.obsidian/plugins/jira-autolink/

Now enable it in Obsidian: Settings -> Community plugins -> Jira Auto Link.
```

Those three files are the whole plugin. If you leave out `VAULT=`, nothing is installed and `make` tells you how to name one.

## Step 6: turn it on and point it at your Jira

These steps happen in Obsidian's window, and they weren't run while writing this guide.

1. Open Obsidian. Choose **Open folder as vault** and pick the `jira-test-vault` folder.
2. Go to **Settings → Community plugins**. If Obsidian asks, turn on community plugins. Then switch on **Jira Auto Link**.
3. Go to **Settings → Jira Auto Link** and set **Jira base URL** to your Jira's address, such as `https://example.atlassian.net`.
4. Create a note and type `Fixed in ACME-123.`, using a real key from your Jira instead of `ACME-123`.
5. Switch the note to reading view. The key is now a link, and clicking it opens the issue in your browser.

To check you got it right: if the key is still plain text, the base URL is probably empty. Keys inside code, like `` `ACME-123` ``, stay plain text on purpose.

The hover preview only shows a card when the app is already signed in to that Jira. The plugin stores no password or token of its own. If you'd rather it made no network requests at all, turn off **Enable hover preview**.

## Where to go next

- [README](../README.md) lists the settings and explains what the hover preview needs.
- [CONTRIBUTING.md](../CONTRIBUTING.md) covers development and releases.
- [SECURITY.md](../SECURITY.md) says what the plugin reads and sends, and how to report a problem.
