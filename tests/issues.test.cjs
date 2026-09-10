const { assert, suite, test, done, load, nodeIn } = require("./harness.cjs");
const { findIssueKeys, shouldSkip, issueUrl, issueApiUrl } = load("issues");

suite("issues");

test("finds a single key", () => {
	assert.deepStrictEqual(findIssueKeys("see PROJ-123 today"), [{ key: "PROJ-123", index: 4 }]);
});

// The bug this pins: the old code shared one /g regex between .test() calls, so
// lastIndex carried over and every second candidate was skipped.
test("finds every key in a run, not every other one", () => {
	const keys = findIssueKeys("AB-1 CD-2 EF-3 GH-4").map((m) => m.key);
	assert.deepStrictEqual(keys, ["AB-1", "CD-2", "EF-3", "GH-4"]);
});

test("repeated calls do not skip", () => {
	for (let i = 0; i < 5; i++) {
		assert.strictEqual(findIssueKeys("ACME-9").length, 1, `call ${i}`);
	}
});

test("ignores lowercase and bare numbers", () => {
	assert.deepStrictEqual(findIssueKeys("proj-1 and 12-34 and X-1"), []);
});

test("skips code, pre, anchors, script and style", () => {
	for (const tag of ["CODE", "PRE", "A", "SCRIPT", "STYLE"]) {
		assert.strictEqual(shouldSkip(nodeIn("DIV", tag)), true, tag);
	}
	assert.strictEqual(shouldSkip(nodeIn("DIV", "P")), false);
});

test("builds a browse url and trims a trailing slash", () => {
	assert.strictEqual(issueUrl("https://h.net/", "AB-1"), "https://h.net/browse/AB-1");
	assert.strictEqual(issueApiUrl("https://h.net", "AB-1"), "https://h.net/rest/api/2/issue/AB-1");
});

done();
