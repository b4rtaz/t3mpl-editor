import { Injectable } from '@angular/core';

import { PopupService } from '../popup.service';
import { ExportPopupMode } from './export-popup-mode';
import { ExportPopupComponent } from './export-popup.component';

@Injectable()
export class ExportPopupService {

	public constructor(
		private readonly popupService: PopupService) {
	}

	public open(mode: ExportPopupMode) {
		this.popupService.open(ExportPopupComponent, i => {
			i.mode = mode;
		}).subscribe(() => {});
	}
}
