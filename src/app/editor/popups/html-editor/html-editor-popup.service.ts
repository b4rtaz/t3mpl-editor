import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PopupService } from '../popup.service';
import { HtmlEditorPopupComponent } from './html-editor-popup.component';

@Injectable()
export class HtmlEditorPopupService {

	public constructor(
		private readonly popupService: PopupService) {
	}

	public edit(filePath: string): Observable<string> {
		return this.popupService.open(HtmlEditorPopupComponent, i => {
			i.filePath = filePath;
		});
	}
}
