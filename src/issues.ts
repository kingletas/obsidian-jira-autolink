const ISSUE_KEY = /\b[A-Z][A-Z0-9]+-\d+\b/g;

const SKIP_TAGS = new Set(["CODE", "PRE", "A", "SCRIPT", "STYLE"]);

export interface IssueMatch {
	key: string;
	index: number;
}

/** Every issue key in `text`, with its offset. A fresh regex per call, because `lastIndex` on a shared `/g` regex skips matches. */
export function findIssueKeys(text: string): IssueMatch[] {
	const regex = new RegExp(ISSUE_KEY.source, "g");
	const found: IssueMatch[] = [];
	let match: RegExpExecArray | null;
	while ((match = regex.exec(text))) {
		found.push({ key: match[0], index: match.index });
	}
	return found;
}

/** Whether a node sits inside markup where a key must be left as text. */
export function shouldSkip(node: Node): boolean {
	let parent = node.parentElement;
	while (parent) {
		if (SKIP_TAGS.has(parent.tagName)) return true;
		parent = parent.parentElement;
	}
	return false;
}

/** The browse URL for a key. Trailing slashes are trimmed so `https://host/` cannot yield a doubled slash. */
export function issueUrl(baseUrl: string, key: string): string {
	return `${baseUrl.replace(/\/+$/, "")}/browse/${encodeURIComponent(key)}`;
}

/** The REST endpoint the hover preview reads. */
export function issueApiUrl(baseUrl: string, key: string): string {
	return `${baseUrl.replace(/\/+$/, "")}/rest/api/2/issue/${encodeURIComponent(key)}`;
}
