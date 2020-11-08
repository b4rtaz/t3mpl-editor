import { Injectable } from '@angular/core';

import { PopupService } from '../popup.service';
import { ImportPopupMode } from './import-popup-mode';
import { ImportPopupComponent } from './import-popup.component';

@Injectable()
export class ImportPopupService {

	public constructor(
		private readonly popupService: PopupService) {
	}

	public show(mode: ImportPopupMode) {
		this.popupService.open(ImportPopupComponent, i => {
			i.mode = mode;
		}).subscribe(() => {});
	}
}
