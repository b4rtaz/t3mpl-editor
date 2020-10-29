import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { PreviewMode, StateService } from '../state.service';

@Component({
	selector: 'app-page-tabs',
	templateUrl: './page-tabs.component.html'
})
export class PageTabsComponent implements OnInit {

	public currentVirtualFilePath: string;
	public virtualFilePaths: string[];
	public previewMode: PreviewMode;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		merge(
			this.stateService.onStateChanged,
			this.stateService.onPageChanged,
			this.stateService.onConfigurationChanged,
			this.stateService.onPreviewModeChanged
		)
		.pipe(debounceTime(50))
		.subscribe(() => this.reload());
	}

	private reload() {
		this.virtualFilePaths = this.stateService.pages.map(p => p.virtualFilePath);
		this.currentVirtualFilePath = this.stateService.currentPage
			? this.stateService.currentPage.virtualFilePath
			: null;
		this.previewMode = this.stateService.previewMode;
	}

	public openPage(virtualFilePath: string) {
		this.stateService.setCurrentPage(virtualFilePath);
	}

	public changeMode(mode: PreviewMode) {
		this.stateService.setPreviewMode(mode);
	}
}
