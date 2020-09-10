import { ComponentFactoryResolver, Injectable } from '@angular/core';

import { PopupService } from '../popup.service';
import { TemplateInfoPopupComponent } from './template-info-popup.component';

@Injectable()
export class TemplateInfoPopupService {

	public constructor(
		private readonly factoryResolver: ComponentFactoryResolver,
		private readonly popupService: PopupService) {
	}

	public open() {
		const factory = this.factoryResolver.resolveComponentFactory(TemplateInfoPopupComponent);
		const container = this.popupService.getContainer();

		const component = factory.create(container.injector);
		container.insert(component.hostView);

		component.instance.result
			.subscribe(() => {
				container.remove();
			});
	}
}
