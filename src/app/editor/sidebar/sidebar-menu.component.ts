import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { PROJECT_WEBSITE_URL } from 't3mpl-core/core/constants';

import { ConfirmPopupService } from '../popups/confirm/confirm-popup.service';
import { ExportPopupService } from '../popups/export/export-popup.service';
import { ImportPopupService } from '../popups/import/import-popup.service';
import { TemplateInfoPopupService } from '../popups/template-info/template-info-popup.service';
import { UploaderPopupService } from '../popups/uploader/uploader-popup.service';
import { StateService } from '../state.service';

@Component({
	selector: 'app-sidebar-menu',
	templateUrl: './sidebar-menu.component.html'
})
export class SidebarMenuComponent implements OnInit {

	public hasTemplate: boolean;
	public canChangeTemplate: boolean;
	public canExportTemplate: boolean;

	public constructor(
		private readonly stateService: StateService,
		private readonly confirmPopupService: ConfirmPopupService,
		private readonly exportPopupService: ExportPopupService,
		private readonly importPopupService: ImportPopupService,
		private readonly templateInfoPopupService: TemplateInfoPopupService,
		private readonly uploaderPopupService: UploaderPopupService,
		private readonly translateService: TranslateService) {
	}

	public ngOnInit() {
		this.stateService.onStateChanged.subscribe(() => this.onStateChanged());
	}

	private onStateChanged() {
		const sourceType = this.stateService.templateSource.type;
		this.hasTemplate = true;
		this.canChangeTemplate = (sourceType === 'file' || sourceType === 'remoteTemplate');
		this.canExportTemplate = this.stateService.templateManifest.meta.exportable;
	}

	public publish() {
		this.confirmValidation()
			.subscribe(result => {
				if (result) {
					if (this.stateService.templateSource.type === 'server') {
						this.confirmPopupService.prompt(
							this.translateService.instant('sidebar.confirmPublishingTitle'),
							this.translateService.instant('sidebar.confirmPublishingDescription'))
							.subscribe((ok) => {
								if (ok) {
									this.uploaderPopupService.open();
								}
							});
					} else {
						this.exportPopupService.open('publish');
					}
				}
			});
	}

	public importTemplate() {
		this.importPopupService.show('template');
	}

	public exportTemplate() {
		this.exportPopupService.open('template');
	}

	public importData() {
		this.importPopupService.show('data');
	}

	public exportData() {
		this.confirmValidation()
			.subscribe(result => {
				if (result) {
					this.exportPopupService.open('data');
				}
			});
	}

	private confirmValidation(): Observable<boolean> {
		const invalidPropertyNames = this.stateService.validateAll();

		if (invalidPropertyNames.length === 0) {
			return of(true);
		} else {
			return this.confirmPopupService.prompt(
				this.translateService.instant('sidebar.confirmValidationErrorsTitle'),
				this.translateService.instant('sidebar.confirmValidationErrorsDescription'));
		}
	}

	public openTemplateInfo() {
		this.templateInfoPopupService.open();
	}

	public exploreTemplates() {
		window.open(PROJECT_WEBSITE_URL, '_blank');
	}
}
