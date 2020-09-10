import { Component, Input, OnInit } from '@angular/core';
import { SectionContract, SectionContractMap } from 't3mpl-core/core/model';

@Component({
	selector: 'app-sections',
	templateUrl: './sections.component.html'
})
export class SectionComponent implements OnInit {

	@Input()
	public sections: SectionContractMap;
	@Input()
	public dataPath: string;

	public currentSectionName: string;
	public currentSection: SectionContract;

	public ngOnInit() {
		const firstSectionName = Object.keys(this.sections)[0];
		this.selectSection(firstSectionName);
	}

	public selectSection(name: string) {
		this.currentSectionName = name;
		this.currentSection = this.sections[name];
	}
}
