const { assert, suite, test, done, load, fakeDocument } = require("./harness.cjs");
const { buildPreview, summarise } = load("preview");

suite("preview");

test("reduces a response to four strings", () => {
	const s = summarise("AB-1", {
		key: "AB-1",
		fields: { summary: "Fix it", status: { name: "Done" }, assignee: { displayName: "Lee" } },
	});
	assert.deepStrictEqual(s, { key: "AB-1", summary: "Fix it", status: "Done", assignee: "Lee" });
});

test("falls back when fields are missing", () => {
	assert.deepStrictEqual(summarise("AB-2", {}), {
		key: "AB-2",
		summary: "",
		status: "",
		assignee: "Unassigned",
	});
});

// The defect this pins: the old preview interpolated the Jira summary into
// innerHTML, so an issue titled with markup executed it. fakeDocument throws on
// any innerHTML assignment.
test("never assigns innerHTML", () => {
	const doc = fakeDocument();
	const hostile = summarise("AB-3", {
		fields: { summary: '<img src=x onerror="alert(1)">' },
	});
	assert.doesNotThrow(() => buildPreview(doc, hostile));
});

test("writes hostile text verbatim through textContent", () => {
	const doc = fakeDocument();
	const payload = '<script>alert(1)</script>';
	buildPreview(doc, summarise("AB-4", { fields: { summary: payload } }));
	const summary = doc.created.find((el) => el.className === "jira-summary");
	assert.strictEqual(summary.textContent, payload);
});

test("renders key, summary and meta", () => {
	const doc = fakeDocument();
	buildPreview(doc, { key: "AB-5", summary: "S", status: "Open", assignee: "Lee" });
	const classes = doc.created.map((el) => el.className);
	assert.deepStrictEqual(classes, ["jira-preview", "jira-title", "jira-summary", "jira-meta"]);
	const meta = doc.created.find((el) => el.className === "jira-meta");
	assert.strictEqual(meta.textContent, "Status: Open · Assignee: Lee");
});

done();
