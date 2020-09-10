import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TemplateManifestMeta } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';
import { PopupComponent } from '../popup.service';

@Component({
	templateUrl: './template-info-popup.component.html'
})
export class TemplateInfoPopupComponent implements OnInit, PopupComponent<boolean> {

	public readonly result: Subject<boolean> = new Subject();

	public meta: TemplateManifestMeta;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.meta = this.stateService.templateManifest.meta;
	}

	public close() {
		this.result.next(true);
	}
}
