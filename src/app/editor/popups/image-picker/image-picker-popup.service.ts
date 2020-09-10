import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImagePickerPopupComponent } from './image-picker-popup.component';
import { PopupService } from '../popup.service';

@Injectable()
export class ImagePickerPopupService {

	public constructor(
		private readonly factoryResolver: ComponentFactoryResolver,
		private readonly popupService: PopupService) {
	}

	public pick(filePath: string): Observable<string> {
		const factory = this.factoryResolver.resolveComponentFactory(ImagePickerPopupComponent);
		const container = this.popupService.getContainer();

		const component = factory.create(container.injector);
		component.instance.filePath = filePath;
		container.insert(component.hostView);

		return component.instance.result
			.pipe(map(i => {
				container.remove();
				return i;
			}));
	}
}
