import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PopupService } from '../popup.service';
import { ConfirmPopupMode } from './confirm-popup-mode';
import { ConfirmPopupComponent } from './confirm-popup.component';

@Injectable()
export class ConfirmPopupService {

	public constructor(
		private readonly popupService: PopupService) {
	}

	public ok(title: string, message: string) {
		this.show(ConfirmPopupMode.ok, title, message)
			.subscribe(() => {});
	}

	public prompt(title: string, message: string): Observable<boolean> {
		return this.show(ConfirmPopupMode.okCancel, title, message);
	}

	private show(mode: ConfirmPopupMode, title: string, message: string): Observable<boolean> {
		return this.popupService.open(ConfirmPopupComponent, i => {
			i.mode = mode;
			i.title = title;
			i.message = message;
		});
	}
}
