import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PROJECT_WEBSITE_URL } from 't3mpl-core/core/constants';
import { SectionContractMap, ZoneContractMap } from 't3mpl-core/core/model';

import { version } from '../../../../package.json';
import { ConfirmPopupService } from '../popups/confirm/confirm-popup.service';
import { ExportPopupService } from '../popups/export/export-popup.service';
import { ImportPopupService } from '../popups/import/import-popup.service';
import { TemplateInfoPopupService } from '../popups/template-info/template-info-popup.service';
import { StateService } from '../state.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

	public readonly appVersion: string = version;
	public templateName: string;
	public canExportTemplate: boolean;

	public items: SidebarItem[];
	public currentItem: SidebarItem;

	public constructor(
		private readonly stateService: StateService,
		private readonly confirmPopupService: ConfirmPopupService,
		private readonly exportPopupService: ExportPopupService,
		private readonly importPopupService: ImportPopupService,
		private readonly templateInfoPopupService: TemplateInfoPopupService) {
	}

	public ngOnInit() {
		this.stateService.onStateChanged.subscribe(() => this.onStateChanged());
	}

	private onStateChanged() {
		const manifest = this.stateService.templateManifest;

		this.templateName = manifest.meta.name;
		this.canExportTemplate = manifest.meta.exportable;

		const items: SidebarItem[] = Object.keys(manifest.dataContract.zones).map(zoneName => {
			const zone = manifest.dataContract.zones[zoneName];
			return {
				type: 'zone',
				label: zone._label,
				zonePath: zoneName,
				zoneSections: groupByPanel(zone.sections)
			};
		});
		items.push({
			type: 'configuration',
			label: '⌊ Configuration'
		});
		this.items = items;
		this.currentItem = items[0];
	}

	public onItemChanged(itemIndex: number) {
		this.currentItem = this.items[itemIndex];
	}

	public publish() {
		this.confirmValidation()
			.subscribe(result => {
				if (result) {
					this.exportPopupService.open('publish');
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
			return this.confirmPopupService.prompt('Validation errors', 'There are validation errors. Do you want to continue?');
		}
	}

	public openTemplateInfo() {
		this.templateInfoPopupService.open();
	}

	public exploreTemplates() {
		window.open(PROJECT_WEBSITE_URL, '_blank');
	}
}

interface SidebarItem {
	type: SidebarItemType;
	label: string;
	zonePath?: string;
	zoneSections?: SectionContractMap[];
}

type SidebarItemType = 'configuration' | 'zone';

export function groupByPanel(map: SectionContractMap): SectionContractMap[] {
	const paneled: { [panelName: string]: SectionContractMap } = {};
	const sections: SectionContractMap[] = [];

	for (const sectionName of Object.keys(map)) {
		const section = map[sectionName];
		if (section._panel) {
			if (!paneled[section._panel]) {
				paneled[section._panel] = {};
				sections.push(paneled[section._panel]);
			}
			paneled[section._panel][sectionName] = section;
		} else {
			const single = {};
			single[sectionName] = section;
			sections.push(single);
		}
	}
	return sections;
}
