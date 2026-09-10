/** Where the Jira instance lives, and whether hovering a key fetches its summary. */
export interface JiraSettings {
	jiraBaseUrl: string;
	enablePreview: boolean;
}

/** No Jira host ships as a default; keys stay plain text until one is set. */
export const DEFAULT_SETTINGS: JiraSettings = {
	jiraBaseUrl: "",
	enablePreview: true,
};

/** The three fields the preview reads. Everything else Jira returns is ignored. */
export interface JiraIssue {
	key?: string;
	fields?: {
		summary?: string;
		status?: { name?: string };
		assignee?: { displayName?: string };
	};
}

/** What the preview renders, after the response has been reduced to strings. */
export interface IssueSummary {
	key: string;
	summary: string;
	status: string;
	assignee: string;
}
