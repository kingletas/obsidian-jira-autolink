const { assert, suite, test, done, load } = require("./harness.cjs");
const { DEFAULT_SETTINGS } = load("types");

suite("settings");

test("ships with no Jira host, so nothing links until one is set", () => {
	assert.strictEqual(DEFAULT_SETTINGS.jiraBaseUrl, "");
});

test("ships with the hover preview on", () => {
	assert.strictEqual(DEFAULT_SETTINGS.enablePreview, true);
});

done();
