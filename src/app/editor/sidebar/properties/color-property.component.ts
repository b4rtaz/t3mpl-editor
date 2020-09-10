import { Component, Input, OnInit } from '@angular/core';
import { ColorPropertyContract } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';

@Component({
	selector: 'app-color-property',
	templateUrl: './color-property.component.html'
})
export class ColorPropertyComponent implements OnInit {

	@Input()
	public property: ColorPropertyContract;
	@Input()
	public dataPath: string;

	public value: string;
	public validationError: string;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.value = this.stateService.getValue<string>(this.dataPath);
		this.validate();
	}

	public onChanged(value: string) {
		this.value = value || null;
		this.stateService.setValue(this.dataPath, this.value);
		this.validate();
	}

	private validate() {
		this.validationError = this.stateService.validate(this.property, this.dataPath, this.value);
	}
}
