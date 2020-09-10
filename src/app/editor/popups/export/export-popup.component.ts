import { Component, Input, OnInit } from '@angular/core';
import * as fileSaver from 'file-saver';
import { Observable, Subject } from 'rxjs';
import { PROJECT_DONATE_URL } from 't3mpl-core/core/constants';
import { TemplateManifestMeta } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';
import { PopupComponent } from '../popup.service';
import { ExportPopupMode } from './export-popup-mode';
import { DataZipGenerator } from './generators/data-zip-generator';
import { ReleaseZipGenerator } from './generators/relase-zip-generator';
import { TemplateZipGenerator } from './generators/template-zip-generator';
import { ZipFile } from './generators/zip-utils';

@Component({
	templateUrl: './export-popup.component.html'
})
export class ExportPopupComponent implements OnInit, PopupComponent<void> {

	public readonly result: Subject<void> = new Subject();

	@Input()
	public mode: ExportPopupMode;

	public templateMeta: TemplateManifestMeta;
	public projectDonateUrl: string;

	public processing = false;

	public constructor(
		private readonly stateService: StateService,
		private readonly releaseZipGenerator: ReleaseZipGenerator,
		private readonly dataZipGenerator: DataZipGenerator,
		private readonly templateZipGenerator: TemplateZipGenerator) {
	}

	public ngOnInit() {
		this.templateMeta = this.stateService.templateManifest.meta;
		this.projectDonateUrl = PROJECT_DONATE_URL;
	}

	public save() {
		if (!this.processing) {
			let res: Observable<ZipFile>;

			switch (this.mode) {
				case 'publish':
					res = this.releaseZipGenerator.generate();
					break;

				case 'data':
					res = this.dataZipGenerator.generate();
					break;

				case 'template':
					res = this.templateZipGenerator.generate();
					break;

				default:
					throw new Error(`Not supported mode ${this.mode}.`);
			}

			this.processing = true;
			res.subscribe(r => {
				this.processing = false;
				fileSaver.saveAs(r.content, r.fileName);
				this._close();
			}, (e) => {
				console.error(e);
				alert(e);
				this.processing = false;
			});
		}
	}

	public close() {
		if (!this.processing) {
			this._close();
		}
	}

	private _close() {
		this.result.next();
	}
}
