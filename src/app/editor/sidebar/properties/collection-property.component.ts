import { Component, Input, OnInit } from '@angular/core';
import { CollectionPropertyContract } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';

@Component({
	selector: 'app-collection-property',
	templateUrl: './collection-property.component.html'
})
export class CollectionPropertyComponent implements OnInit {

	@Input()
	public property: CollectionPropertyContract;
	@Input()
	public dataPath: string;

	public items: any[];
	public itemName: string;
	public validationError: string;
	public canAddItem: boolean;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.itemName = getCollectionItemName(this.property._label);
		this.reload();
	}

	private reload() {
		this.items = this.stateService.getValue<any[]>(this.dataPath);
		this.canAddItem = this.property.max === null || this.property.max > this.items.length;
		this.validationError = this.stateService.validate(this.property, this.dataPath, this.items);
	}

	public unshiftItem() {
		if (this.canAddItem) {
			this.stateService.unshiftItem(this.dataPath, this.property.properties);
			this.reload();
		}
	}

	public deleteItem(index: number) {
		this.stateService.removeItem(this.dataPath, index);
		this.reload();
	}

	public moveItem(index: number, direction: number) {
		const newIndex = index + direction;
		if (newIndex >= 0 && newIndex < this.items.length) {
			this.stateService.moveItem(this.dataPath, index, newIndex);
			this.reload();
		}
	}
}

export function getCollectionItemName(label: string): string {
	if (label.length > 1 && label.endsWith('s')) {
		return label.substr(0, label.length - 1);
	}
	return 'Item';
}
