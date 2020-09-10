import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from 'src/app/editor/state.service';
import { TEMPLATE_DATA_FILE_NAME } from 't3mpl-core/core/constants';
import { MemoryStorage } from 't3mpl-core/core/memory-storage';
import { TemplateData } from 't3mpl-core/core/model';

import { unzipToStorage } from './zip-utils';

@Injectable()
export class DataImporter {

	public constructor(
		private readonly stateService: StateService) {
	}

	public import(file: File): Observable<void> {
		return new Observable(r => {
			const contentStorage = new MemoryStorage();
			unzipToStorage(file, contentStorage).then(() => {
				try {
					const dataRaw = contentStorage.getContent('text', TEMPLATE_DATA_FILE_NAME);
					const data = JSON.parse(dataRaw) as TemplateData;

					this.stateService.setState(
						this.stateService.templateManifest,
						this.stateService.templateStorage,
						contentStorage,
						data.data
					);
					r.next();
				} catch (e) {
					r.error(e);
				}
				r.complete();
			}, e => r.error(e));
		});
	}
}
