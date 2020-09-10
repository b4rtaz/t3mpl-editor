import { Injectable } from '@angular/core';

import { StateService } from '../state.service';
import { createCodeDocument } from './preview-utils';

@Injectable()
export class DataPreviewRenderer {

	public constructor(
		private readonly stateService: StateService) {
	}

	public render(): string {
		const json = JSON.stringify(this.stateService.data, null, 2);
		return createCodeDocument(json);
	}
}
