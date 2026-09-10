import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, type JiraIssue, type JiraSettings } from "./types";
import { findIssueKeys, issueApiUrl, issueUrl, shouldSkip } from "./issues";
import { buildPreview, summarise } from "./preview";
import { JiraSettingTab } from "./settings";

const PREVIEW_CLASS = "jira-preview";
const LINK_CLASS = "jira-link";
const PREVIEW_OFFSET_PX = 5;

export default class JiraAutoLinkPlugin extends Plugin {
	settings: JiraSettings = { ...DEFAULT_SETTINGS };

	private readonly cache = new Map<string, JiraIssue | null>();

	async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new JiraSettingTab(this.app, this));
		this.registerMarkdownPostProcessor((element) => this.linkIssueKeys(element));
	}

	onunload(): void {
		this.removePreview();
	}

	private linkIssueKeys(element: HTMLElement): void {
		if (!this.settings.jiraBaseUrl.trim()) return;

		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		const targets: Node[] = [];
		let node: Node | null;

		while ((node = walker.nextNode())) {
			const value = node.nodeValue;
			if (!value || shouldSkip(node)) continue;
			if (findIssueKeys(value).length > 0) targets.push(node);
		}

		for (const target of targets) this.replaceKeys(target);
	}

	private replaceKeys(textNode: Node): void {
		const text = textNode.nodeValue ?? "";
		const fragment = document.createDocumentFragment();
		let cursor = 0;

		for (const match of findIssueKeys(text)) {
			const before = text.slice(cursor, match.index);
			if (before) fragment.appendChild(document.createTextNode(before));
			fragment.appendChild(this.createLink(match.key));
			cursor = match.index + match.key.length;
		}

		const after = text.slice(cursor);
		if (after) fragment.appendChild(document.createTextNode(after));

		(textNode as ChildNode).replaceWith(fragment);
	}

	private createLink(key: string): HTMLAnchorElement {
		const anchor = document.createElement("a");
		anchor.className = LINK_CLASS;
		anchor.href = issueUrl(this.settings.jiraBaseUrl, key);
		anchor.textContent = key;
		anchor.target = "_blank";
		// Without this the opened tab can rewrite this one through window.opener.
		anchor.rel = "noopener noreferrer";
		this.registerDomEvent(anchor, "mouseenter", () => void this.preview(anchor, key));
		this.registerDomEvent(anchor, "mouseleave", () => this.removePreview());
		return anchor;
	}

	private async preview(anchor: HTMLElement, key: string): Promise<void> {
		if (!this.settings.enablePreview) return;

		let issue = this.cache.get(key);
		if (issue === undefined) {
			issue = await this.fetchIssue(key);
			this.cache.set(key, issue);
		}
		if (!issue) return;

		this.removePreview();
		const card = buildPreview(document, summarise(key, issue)) as HTMLElement;
		document.body.appendChild(card);

		// Fixed rather than absolute: getBoundingClientRect is viewport-relative, so
		// an absolutely positioned card drifts away from its link once the note scrolls.
		const rect = anchor.getBoundingClientRect();
		card.style.position = "fixed";
		card.style.top = `${rect.bottom + PREVIEW_OFFSET_PX}px`;
		card.style.left = `${rect.left}px`;
	}

	private async fetchIssue(key: string): Promise<JiraIssue | null> {
		try {
			const response = await fetch(issueApiUrl(this.settings.jiraBaseUrl, key));
			if (!response.ok) {
				console.warn(`jira-autolink: ${key} returned HTTP ${response.status}`);
				return null;
			}
			return (await response.json()) as JiraIssue;
		} catch (error) {
			console.warn(`jira-autolink: could not fetch ${key}`, error);
			return null;
		}
	}

	private removePreview(): void {
		document.querySelectorAll(`.${PREVIEW_CLASS}`).forEach((card) => card.remove());
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
