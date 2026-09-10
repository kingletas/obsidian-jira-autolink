import type { JiraIssue, IssueSummary } from "./types";

/** The minimum of `document` the preview builder uses, so tests need no DOM. */
export interface ElementFactory {
	createElement(tag: string): {
		className: string;
		textContent: string | null;
		appendChild(child: unknown): unknown;
	};
}

/** Reduces a Jira response to the four strings the preview shows. */
export function summarise(key: string, issue: JiraIssue | null): IssueSummary {
	return {
		key: issue?.key ?? key,
		summary: issue?.fields?.summary ?? "",
		status: issue?.fields?.status?.name ?? "",
		assignee: issue?.fields?.assignee?.displayName ?? "Unassigned",
	};
}

/** Builds the preview card, writing every value through `textContent` because a Jira summary is attacker-controlled. */
export function buildPreview(doc: ElementFactory, issue: IssueSummary): unknown {
	const card = doc.createElement("div");
	card.className = "jira-preview";

	const title = doc.createElement("div");
	title.className = "jira-title";
	title.textContent = issue.key;
	card.appendChild(title);

	const summary = doc.createElement("div");
	summary.className = "jira-summary";
	summary.textContent = issue.summary;
	card.appendChild(summary);

	const meta = doc.createElement("div");
	meta.className = "jira-meta";
	meta.textContent = `Status: ${issue.status} · Assignee: ${issue.assignee}`;
	card.appendChild(meta);

	return card;
}
