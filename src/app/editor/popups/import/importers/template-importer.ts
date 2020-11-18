import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from 'src/app/editor/state.service';
import { TEMPLATE_MANIFEST_FILE_NAME } from 't3mpl-core/core/constants';
import { MemoryStorage } from 't3mpl-core/core/memory-storage';
import { TemplateManifestParser } from 't3mpl-core/core/template-manifest-parser';

import { unzipToStorage } from './zip-utils';

@Injectable()
export class TemplateImporter {

	public constructor(
		private readonly stateService: StateService) {
	}

	public import(file: File): Observable<void> {
		return new Observable(r => {
			const templateStorage = new MemoryStorage();
			unzipToStorage(file, templateStorage).then(() => {
				try {
					const manifestRaw = templateStorage.getContent('text', TEMPLATE_MANIFEST_FILE_NAME);
					const manifestParser = new TemplateManifestParser();
					const manifest = manifestParser.parse(manifestRaw);

					this.stateService.setState(
						{ type: 'file' },
						manifest,
						templateStorage,
						null,
						null);
					r.next();
				} catch (e) {
					r.error(e);
				}
				r.complete();
			}, e => r.error(e));
		});
	}
}
