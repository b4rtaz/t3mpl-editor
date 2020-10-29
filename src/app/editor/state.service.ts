import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataActivator } from 't3mpl-core/core/data/data-activator';
import { DataPath } from 't3mpl-core/core/data/data-path';
import { DataValidator } from 't3mpl-core/core/data/data-validator';
import { Page, PropertyContract, PropertyContractMap, TemplateConfiguration, TemplateManifest } from 't3mpl-core/core/model';
import { PagesResolver } from 't3mpl-core/core/pages-resolver';
import { ReadableStorage, WritableStorage } from 't3mpl-core/core/storage';
import { getDefaultConfiguration } from 't3mpl-core/core/template-configuration';

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

	public templateManifest: TemplateManifest;
	public templateStorage: ReadableStorage;
	public contentStorage: WritableStorage;
	public configuration: TemplateConfiguration;
	public data: any;

	//

	public setState(
		templateManifest: TemplateManifest,
		templateStorage: ReadableStorage,
		contentStorage: WritableStorage,
		configuration?: TemplateConfiguration,
		data?: any) {

		this.dataActivator = new DataActivator(templateStorage, contentStorage);
		this.dataValidator = new DataValidator();

		this.templateManifest = templateManifest;
		this.templateStorage = templateStorage;
		this.contentStorage = contentStorage;
		this.configuration = configuration ? configuration : getDefaultConfiguration();
		this.data = data ? data : this.dataActivator.createInstance(templateManifest.dataContract);

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
		this.configuration = configuration;
		this.reloadPages(true);
		this.onConfigurationChanged.next();
	}

	public validate<T>(propertyContract: PropertyContract, dataPath: string, value: T): string {
		const errors = this.dataValidator.validateProperty(propertyContract, dataPath, value);
		return errors[dataPath] ? errors[dataPath] : null;
	}

	public validateAll(): string[] {
		const errors = this.dataValidator.validate(this.templateManifest.dataContract, this.data);
		return Object.keys(errors);
	}

	public getValue<T>(dataPath: string): T {
		return DataPath.parse(dataPath).get(this.data);
	}

	public setValue<T>(dataPath: string, value: T) {
		DataPath.parse(dataPath).set(this.data, value);
		this.dataChanged(dataPath);
	}

	public unshiftItem(dataPath: string, map: PropertyContractMap) {
		const newItem = this.dataActivator.createPropertiesInstance(map);
		DataPath.parse(dataPath).unshiftItem(this.data, newItem);
		this.dataChanged(dataPath);
	}

	public removeItem(dataPath: string, index: number) {
		DataPath.parse(dataPath).removeItem(this.data, index);
		this.dataChanged(dataPath);
	}

	public moveItem(dataPath: string, oldIndex: number, newIndex: number) {
		DataPath.parse(dataPath).moveItem(this.data, oldIndex, newIndex);
		this.dataChanged(dataPath);
	}

	private dataChanged(dataPath: string) {
		this.reloadPages(true);
		this.onDataChanged.next(dataPath);
	}

	private reloadPages(fireEvent: boolean) {
		const prevPages = this.pages;
		const pagesResolver = new PagesResolver(this.configuration.pagePathStrategy);
		this.pages = pagesResolver.resolve(this.templateManifest.pages, this.data);
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
