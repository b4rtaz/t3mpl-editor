import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { EditorModule } from './editor/editor.module';

export function HttpLoaderFactory(httpClient: HttpClient) {
	return new TranslateHttpLoader(httpClient, 'assets/i18n/');
}

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		EditorModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			},
			defaultLanguage: 'en'
		})
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
