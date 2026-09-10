// The smallest test harness that prints like the other plugins here.
const assert = require("assert");
const { join } = require("path");

let passed = 0;
let failed = 0;
let name = "";

function suite(title) {
	name = title;
	console.log(`\n${title}`);
}

function test(label, fn) {
	try {
		fn();
		passed++;
		console.log(`  ok  ${label}`);
	} catch (error) {
		failed++;
		console.log(`  FAIL ${label}`);
		console.log(String(error.message).split("\n").map((l) => `       ${l}`).join("\n"));
	}
}

function done() {
	console.log(`${name}: ${passed} passed${failed ? `, ${failed} FAILED` : ""}`);
	if (failed) process.exit(1);
}

const load = (mod) => require(join(__dirname, "build", `${mod}.cjs`));

// A DOM stand-in recording exactly how each value was set, so a test can prove a
// field went through textContent rather than innerHTML.
function fakeDocument() {
	const created = [];
	return {
		created,
		createElement(tag) {
			const el = {
				tag,
				className: "",
				textContent: null,
				children: [],
				appendChild(child) {
					el.children.push(child);
					return child;
				},
				set innerHTML(value) {
					throw new Error(`innerHTML was assigned: ${value}`);
				},
			};
			created.push(el);
			return el;
		},
	};
}

// A parent chain the skip test can walk without a real DOM.
function nodeIn(...tags) {
	let parent = null;
	for (const tag of tags) parent = { tagName: tag, parentElement: parent };
	return { parentElement: parent };
}

module.exports = { assert, suite, test, done, load, fakeDocument, nodeIn };
