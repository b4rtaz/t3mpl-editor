import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PopupService } from '../popup.service';
import { ImagePickerPopupComponent } from './image-picker-popup.component';

@Injectable()
export class ImagePickerPopupService {

	public constructor(
		private readonly popupService: PopupService) {
	}

	public pick(filePath: string): Observable<string> {
		return this.popupService.open(ImagePickerPopupComponent, i => {
			i.filePath = filePath;
		});
	}
}
