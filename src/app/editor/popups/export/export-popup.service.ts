import { ComponentFactoryResolver, Injectable } from '@angular/core';

import { PopupService } from '../popup.service';
import { ExportPopupMode } from './export-popup-mode';
import { ExportPopupComponent } from './export-popup.component';

@Injectable()
export class ExportPopupService {

	public constructor(
		private readonly factoryResolver: ComponentFactoryResolver,
		private readonly popupService: PopupService) {
	}

	public open(mode: ExportPopupMode) {
		const factory = this.factoryResolver.resolveComponentFactory(ExportPopupComponent);
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
