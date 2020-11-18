import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataActivator } from 't3mpl-core/core/data/data-activator';
import { DataPath } from 't3mpl-core/core/data/data-path';
import { DataValidator } from 't3mpl-core/core/data/data-validator';
import { MemoryStorage } from 't3mpl-core/core/memory-storage';
import {
	Page,
	PropertyContract,
	PropertyContractMap,
	TemplateConfiguration,
	TemplateData,
	TemplateManifest
} from 't3mpl-core/core/model';
import { PagesResolver } from 't3mpl-core/core/pages-resolver';
import { ReadableStorage, WritableStorage } from 't3mpl-core/core/storage';
import { getDefaultConfiguration } from 't3mpl-core/core/template-configuration';

import { TemplateSource } from './template-source';

@Injectable()
export class StateService {

	private dataActivator: DataActivator;
	private dataValidator: DataValidator;

	public onStateChanged: Subject<string> = new Subject();
	public onDataChanged: Subject<string> = new Subject();
	public onConfigurationChanged: Subject<void> = new Subject();
	public onPageChanged: Subject<string> = new Subject();
	public onPreviewModeChanged: Subject<void> = new Subject();

	public pages: Page[];
	public currentPage: Page;

	public previewMode: PreviewMode = 'desktop';

	public templateSource: TemplateSource;
	public templateManifest: TemplateManifest;
	public templateStorage: ReadableStorage;
	public contentStorage: WritableStorage;
	public templateData: TemplateData;

	//

	public setState(
		templateSource: TemplateSource,
		templateManifest: TemplateManifest,
		templateStorage: ReadableStorage,
		contentStorage?: WritableStorage,
		templateData?: TemplateData) {

		if (!contentStorage) {
			contentStorage = new MemoryStorage();
		}
		this.dataValidator = new DataValidator();
		this.dataActivator = new DataActivator(templateStorage, contentStorage);
		if (!templateData) {
			templateData = {
				meta: {
					name: templateManifest.meta.name,
					version: templateManifest.meta.version,
					filePaths: []
				},
				configuration: getDefaultConfiguration(),
				data: this.dataActivator.createInstance(templateManifest.dataContract)
			};
		}

		this.templateSource = templateSource;
		this.templateManifest = templateManifest;
		this.templateStorage = templateStorage;
		this.contentStorage = contentStorage;
		this.templateData = templateData;

		this.currentPage = null;
		this.reloadPages(false);

		this.onStateChanged.next();
	}

	public setPreviewMode(mode: PreviewMode) {
		this.previewMode = mode;
		this.onPreviewModeChanged.next();
	}

	public setCurrentPage(pageVirtualFilePath: string) {
		this.currentPage = this.pages.find(p => p.virtualFilePath === pageVirtualFilePath);
		this.onPageChanged.next();
	}

	public setConfiguration(configuration: TemplateConfiguration) {
		this.templateData.configuration = configuration;
		this.reloadPages(true);
		this.onConfigurationChanged.next();
	}

	public validate<T>(propertyContract: PropertyContract, dataPath: string, value: T): string {
		const errors = this.dataValidator.validateProperty(propertyContract, dataPath, value);
		return errors[dataPath] ? errors[dataPath] : null;
	}

	public validateAll(): string[] {
		const errors = this.dataValidator.validate(this.templateManifest.dataContract, this.templateData.data);
		return Object.keys(errors);
	}

	public getValue<T>(dataPath: string): T {
		return DataPath.parse(dataPath).get(this.templateData.data);
	}

	public setValue<T>(dataPath: string, value: T) {
		DataPath.parse(dataPath).set(this.templateData.data, value);
		this.dataChanged(dataPath);
	}

	public unshiftItem(dataPath: string, map: PropertyContractMap) {
		const newItem = this.dataActivator.createPropertiesInstance(map);
		DataPath.parse(dataPath).unshiftItem(this.templateData.data, newItem);
		this.dataChanged(dataPath);
	}

	public removeItem(dataPath: string, index: number) {
		DataPath.parse(dataPath).removeItem(this.templateData.data, index);
		this.dataChanged(dataPath);
	}

	public moveItem(dataPath: string, oldIndex: number, newIndex: number) {
		DataPath.parse(dataPath).moveItem(this.templateData.data, oldIndex, newIndex);
		this.dataChanged(dataPath);
	}

	private dataChanged(dataPath: string) {
		this.reloadPages(true);
		this.onDataChanged.next(dataPath);
	}

	private reloadPages(fireEvent: boolean) {
		const prevPages = this.pages;
		const pagesResolver = new PagesResolver(this.templateData.configuration.pagePathStrategy);
		this.pages = pagesResolver.resolve(this.templateManifest.pages, this.templateData.data);
		const newCurrentPage = getNextCurrentPage(prevPages, this.pages, this.currentPage);
		if (newCurrentPage) {
			this.currentPage = newCurrentPage;
			if (fireEvent) {
				this.onPageChanged.next();
			}
		}
	}
}

export function getNextCurrentPage(prevPages: Page[], newPages: Page[], currentPage: Page) {
	if (!currentPage || !newPages.find(p => p.virtualFilePath === currentPage.virtualFilePath)) {
		return newPages.length > 0 ? newPages[0] : null;
	}
	if (prevPages.length !== newPages.length || newPages.find((p, ix) => p.virtualFilePath !== prevPages[ix].virtualFilePath)) {
		return currentPage;
	}
	return null;
}

export type PreviewMode = 'desktop' | 'mobile' | 'data';
