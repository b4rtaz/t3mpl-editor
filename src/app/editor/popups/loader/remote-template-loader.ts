import { DataSerializer } from 't3mpl-core/core/data/data-serializer';
import { MemoryStorage } from 't3mpl-core/core/memory-storage';
import { TemplateData, TemplateManifest } from 't3mpl-core/core/model';
import { TemplateManifestParser } from 't3mpl-core/core/template-manifest-parser';
import { getBasePath, getFileExt, isTextFileExt } from 't3mpl-core/core/utils/path-utils';

import { ajaxAsBase64, ajaxAsText } from '../../core/ajax';

export class TemplateBatch {
	templateManifest: TemplateManifest;
	templateStorage: MemoryStorage;
}

export class TemplateDataBatch {
	templateData: TemplateData;
	contentStorage: MemoryStorage;
}

export type OnFileLoadedHandler = (filePath: string) => void;

export async function loadTemplate(manifestUrl: string, onLoaded: OnFileLoadedHandler): Promise<TemplateBatch> {
	const manifestRaw = await ajaxAsText('GET', manifestUrl);
	const parser = new TemplateManifestParser();
	const templateManifest = parser.parse(manifestRaw);

	const baseUrl = getBasePath(manifestUrl);
	const templateStorage = await loadToStorage(baseUrl, templateManifest.meta.filePaths, onLoaded);
	templateStorage.setContent('text', 'template.yaml', manifestRaw);

	return {
		templateManifest,
		templateStorage
	};
}

export async function loadData(dataUrl: string, onLoaded: OnFileLoadedHandler): Promise<TemplateDataBatch> {
	const dataSerializer = new DataSerializer();

	const dataRaw = await ajaxAsText('GET', dataUrl);
	const templateData = dataSerializer.deserialize(dataRaw);

	const baseUrl = getBasePath(dataUrl);
	const contentStorage = await loadToStorage(baseUrl, templateData.meta.filePaths, onLoaded);
	contentStorage.setContent('text', 'data.json', dataRaw);

	return {
		templateData,
		contentStorage
	};
}

async function loadToStorage(baseUrl: string, filePaths: string[], onLoaded: OnFileLoadedHandler): Promise<MemoryStorage> {
	const storage = new MemoryStorage();
	const isText = filePaths.map(filePath => {
		const fileExt = getFileExt(filePath);
		return isTextFileExt(fileExt);
	});

	const contents = await Promise.all(filePaths.map(async (filePath, i) => {
		const contentUrl = baseUrl + filePath;
		const res = isText[i]
			? await ajaxAsText('GET', contentUrl)
			: await ajaxAsBase64('GET', contentUrl);
		onLoaded(filePath);
		return res;
	}));

	filePaths.forEach((filePath, i) => {
		if (isText[i]) {
			storage.setContent('text', filePath, contents[i]);
		} else {
			storage.setContent('dataUrl', filePath, contents[i]);
		}
	});
	return storage;
}
