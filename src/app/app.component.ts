import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { TemplateSource } from './editor/template-source';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

	public templateSource: TemplateSource;

	public constructor(
		@Inject(DOCUMENT) private readonly document: Document,
		private readonly translate: TranslateService) {
	}

	public ngOnInit() {
		this.translate.use('en').subscribe(() => {
			this.tryReadHash();
		});
	}

	@HostListener('window:hashchange')
	public onHashChanged() {
		this.tryReadHash();
	}

	private tryReadHash() {
		const hash = this.document.location.hash;
		if (hash) {
			const params = new URLSearchParams(hash.substring(1));

			if (params.has('manifest')) {
				this.templateSource = {
					type: 'remoteTemplate',
					manifestUrl: params.get('manifest')
				};
			} else if (params.has('website')) {
				this.templateSource = {
					type: 'server',
					websiteUrl: params.get('website')
				};
			} else {
				throw new Error('Not supported hash.');
			}
		}
	}
}
