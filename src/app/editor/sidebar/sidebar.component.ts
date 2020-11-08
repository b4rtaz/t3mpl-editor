import { Component, OnInit } from '@angular/core';
import { SectionContractMap } from 't3mpl-core/core/model';

import { version } from '../../../../package.json';
import { StateService } from '../state.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

	public readonly appVersion: string = version;
	public templateName: string;

	public items: SidebarItem[];
	public currentItem: SidebarItem;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.stateService.onStateChanged.subscribe(() => this.onStateChanged());
	}

	private onStateChanged() {
		const manifest = this.stateService.templateManifest;
		this.templateName = manifest.meta.name;

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
			type: 'separator',
			label: '────'
		});
		items.push({
			type: 'configuration',
			label: 'Configuration'
		});
		this.items = items;
		this.currentItem = items[0];
	}

	public onItemChanged(itemIndex: number) {
		this.currentItem = this.items[itemIndex];
	}
}

interface SidebarItem {
	type: SidebarItemType;
	label: string;
	zonePath?: string;
	zoneSections?: SectionContractMap[];
}

type SidebarItemType = 'configuration' | 'separator' | 'zone';

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
