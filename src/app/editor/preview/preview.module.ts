import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DataPreviewRenderer } from './data-preview-renderer';
import { PageTabsComponent } from './page-tabs.component';
import { PreviewComponent } from './preview.component';
import { TemplatePreviewRenderer } from './template-preview-renderer';

@NgModule({
	declarations: [
		PreviewComponent,
		PageTabsComponent
	],
	exports: [
		PreviewComponent,
		PageTabsComponent
	],
	providers: [
		TemplatePreviewRenderer,
		DataPreviewRenderer
	],
	imports: [
		BrowserModule,
		CommonModule
	]
})
export class PreviewModule {
}
