import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LoaderPopupService } from './popups/loader/loader-popup.service';
import { PopupService } from './popups/popup.service';
import { StateService } from './state.service';
import { TemplateSource } from './template-source';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit, OnChanges {

	@Input()
	public templateSource: TemplateSource;

	@ViewChild('container', { static: true, read: ViewContainerRef })
	public container: ViewContainerRef;

	public constructor(
		private readonly popupService: PopupService,
		private readonly stateService: StateService,
		private readonly titleService: Title,
		private readonly loaderPopup: LoaderPopupService) {
	}

	public ngOnInit() {
		this.popupService.setContainer(this.container);
		this.stateService.onStateChanged.subscribe(() => this.onStateChanged());

		if (this.templateSource) {
			this.load();
		}
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.templateSource && !changes.templateSource.firstChange) {
			this.load();
		}
	}

	private onStateChanged() {
		this.reloadPageTitle();
	}

	private load() {
		this.loaderPopup.load(this.templateSource);
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
