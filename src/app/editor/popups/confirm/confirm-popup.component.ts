import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { PopupComponent } from '../popup.service';
import { ConfirmPopupMode } from './confirm-popup-mode';

@Component({
	templateUrl: './confirm-popup.component.html'
})
export class ConfirmPopupComponent implements OnInit, PopupComponent<boolean> {

	public readonly result: Subject<boolean> = new Subject();

	@Input()
	public mode: ConfirmPopupMode;
	@Input()
	public title: string;
	@Input()
	public message: string;

	public isCancelVisible: boolean;

	public ngOnInit() {
		this.isCancelVisible = this.mode === ConfirmPopupMode.okCancel;
	}

	public close(result: boolean) {
		this.result.next(result);
	}
}
