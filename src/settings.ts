import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import type { JiraSettings } from "./types";

/** What the tab needs from the plugin, so no cast is required to construct it. */
export interface SettingsHost extends Plugin {
	settings: JiraSettings;
	saveSettings(): Promise<void>;
}

export class JiraSettingTab extends PluginSettingTab {
	private readonly host: SettingsHost;

	constructor(app: App, host: SettingsHost) {
		super(app, host);
		this.host = host;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName("Jira Auto Link").setHeading();

		new Setting(containerEl)
			.setName("Jira base URL")
			.setDesc("Keys become links once this is set. Example: https://example.atlassian.net")
			.addText((text) =>
				text
					.setPlaceholder("https://example.atlassian.net")
					.setValue(this.host.settings.jiraBaseUrl)
					.onChange(async (value) => {
						this.host.settings.jiraBaseUrl = value.trim();
						await this.host.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Enable hover preview")
			.setDesc("Fetch and show the issue summary on hover. Needs a Jira session in the app.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.host.settings.enablePreview)
					.onChange(async (value) => {
						this.host.settings.enablePreview = value;
						await this.host.saveSettings();
					}),
			);
	}
}
