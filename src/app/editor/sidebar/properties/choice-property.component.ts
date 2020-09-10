import { Component, Input, OnInit } from '@angular/core';
import { ChoicePropertyContract } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';

@Component({
	selector: 'app-choice-property',
	templateUrl: './choice-property.component.html'
})
export class ChoicePropertyComponent implements OnInit {

	@Input()
	public property: ChoicePropertyContract;
	@Input()
	public dataPath: string;

	public orderedValues: ChoiceValue[];
	public value: string;
	public validationError: string;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.value = this.stateService.getValue(this.dataPath);
		this.validate();

		this.orderedValues = Object.keys(this.property.values).map(value => {
			return {
				value,
				label: this.property.values[value]
			};
		});
		this.orderedValues.sort((a, b) => a.label.localeCompare(b.label));
	}

	public onValueChanged(value: string) {
		this.value = value || null;
		this.stateService.setValue(this.dataPath, this.value);
		this.validate();
	}

	private validate() {
		this.validationError = this.stateService.validate(this.property, this.dataPath, this.value);
	}
}

interface ChoiceValue {
	value: string;
	label: string;
}
