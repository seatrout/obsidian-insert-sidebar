import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface ACBPluginSettings {
	ACBSetting: string;
}

const DEFAULT_SETTINGS: ACBPluginSettings = {
	ACBSetting: 'default'
}

export default class ACBPlugin extends Plugin {
	settings: ACBPluginSettings;

	async onload() {
		await this.loadSettings();
/*
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		*/
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sidenote-open',
			name: 'make an open side note',
			editorCallback:(editor:Editor,view:MarkdownView)=> {
				const noteBody = editor.getSelection();

				const openSideNote = '<span class="aside-show">';
				const endSideNote='</span>';
				editor.replaceSelection(openSideNote+noteBody+endSideNote);
			}
		})
		this.addCommand({
			id: 'sidenote-hidden',
			name: 'make a hidden side note',
			editorCallback:(editor:Editor,view:MarkdownView)=> {
				const noteBody = editor.getSelection();
				const openSideNote = '<span class="aside-hide">';
				const endSideNote='</span>';
				editor.replaceSelection(openSideNote+noteBody+endSideNote);
			}
		})
		this.addCommand({
			id: 'internal-link',
			name: 'Convert selected text to link',
			editorCallback:(editor:Editor,view:MarkdownView)=> {
				const linktext = editor.getSelection();
				const startpos = editor.getCursor("from")
				const openlink = '[[|';
				const endlink=']]';
				editor.replaceSelection(openlink+linktext+endlink);
				editor.setCursor(startpos)
			}

		})
		// This adds a complex command that can check whether the current state of the app allows execution of the command

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



class SampleSettingTab extends PluginSettingTab {
	plugin: ACBPlugin;

	constructor(app: App, plugin: ACBPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for ACB plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.ACBSetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.ACBSetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
