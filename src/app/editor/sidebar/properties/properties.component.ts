import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PropertyContract, PropertyContractMap } from 't3mpl-core/core/model';

@Component({
	selector: 'app-properties',
	templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit, OnChanges {

	@Input()
	public properties: PropertyContractMap;
	@Input()
	public dataPath: string;

	public orderedProperties: Property[];

	public ngOnInit() {
		this.sortProperties();
	}

	public ngOnChanges(changes: SimpleChanges) {
		const p = changes.properties;
		if (p && !p.firstChange) {
			this.sortProperties();
		}
	}

	private sortProperties() {
		this.orderedProperties = Object.keys(this.properties).map(p => {
			return {
				propertyName: p,
				contract: this.properties[p]
			};
		});
	}
}

interface Property {
	propertyName: string;
	contract: PropertyContract;
}
