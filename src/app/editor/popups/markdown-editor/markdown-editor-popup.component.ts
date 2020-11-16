import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { IMAGE_CONTENT_BASE_PATH, MARKDOWN_CONTENT_BASE_PATH, MARKDOWN_CONTENT_EXT } from 't3mpl-core/core/constants';
import { generateFileName } from 't3mpl-core/core/utils/file-name-generator';
import { getFileExt } from 't3mpl-core/core/utils/path-utils';

import { FileLoader } from '../../core/file-loader';
import { StateService } from '../../state.service';
import { PopupComponent } from '../popup.service';
import { insertAtCursor } from './insert-at-cursor';

@Component({
	templateUrl: './markdown-editor-popup.component.html'
})
export class MarkdownEditorPopupComponent implements OnInit, PopupComponent<string> {

	public readonly result: Subject<string> = new Subject();

	@Input()
	public filePath: string;

	@ViewChild('textarea', { static: true })
	public textarea: ElementRef<HTMLTextAreaElement>;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		if (this.filePath) {
			this.textarea.nativeElement.value = this.stateService.contentStorage.getContent('text', this.filePath);
		}
	}

	public addImage() {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = false;
		input.addEventListener('change', () => {
			if (input.files.length > 0) {
				this.loadAndAddImage(input.files[0]);
			}
		});
		input.click();
	}

	private async loadAndAddImage(file: File) {
		const content = await FileLoader.loadAsDataURL(file);

		const filePath = IMAGE_CONTENT_BASE_PATH + generateFileName({
			fileExt: getFileExt(file.name)
		});

		this.stateService.contentStorage.setContent('dataUrl', filePath, content);
		insertAtCursor(this.textarea.nativeElement, `![${file.name}](${filePath})`);
	}

	public save() {
		const content = this.textarea.nativeElement.value;
		if (content) {
			if (!this.filePath) {
				this.filePath = MARKDOWN_CONTENT_BASE_PATH + generateFileName({
					fileExt: MARKDOWN_CONTENT_EXT
				});
			}

			this.stateService.contentStorage.setContent('text', this.filePath, content);
			this.result.next(this.filePath);
		} else {
			this.result.next(null);
		}
	}

	public close() {
		this.result.next(this.filePath);
	}
}
