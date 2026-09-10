// Bundles each module into CJS the tests can require(). The plugin ships as
// ESM-flavoured TypeScript and Node will not require() that, so this is one
// esbuild call per entry point, output into tests/build/, which is gitignored.
import { build } from "esbuild";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const out = join(here, "build");
mkdirSync(out, { recursive: true });

const ENTRIES = ["types.ts", "issues.ts", "preview.ts"];

const stubObsidian = {
	name: "stub-obsidian",
	setup(b) {
		b.onResolve({ filter: /^obsidian$/ }, () => ({ path: "obsidian", namespace: "stub" }));
		b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
			contents: `
				export class Plugin {}
				export class PluginSettingTab {}
				export class Setting {}
			`,
			loader: "js",
		}));
	},
};

for (const entry of ENTRIES) {
	await build({
		entryPoints: [join(root, "src", entry)],
		bundle: true,
		format: "cjs",
		platform: "node",
		target: "es2018",
		outfile: join(out, `${entry.replace(/\.ts$/, "")}.cjs`),
		logLevel: "error",
		plugins: [stubObsidian],
	});
}

console.log(`build\n  ok  ${ENTRIES.length} modules bundled\n`);
