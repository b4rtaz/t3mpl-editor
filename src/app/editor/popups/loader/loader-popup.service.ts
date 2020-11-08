import { Injectable } from '@angular/core';

import { TemplateSource } from '../../template-source';
import { PopupService } from '../popup.service';
import { LoaderPopupComponent } from './loader-popup.component';

@Injectable()
export class LoaderPopupService {

	public constructor(
		private readonly popupService: PopupService) {
	}

	public load(templateSource: TemplateSource) {
		this.popupService.open(LoaderPopupComponent, i => {
			i.templateSource = templateSource;
		}).subscribe(() => {});
	}
}
