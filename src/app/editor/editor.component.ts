import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataActivator } from 't3mpl-core/core/data/data-activator';
import { MemoryStorage } from 't3mpl-core/core/memory-storage';

import { ConfirmPopupService } from './popups/confirm/confirm-popup.service';
import { PopupService } from './popups/popup.service';
import { RemoteTemplateLoader, Template } from './remote-template-loader';
import { StateService } from './state.service';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {

	@Input()
	public manifestUrl: string;

	@ViewChild('container', { static: true, read: ViewContainerRef })
	public container: ViewContainerRef;

	public constructor(
		private readonly popupService: PopupService,
		private readonly confirmPopupService: ConfirmPopupService,
		private readonly stateService: StateService,
		private readonly titleService: Title) {
	}

	public ngOnInit() {
		this.popupService.setContainer(this.container);
		this.stateService.onStateChanged.subscribe(() => this.onStateChanged());

		if (this.manifestUrl) {
			this.loadRemoteTemplate(this.manifestUrl);
		}
	}

	private loadRemoteTemplate(manifestUrl: string) {
		const loader = new RemoteTemplateLoader();
		loader.load(manifestUrl)
			.then(t => this.loadedTemplate(t))
			.catch(e => {
				const message = e instanceof Error ? e.message : e.toString();
				this.confirmPopupService.ok('An error occurred', `Cannot load a template. ${message}`);
				console.error(e);
			});
	}

	private loadedTemplate(template: Template) {
		const contentStorage = new MemoryStorage();

		const activator = new DataActivator(template.templateStorage, contentStorage);
		const data = activator.createInstance(template.templateManifest.dataContract);

		this.stateService.setState(
			template.templateManifest,
			template.templateStorage,
			contentStorage,
			data);
	}

	private onStateChanged() {
		this.reloadPageTitle();
	}

	private reloadPageTitle() {
		const templateName = this.stateService.templateManifest.meta.name;
		const separator = ' - ';
		const suffix = readTitleSuffix(this.titleService.getTitle(), separator);
		this.titleService.setTitle(templateName + separator + suffix);
	}
}

export function readTitleSuffix(title: string, separator: string): string {
	const p = title.lastIndexOf(separator);
	return p > 0 ? title.substring(p + separator.length) : title;
}
