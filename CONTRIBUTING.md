# Contributing

Thanks for looking. This file covers the mechanics. [README.md](README.md) explains what the plugin does, and [docs/from-nothing.md](docs/from-nothing.md) walks through a first install.

## Getting set up

You need Git, Node.js 20 or newer with npm, and Make. Clone this repository, go into its folder, then run:

```bash
npm ci
make check
```

`npm ci` installs exactly the versions in `package-lock.json`, and fails if that file and `package.json` disagree.

Develop against a throwaway vault, not your real one. `make install VAULT=../some-test-vault` builds the plugin and copies it in, and `make dev` rebuilds on every save.

## The gate

```bash
make check
```

That's everything a change has to pass, and it's what CI runs. It type-checks, builds `main.js`, runs the suite, and checks that `manifest.json`, `package.json` and `versions.json` carry the same version.

The suite tests the pure half of the plugin without a running Obsidian: key matching, skip rules, URL building, the preview card and the default settings. `src/main.ts`, which walks the note and places the card, isn't covered, so say in your pull request how you checked a change there.

## What a change should look like

- One concern per pull request, with the reasoning in the description.
- `make check` green.
- A test that fails before your change and passes after it. **One direction isn't a test**: something that fires isn't evidence it can be quiet, and something quiet isn't evidence it can fire.
- An entry in `CHANGELOG.md` under `Unreleased`, saying what changed for someone using the plugin rather than what the diff did.
- Comments say what the code does or what it guards against, in a sentence or two. History belongs in the commit message and the changelog.
- Examples use invented Jira hosts and keys, such as `ACME-123` on `https://example.atlassian.net`, never a real organisation's.

Two rules protect people using the plugin:

- **Never build the preview card with `innerHTML`.** Every value in it comes from a Jira response, so markup in an issue summary would run inside the vault. The test harness's fake document throws on any `innerHTML` assignment.
- **Never store a Jira token.** The hover preview uses whatever Jira session the app already has, and shows no card when there isn't one.

## Releasing

1. Bump the version in `manifest.json`, `package.json` and `versions.json`, and move the `Unreleased` notes in `CHANGELOG.md` under a heading for the new version, such as `## [1.2.0]`.
2. Run `make check`. It fails if the three files disagree.
3. Tag the commit with the bare version and push the tag: `git tag 1.2.0 && git push origin 1.2.0`.

Don't put a `v` in front of the tag. Obsidian's installer looks for a release whose tag equals the version in `manifest.json`, and the release workflow refuses a tag that doesn't match. The workflow builds `main.js`, then attaches it to the release with `manifest.json` and `styles.css`, and uses the version's `CHANGELOG.md` section as the release notes.

## Security

Don't open a public issue for a vulnerability. [SECURITY.md](SECURITY.md) has the reporting route.
