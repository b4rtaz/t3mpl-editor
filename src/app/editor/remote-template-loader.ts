import { MemoryStorage } from 't3mpl-core/core/memory-storage';
import { TemplateManifest } from 't3mpl-core/core/model';
import { TemplateManifestParser } from 't3mpl-core/core/template-manifest-parser';
import { getBasePath, getFileExt, isTextFileExt } from 't3mpl-core/core/utils/path-utils';

export class RemoteTemplateLoader {

	public async load(manifestUrl: string): Promise<Template> {
		const manifestRaw = await ajax<string>(manifestUrl, 'text');
		const parser = new TemplateManifestParser();
		const manifest = parser.parse(manifestRaw);

		const baseUrl = getBasePath(manifestUrl);
		const templateStorage = new MemoryStorage();
		templateStorage.setContent('text', 'template.yaml', manifestRaw);

		const isText = manifest.meta.filePaths.map(filePath => {
			const fileExt = getFileExt(filePath);
			return isTextFileExt(fileExt);
		});

		const contents = await Promise.all(manifest.meta.filePaths.map((filePath, i) => {
			const contentUrl = baseUrl + filePath;
			return isText[i]
				? ajax<string>(contentUrl, 'text')
				: ajaxAsBase64(contentUrl);
		}));

		manifest.meta.filePaths.forEach((filePath, i) => {
			if (isText[i]) {
				templateStorage.setContent('text', filePath, contents[i]);
			} else {
				templateStorage.setContent('dataUrl', filePath, contents[i]);
			}
		});

		return {
			templateManifest: manifest,
			templateStorage
		};
	}
}

export class Template {
	templateManifest: TemplateManifest;
	templateStorage: MemoryStorage;
}

function ajax<T>(url: string, responseType: XMLHttpRequestResponseType): Promise<T> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = responseType;
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(xhr.response as T);
				} else {
					reject('Invalid response.');
				}
			}
		};
		xhr.onerror = (e) => reject(e);
		xhr.open('GET', url);
		xhr.send();
	});
}

function ajaxAsBase64(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		ajax(url, 'blob').then(data => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.onerror = (e) => {
				reject(e);
			};
			reader.readAsDataURL(data as Blob);
		}, e => reject(e));
	});
}
