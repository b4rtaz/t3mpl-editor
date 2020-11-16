import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { Observable } from 'rxjs';
import { TEMPLATE_ZIP_FILE_EXT } from 't3mpl-core/core/constants';
import { Exporter } from 't3mpl-core/core/exporter';
import { generateFileName } from 't3mpl-core/core/utils/file-name-generator';

import { StateService } from '../../../state.service';
import { compress, zipExportHandler, ZipFile } from './zip-utils';

@Injectable()
export class TemplateZipGenerator {

	public constructor(
		private readonly stateService: StateService) {
	}

	public generate(): Observable<ZipFile> {
		return new Observable(r => {
			const zip = new JSZip();

			Exporter.exportTemplate(this.stateService.templateStorage, zipExportHandler(zip));

			compress(zip).then((content) => {
				const fileName = generateFileName({
					name: this.stateService.templateManifest.meta.name,
					minUniqueIdLength: 4,
					fileExt: TEMPLATE_ZIP_FILE_EXT
				});

				r.next({ content, fileName });
			});
		});
	}
}
