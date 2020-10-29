import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EditorComponent } from './editor.component';
import { PopupModule } from './popups/popup.module';
import { PreviewModule } from './preview/preview.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { StateService } from './state.service';

@NgModule({
	declarations: [
		EditorComponent,
	],
	imports: [
		BrowserModule,
		CommonModule,
		SidebarModule,
		PopupModule,
		PreviewModule
	],
	providers: [
		StateService
	],
	exports: [
		EditorComponent
	]
})
export class EditorModule {
}
