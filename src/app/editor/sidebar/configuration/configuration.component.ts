import { Component, OnInit } from '@angular/core';
import { PagePathStrategy, TemplateConfiguration } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';

@Component({
	selector: 'app-configuration',
	templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {

	public configuration: TemplateConfiguration;

	public pagePathStrategies: PagePathStrategyItem[] = [
		{ strategy: PagePathStrategy.absolute, label: 'Absolute Path Strategy', example: '/pages/contact.html', isChecked: false },
		{ strategy: PagePathStrategy.directory, label: 'Directory Path Strategy', example: '/pages/contact/', isChecked: false }
	];

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.configuration = this.stateService.configuration;
		this.reloadPagePathStrategy();
	}

	private reloadPagePathStrategy() {
		this.pagePathStrategies.forEach(pps => {
			pps.isChecked = this.configuration.pagePathStrategy === pps.strategy;
		});
	}

	public onPagePathStrategyChanged(strategy: PagePathStrategy) {
		this.configuration.pagePathStrategy = strategy;
		this.stateService.setConfiguration(this.configuration);
		this.reloadPagePathStrategy();
	}
}

interface PagePathStrategyItem {
	strategy: PagePathStrategy;
	label: string;
	example: string;
	isChecked: boolean;
}
