import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { StateService } from '../../state.service';
import { PopupComponent } from '../popup.service';
import { uploadTemplateData } from './template-data-uploader';

@Component({
	templateUrl: './uploader-popup.component.html'
})
export class UploaderPopupComponent implements OnInit, PopupComponent<void> {

	public readonly result: Subject<void> = new Subject();

	public processing: boolean;
	public log = '';

	public constructor(
		private readonly stateService: StateService) {
	}

	public async ngOnInit() {
		this.processing = true;

		try {
			await uploadTemplateData(
				this.stateService.templateSource.websiteUrl,
				this.stateService.templateManifest,
				this.stateService.configuration,
				this.stateService.data,
				this.stateService.contentStorage,
				message => this.appendLog(message)
			);
		}
		catch (e) {
			const message = e instanceof Error ? e.message : e.toString();
			console.error(e);
			this.appendLog(`An error occurred. ${message}`);
		}
		finally {
			this.processing = false;
		}
	}

	public close() {
		this.result.next();
	}

	private appendLog(message: string) {
		if (this.log) {
			this.log += '\r\n';
		}
		this.log += message;
	}
}
