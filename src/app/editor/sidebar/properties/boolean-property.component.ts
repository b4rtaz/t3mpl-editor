import { Component, Input, OnInit } from '@angular/core';
import { TextPropertyContract } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';

@Component({
	selector: 'app-boolean-property',
	templateUrl: './boolean-property.component.html'
})
export class BooleanPropertyComponent implements OnInit {

	@Input()
	public property: TextPropertyContract;
	@Input()
	public dataPath: string;

	public value: boolean;
	public validationError: string;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.value = this.stateService.getValue<boolean>(this.dataPath);
		this.validate();
	}

	public onChanged(value: boolean) {
		this.value = value;
		this.stateService.setValue(this.dataPath, this.value);
		this.validate();
	}

	private validate() {
		this.validationError = this.stateService.validate(this.property, this.dataPath, this.value);
	}
}
