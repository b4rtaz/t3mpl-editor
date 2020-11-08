import { Injectable } from '@angular/core';

import { PopupService } from '../popup.service';
import { UploaderPopupComponent } from './uploader-popup.component';

@Injectable()
export class UploaderPopupService {

	public constructor(
		private readonly popupService: PopupService) {
	}

	public open() {
		this.popupService.open(UploaderPopupComponent, () => {})
			.subscribe(() => {});
	}
}
