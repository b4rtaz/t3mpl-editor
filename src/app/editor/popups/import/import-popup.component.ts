import { Component, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { PopupComponent } from '../popup.service';
import { ImportPopupMode } from './import-popup-mode';
import { DataImporter } from './importers/data-importer';
import { TemplateImporter } from './importers/template-importer';

@Component({
	templateUrl: './import-popup.component.html'
})
export class ImportPopupComponent implements PopupComponent<void> {

	public readonly result: Subject<void> = new Subject();

	@Input()
	public mode: ImportPopupMode;

	public file: File;
	public processing = false;

	public constructor(
		private readonly templateImporter: TemplateImporter,
		private readonly dataImporter: DataImporter) {
	}

	public onChanged(event: Event) {
		const files = (event.target as any).files as File[];
		if (files && files.length > 0) {
			this.file = files[0];
		}
	}

	public import() {
		if (!this.processing && this.file) {
			this.processing = true;

			let res: Observable<void> = null;
			switch (this.mode) {
				case 'template':
					res = this.templateImporter.import(this.file);
					break;

				case 'data':
					res = this.dataImporter.import(this.file);
					break;

				default:
					throw new Error(`Not supported mode ${this.mode}.`);
			}

			res.subscribe(() => {
				this.processing = false;
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
