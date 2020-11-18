import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TEMPLATE_DATA_FILE_NAME, TEMPLATE_MANIFEST_FILE_NAME } from 't3mpl-core/core/constants';

import { StateService } from '../../state.service';
import { TemplateSource } from '../../template-source';
import { PopupComponent } from '../popup.service';
import { loadData, loadTemplate, OnFileLoadedHandler } from './remote-template-loader';

@Component({
	templateUrl: './loader-popup.component.html'
})
export class LoaderPopupComponent implements OnInit, PopupComponent<void> {

	@Input()
	public templateSource: TemplateSource;

	public readonly result: Subject<void> = new Subject();

	public processing: boolean;
	public log = '';

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.load();
	}

	private async load() {
		this.processing = true;
		try {
			const b = await loadBatches(this.templateSource, p => this.onFileLoaded(p));
			if (b.template) {
				this.stateService.setState(
					this.templateSource,
					b.template.templateManifest,
					b.template.templateStorage,
					b.data?.contentStorage,
					b.data?.templateData);
				this.close();
			}
		} catch (e) {
			const message = e instanceof Error ? e.message : e.toString();
			console.error(e);
			this.appendLog(`An error occurred. ${message}`);
		} finally {
			this.processing = false;
		}
	}

	public close() {
		this.result.next(null);
	}

	private onFileLoaded(filePath: string) {
		this.appendLog(`Loaded ${filePath}`);
	}

	private appendLog(message: string) {
		if (this.log) {
			this.log += '\r\n';
		}
		this.log += message;
	}
}

async function loadBatches(templateSource: TemplateSource, onFileLoaded: OnFileLoadedHandler) {
	switch (templateSource.type) {
		case 'remoteTemplate':
			return {
				template: await loadTemplate(templateSource.manifestUrl, onFileLoaded),
				data: null
			};

		case 'server':
			const p = await Promise.all([
				loadTemplate(templateSource.websiteUrl + '/template/' + TEMPLATE_MANIFEST_FILE_NAME, onFileLoaded),
				loadData(templateSource.websiteUrl + '/data/' + TEMPLATE_DATA_FILE_NAME, onFileLoaded)
			]);
			return {
				template: p[0],
				data: p[1]
			};

		default:
			throw new Error(`Not supported source type: ${templateSource.type}.`);
	}
}
