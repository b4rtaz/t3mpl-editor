import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ConfirmPopupComponent } from './confirm/confirm-popup.component';
import { ConfirmPopupService } from './confirm/confirm-popup.service';
import { ExportPopupComponent } from './export/export-popup.component';
import { ExportPopupService } from './export/export-popup.service';
import { DataZipGenerator } from './export/generators/data-zip-generator';
import { ReleaseZipGenerator } from './export/generators/relase-zip-generator';
import { TemplateZipGenerator } from './export/generators/template-zip-generator';
import { HtmlEditorPopupComponent } from './html-editor/html-editor-popup.component';
import { HtmlEditorPopupService } from './html-editor/html-editor-popup.service';
import { ImagePickerPopupComponent } from './image-picker/image-picker-popup.component';
import { ImagePickerPopupService } from './image-picker/image-picker-popup.service';
import { ImportPopupComponent } from './import/import-popup.component';
import { ImportPopupService } from './import/import-popup.service';
import { DataImporter } from './import/importers/data-importer';
import { TemplateImporter } from './import/importers/template-importer';
import { LoaderPopupComponent } from './loader/loader-popup.component';
import { LoaderPopupService } from './loader/loader-popup.service';
import { MarkdownEditorPopupComponent } from './markdown-editor/markdown-editor-popup.component';
import { MarkdownEditorPopupService } from './markdown-editor/markdown-editor-popup.service';
import { PopupService } from './popup.service';
import { ScrollDownDirective } from './scroll-down.directive';
import { TemplateInfoPopupComponent } from './template-info/template-info-popup.component';
import { TemplateInfoPopupService } from './template-info/template-info-popup.service';
import { UploaderPopupComponent } from './uploader/uploader-popup.component';
import { UploaderPopupService } from './uploader/uploader-popup.service';

@NgModule({
	declarations: [
		ConfirmPopupComponent,
		ImagePickerPopupComponent,
		HtmlEditorPopupComponent,
		MarkdownEditorPopupComponent,
		ExportPopupComponent,
		ImportPopupComponent,
		TemplateInfoPopupComponent,
		LoaderPopupComponent,
		UploaderPopupComponent,
		ScrollDownDirective
	],
	entryComponents: [
		ConfirmPopupComponent,
		ImagePickerPopupComponent,
		HtmlEditorPopupComponent,
		MarkdownEditorPopupComponent,
		ExportPopupComponent,
		ImportPopupComponent,
		TemplateInfoPopupComponent,
		LoaderPopupComponent,
		UploaderPopupComponent
	],
	providers: [
		PopupService,
		ConfirmPopupService,

		ImagePickerPopupService,
		HtmlEditorPopupService,
		MarkdownEditorPopupService,
		TemplateInfoPopupService,

		ExportPopupService,
		ReleaseZipGenerator,
		DataZipGenerator,
		TemplateZipGenerator,

		ImportPopupService,
		TemplateImporter,
		DataImporter,

		LoaderPopupService,
		UploaderPopupService
	],
	imports: [
		BrowserModule,
		CommonModule
	]
})
export class PopupModule {
}
