import { Injectable } from '@angular/core';
import { PagesDataGenerator } from 't3mpl-core/core/data/pages-data-generator';
import { TemplateRenderer } from 't3mpl-core/core/renderer/template-renderer';
import { getFileExt } from 't3mpl-core/core/utils/path-utils';

import { StateService } from '../state.service';
import { createCodeDocument, createErrorDocument } from './preview-utils';

@Injectable()
export class TemplatePreviewRenderer {

	public constructor(
		private readonly stateService: StateService) {
	}

	public render(): string {
		let html: string;

		if (this.stateService.currentPage) {
			try {
				const start = new Date().getTime();

				const renderer = new TemplateRenderer(
					true,
					this.stateService.templateStorage,
					this.stateService.contentStorage,
					new PagesDataGenerator());
				html = renderer.render(
					this.stateService.pages,
					this.stateService.currentPage,
					this.stateService.data);

				const fileExt = getFileExt(this.stateService.currentPage.filePath);
				switch (fileExt.toLowerCase()) {
					case '.xml':
					case '.json':
						html = createCodeDocument(html);
						break;

					default:
						html +=
							`<script>
							(function () {
								var links = document.querySelectorAll('a[href]');
								links.forEach(function (link) {
									var href = link.getAttribute('href');
									if (href.indexOf('#') !== 0) {
										link.addEventListener('click', function (event) {
											event.preventDefault();
										});
									}
								});
							}());
							</script>`;
						break;
				}

				const duration = new Date().getTime() - start;
				// tslint:disable-next-line
				console.debug(`rendering time = ${duration} ms.`);
			} catch (e) {
				console.error(e);
				html = createErrorDocument(e && e.message ? e.message : 'Unknow error.');
			}
		} else {
			html = createErrorDocument('No pages.');
		}
		return html;
	}
}
