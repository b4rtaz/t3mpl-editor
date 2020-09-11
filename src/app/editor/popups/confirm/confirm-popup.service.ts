import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PopupService } from '../popup.service';
import { ConfirmPopupMode } from './confirm-popup-mode';
import { ConfirmPopupComponent } from './confirm-popup.component';

@Injectable()
export class ConfirmPopupService {

	public constructor(
		private readonly factoryResolver: ComponentFactoryResolver,
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
		const factory = this.factoryResolver.resolveComponentFactory(ConfirmPopupComponent);
		const container = this.popupService.getContainer();

		const component = factory.create(container.injector);
		component.instance.mode = mode;
		component.instance.title = title;
		component.instance.message = message;
		container.insert(component.hostView);

		return component.instance.result
			.pipe(map(r => {
				container.remove();
				return r;
			}));
	}
}
