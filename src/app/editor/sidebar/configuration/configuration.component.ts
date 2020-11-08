import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagePathStrategy, TemplateConfiguration } from 't3mpl-core/core/model';

import { StateService } from '../../state.service';

@Component({
	selector: 'app-configuration',
	templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {

	public configuration: TemplateConfiguration;

	public pagePathStrategies: PagePathStrategyItem[] = [
		{ strategy: PagePathStrategy.absolute, labelKey: 'configuration.absolutePathStrategy', example: '/pages/contact.html', isChecked: false },
		{ strategy: PagePathStrategy.directory, labelKey: 'configuration.directoryPathStrategy', example: '/pages/contact/', isChecked: false }
	];

	public constructor(
		private readonly stateService: StateService,
		private readonly translate: TranslateService) {
	}

	public ngOnInit() {
		this.configuration = this.stateService.configuration;
		this.reloadPagePathStrategy();
	}

	private reloadPagePathStrategy() {
		this.pagePathStrategies.forEach(pps => {
			pps.isChecked = this.configuration.pagePathStrategy === pps.strategy;
			if (!pps.label) {
				pps.label = this.translate.instant(pps.labelKey);
			}
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
	label?: string;
	labelKey: string;
	example: string;
	isChecked: boolean;
}
