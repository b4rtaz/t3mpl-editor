import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PopupService } from '../popup.service';
import { MarkdownEditorPopupComponent } from './markdown-editor-popup.component';

@Injectable()
export class MarkdownEditorPopupService {

	public constructor(
		private readonly popupService: PopupService) {
	}

	public edit(filePath: string): Observable<string> {
		return this.popupService.open(MarkdownEditorPopupComponent, i => {
			i.filePath = filePath;
		});
	}
}
