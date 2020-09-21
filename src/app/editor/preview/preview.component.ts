import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { StateService } from '../state.service';
import { DataPreviewRenderer } from './data-preview-renderer';
import { TemplatePreviewRenderer } from './template-preview-renderer';

const OPEN_PAGE_MESSAGE = 'openPage:';

@Component({
	selector: 'app-preview',
	templateUrl: './preview.component.html'
})
export class PreviewComponent implements OnInit, OnDestroy {

	@ViewChild('iframe', { static: true })
	public iframe: ElementRef<HTMLIFrameElement>;

	public isMobileMode = false;

	private scrollTop: number = null;

	private onMessageReceivedHandler = (m: MessageEvent) => this.onMessageReceived(m);

	public constructor(
		private readonly stateService: StateService,
		private readonly templatePreviewRenderer: TemplatePreviewRenderer,
		private readonly dataPreviewRenderer: DataPreviewRenderer) {
	}

	public ngOnInit() {
		window.addEventListener('message', this.onMessageReceivedHandler);

		merge(
			this.stateService.onStateChanged,
			this.stateService.onDataChanged,
			this.stateService.onPageChanged
		)
		.pipe(debounceTime(50))
		.subscribe(() => this.render());

		this.stateService.onPreviewModeChanged
			.subscribe(() => this.render());
	}

	public ngOnDestroy() {
		window.removeEventListener('message', this.onMessageReceivedHandler);
	}

	private render() {
		let content: string;
		let isMobileMode: boolean;
		switch (this.stateService.previewMode) {
			case 'desktop':
			case 'mobile':
				content = this.templatePreviewRenderer.render();
				isMobileMode = this.stateService.previewMode === 'mobile';
				break;
			case 'data':
				content = this.dataPreviewRenderer.render();
				isMobileMode = false;
				break;
		}

		this.isMobileMode = isMobileMode;
		this.setContent(content);

		if (this.scrollTop) {
			this.iframe.nativeElement.contentWindow.scrollTo(0, this.scrollTop);
		}
	}

	private setContent(html: string) {
		const doc = this.iframe.nativeElement.contentDocument;
		doc.open();
		doc.write(html);
		doc.addEventListener('scroll', () => this.onPreviewScrolled());
		doc.close();
	}

	private onPreviewScrolled() {
		this.scrollTop = this.iframe.nativeElement.contentWindow.scrollY;
	}

	private onMessageReceived(e: MessageEvent) {
		if (typeof(e.data) === 'string' && e.data.startsWith(OPEN_PAGE_MESSAGE)) {
			const pageFileName = e.data.substring(OPEN_PAGE_MESSAGE.length);
			this.stateService.setCurrentPage(pageFileName);
		}
	}
}
