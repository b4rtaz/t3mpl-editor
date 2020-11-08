import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { ConfigurationComponent } from './configuration/configuration.component';
import { DropdownDirective } from './dropdown.directive';
import { BooleanPropertyComponent } from './properties/boolean-property.component';
import { ChoicePropertyComponent } from './properties/choice-property.component';
import { CollectionPropertyComponent } from './properties/collection-property.component';
import { ColorPropertyComponent } from './properties/color-property.component';
import { DatePropertyComponent } from './properties/datetime-property.component';
import { HtmlPropertyComponent } from './properties/html-property.component';
import { ImagePropertyComponent } from './properties/image-property.component';
import { MarkdownPropertyComponent } from './properties/markdown-property.component';
import { PropertiesComponent } from './properties/properties.component';
import { TextPropertyComponent } from './properties/text-property.component';
import { SectionComponent } from './sections.component';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { SidebarComponent } from './sidebar.component';

@NgModule({
	declarations: [
		SidebarComponent,
		SidebarMenuComponent,
		DropdownDirective,

		ConfigurationComponent,
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
	],
	exports: [
		SidebarComponent
	],
	imports: [
		TranslateModule.forChild(),
		BrowserModule,
		CommonModule
	]
})
export class SidebarModule {
}
