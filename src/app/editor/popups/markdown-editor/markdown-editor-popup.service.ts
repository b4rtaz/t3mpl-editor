import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PopupService } from '../popup.service';
import { MarkdownEditorPopupComponent } from './markdown-editor-popup.component';

@Injectable()
export class MarkdownEditorPopupService {

	public constructor(
		private readonly factoryResolver: ComponentFactoryResolver,
		private readonly popupService: PopupService) {
	}

	public edit(filePath: string): Observable<string> {
		const factory = this.factoryResolver.resolveComponentFactory(MarkdownEditorPopupComponent);
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
