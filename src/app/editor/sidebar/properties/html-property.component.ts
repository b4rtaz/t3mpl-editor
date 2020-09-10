import { Component, Input, OnInit } from '@angular/core';
import { HtmlPropertyContract } from 't3mpl-core/core/model';

import { HtmlEditorPopupService } from '../../popups/html-editor/html-editor-popup.service';
import { StateService } from '../../state.service';

@Component({
	selector: 'app-html-property',
	templateUrl: './html-property.component.html'
})
export class HtmlPropertyComponent implements OnInit {

	@Input()
	public property: HtmlPropertyContract;
	@Input()
	public dataPath: string;

	public value: string;
	public charCount: number;
	public validationError: string;

	public constructor(
		private readonly stateService: StateService,
		private readonly htmlEditorPopupService: HtmlEditorPopupService) {
	}

	public ngOnInit() {
		this.value = this.stateService.getValue<string>(this.dataPath);
		this.validate();
		this.reloadCharCount();
	}

	public edit() {
		this.htmlEditorPopupService.edit(this.value)
			.subscribe((filePath: string) => {
				this.value = filePath;
				this.validate();
				this.stateService.setValue(this.dataPath, this.value);
				this.reloadCharCount();
			});
	}

	private reloadCharCount() {
		if (this.value) {
			this.charCount = this.stateService.contentStorage.getContent('text', this.value).length;
		} else {
			this.charCount = null;
		}
	}

	private validate() {
		this.validationError = this.stateService.validate(this.property, this.dataPath, this.value);
	}
}
