import { ComponentFactoryResolver, Injectable } from '@angular/core';

import { PopupService } from '../popup.service';
import { ImportPopupMode } from './import-popup-mode';
import { ImportPopupComponent } from './import-popup.component';

@Injectable()
export class ImportPopupService {

	public constructor(
		private readonly factoryResolver: ComponentFactoryResolver,
		private readonly popupService: PopupService) {
	}

	public show(mode: ImportPopupMode) {
		const factory = this.factoryResolver.resolveComponentFactory(ImportPopupComponent);
		const container = this.popupService.getContainer();

		const component = factory.create(container.injector);
		component.instance.mode = mode;
		container.insert(component.hostView);

		component.instance.result
			.subscribe(() => {
				container.remove();
			});
	}
}
