import { Component, OnInit } from '@angular/core';

import { PreviewMode, StateService } from './state.service';

@Component({
	selector: 'app-page-tabs',
	templateUrl: './page-tabs.component.html'
})
export class PageTabsComponent implements OnInit {

	public currentFilePath: string;
	public filePaths: string[];
	public previewMode: PreviewMode;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.stateService.onStateChanged.subscribe(() => this.reload());
		this.stateService.onPageChanged.subscribe(() => this.reload());
		this.stateService.onPreviewModeChanged.subscribe(() => this.reload());
	}

	private reload() {
		this.filePaths = this.stateService.pages.map(p => p.filePath);
		this.currentFilePath = this.stateService.currentPage
			? this.stateService.currentPage.filePath
			: null;
		this.previewMode = this.stateService.previewMode;
	}

	public openPage(filePath: string) {
		this.stateService.setCurrentPage(filePath);
	}

	public changeMode(mode: PreviewMode) {
		this.stateService.setPreviewMode(mode);
	}
}
