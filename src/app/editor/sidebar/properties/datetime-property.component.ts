import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { TextPropertyContract } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';

@Component({
	selector: 'app-datetime-property',
	templateUrl: './datetime-property.component.html'
})
export class DatePropertyComponent implements OnInit {

	@Input()
	public property: TextPropertyContract;
	@Input()
	public dataPath: string;

	public value: string;
	public dateValue: string;
	public timeValue: string;
	public validationError: string;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.value = this.stateService.getValue<string>(this.dataPath);
		if (this.value) {
			const date = dayjs(this.value);
			this.dateValue = date.format('YYYY-MM-DD');
			this.timeValue = date.format('HH:mm:ss');
		}
		this.validate();
	}

	private validate() {
		this.validationError = this.stateService.validate(this.property, this.dataPath, this.value);
	}

	public onDateChanged(value: string) {
		this.dateValue = value;
		this.reloadValue();
	}

	public onTimeChanged(value: string) {
		this.timeValue = value;
		this.reloadValue();
	}

	private reloadValue() {
		if (this.timeValue && this.dateValue) {
			const date = dayjs(this.dateValue + ' ' + this.timeValue, 'YYYY-MM-DD HH:mm:ss', true);
			this.value = date.toISOString();
		} else {
			this.value = null;
		}
		this.stateService.setValue(this.dataPath, this.value);
		this.validate();
	}
}
