import { Component, Input, OnInit } from '@angular/core';
import { TextPropertyContract } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';

@Component({
	selector: 'app-text-property',
	templateUrl: './text-property.component.html'
})
export class TextPropertyComponent implements OnInit {

	@Input()
	public property: TextPropertyContract;
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
