import { Component, Input, OnInit } from '@angular/core';
import { HtmlPropertyContract } from 't3mpl-core/core/model';

import { MarkdownEditorPopupService } from '../../popups/markdown-editor/markdown-editor-popup.service';
import { StateService } from '../../state.service';

@Component({
	selector: 'app-markdown-property',
	templateUrl: './markdown-property.component.html'
})
export class MarkdownPropertyComponent implements OnInit {

	@Input()
	public property: HtmlPropertyContract;
	@Input()
	public dataPath: string;

	public value: string;
	public charCount: number;
	public validationError: string;

	public constructor(
		private readonly stateService: StateService,
		private readonly markdownEditorPopupService: MarkdownEditorPopupService) {
	}

	public ngOnInit() {
		this.value = this.stateService.getValue<string>(this.dataPath);
		this.validate();
		this.reloadCharCount();
	}

	public edit() {
		this.markdownEditorPopupService.edit(this.value)
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
