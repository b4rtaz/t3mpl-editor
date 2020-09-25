import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

	public manifestUrl: string;

	public constructor(
		@Inject(DOCUMENT) private readonly document: Document) {
	}

	public ngOnInit() {
		this.tryReadHash();
	}

	@HostListener('window:hashchange')
	public onHashChanged() {
		this.tryReadHash();
	}

	private tryReadHash() {
		const hash = this.document.location.hash;
		const matches = hash.match(/manifest=([^&]*)/);
		if (matches) {
			this.manifestUrl = matches[1];
		}
	}
}
