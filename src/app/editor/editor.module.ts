import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EditorComponent } from './editor.component';
import { PageTabsComponent } from './page-tabs.component';
import { ExportPopupComponent } from './popups/export/export-popup.component';
import { ExportPopupService } from './popups/export/export-popup.service';
import { DataZipGenerator } from './popups/export/generators/data-zip-generator';
import { ReleaseZipGenerator } from './popups/export/generators/relase-zip-generator';
import { TemplateZipGenerator } from './popups/export/generators/template-zip-generator';
import { HtmlEditorPopupComponent } from './popups/html-editor/html-editor-popup.component';
import { HtmlEditorPopupService } from './popups/html-editor/html-editor-popup.service';
import { ImagePickerPopupComponent } from './popups/image-picker/image-picker-popup.component';
import { ImagePickerPopupService } from './popups/image-picker/image-picker-popup.service';
import { ImportPopupComponent } from './popups/import/import-popup.component';
import { ImportPopupService } from './popups/import/import-popup.service';
import { DataImporter } from './popups/import/importers/data-importer';
import { TemplateImporter } from './popups/import/importers/template-importer';
import { MarkdownEditorPopupComponent } from './popups/markdown-editor/markdown-editor-popup.component';
import { MarkdownEditorPopupService } from './popups/markdown-editor/markdown-editor-popup.service';
import { PopupService } from './popups/popup.service';
import { TemplateInfoPopupComponent } from './popups/template-info/template-info-popup.component';
import { TemplateInfoPopupService } from './popups/template-info/template-info-popup.service';
import { DataPreviewRenderer } from './preview/data-preview-renderer';
import { PreviewComponent } from './preview/preview.component';
import { TemplatePreviewRenderer } from './preview/template-preview-renderer';
import { BooleanPropertyComponent } from './sidebar/properties/boolean-property.component';
import { ChoicePropertyComponent } from './sidebar/properties/choice-property.component';
import { CollectionPropertyComponent } from './sidebar/properties/collection-property.component';
import { ColorPropertyComponent } from './sidebar/properties/color-property.component';
import { DatePropertyComponent } from './sidebar/properties/datetime-property.component';
import { HtmlPropertyComponent } from './sidebar/properties/html-property.component';
import { ImagePropertyComponent } from './sidebar/properties/image-property.component';
import { MarkdownPropertyComponent } from './sidebar/properties/markdown-property.component';
import { PropertiesComponent } from './sidebar/properties/properties.component';
import { TextPropertyComponent } from './sidebar/properties/text-property.component';
import { SectionComponent } from './sidebar/sections.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StateService } from './state.service';

@NgModule({
	declarations: [
		EditorComponent,
		PreviewComponent,
		SidebarComponent,
		PageTabsComponent,
		SectionComponent,
		PropertiesComponent,
		TextPropertyComponent,
		BooleanPropertyComponent,
		DatePropertyComponent,
		ChoicePropertyComponent,
		CollectionPropertyComponent,
		HtmlPropertyComponent,
		MarkdownPropertyComponent,
		ImagePropertyComponent,
		ColorPropertyComponent,

		ImagePickerPopupComponent,
		HtmlEditorPopupComponent,
		MarkdownEditorPopupComponent,
		ExportPopupComponent,
		ImportPopupComponent,
		TemplateInfoPopupComponent
	],
	entryComponents: [
		ImagePickerPopupComponent,
		HtmlEditorPopupComponent,
		MarkdownEditorPopupComponent,
		ExportPopupComponent,
		ImportPopupComponent,
		TemplateInfoPopupComponent
	],
	imports: [
		BrowserModule,
		CommonModule
	],
	providers: [
		StateService,
		PopupService,

		TemplatePreviewRenderer,
		DataPreviewRenderer,

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
		DataImporter
	],
	exports: [
		EditorComponent
	]
})
export class EditorModule {
}
