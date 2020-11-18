import { DataSerializer } from 't3mpl-core/core/data/data-serializer';
import { Exporter } from 't3mpl-core/core/exporter';
import { TemplateData, TemplateManifest } from 't3mpl-core/core/model';
import { UsedFilesScanner } from 't3mpl-core/core/scanners/used-files-scanner';
import { ContentType, ReadableStorage } from 't3mpl-core/core/storage';

import { ajax } from '../../core/ajax';
import { convertDataUrlToBlob } from '../../core/dataurl-to-blob-converter';

export type LoggerHandler = (message: string) => void;

export async function uploadTemplateData(
	websiteUrl: string,
	templateManifest: TemplateManifest,
	templateData: TemplateData,
	contentStorage: ReadableStorage,
	logger: LoggerHandler): Promise<void> {

	logger('Connecting...');
	const artefact = await ajax<CreateArtefactResponse>({
		method: 'POST',
		url: websiteUrl,
		responseType: 'json'
	});
	logger(`Connected ${artefact.commit}`);

	logger('Uploading...');
	const queue: QueueItem[] = [];
	Exporter.exportData(
		templateManifest,
		templateData,
		contentStorage,
		new DataSerializer(),
		new UsedFilesScanner(contentStorage),
		(filePath, contentType, content) => {
			queue.push({
				filePath,
				contentType,
				content
			});
		}
	);

	const batchSize = 4;
	for (let i = 0; i < queue.length; i += batchSize) {
		const promises = [];
		const messages = [];
		for (let j = 0; j < i + batchSize && j < queue.length; j++) {
			const item = queue[j];
			const url = websiteUrl + artefact.dataDir + item.filePath;
			promises.push(uploadFile(url, item.contentType, item.content));
			messages.push(`Uploaded ${item.filePath}`);
		}
		await Promise.all(promises);
		messages.forEach(m => logger(m));
	}

	logger('Publishing...');
	await ajax({
		method: 'POST',
		url: websiteUrl + artefact.commit,
		responseType: 'json'
	});

	logger('Success!');
}

function uploadFile(url: string, contentType: ContentType, content: string): Promise<PutArtefactFileResponse> {
	if (contentType === 'text') {
		return ajax<PutArtefactFileResponse>({
			method: 'PUT',
			url,
			contentType: 'text/plain',
			responseType: 'json',
			timeout: 30000,
			file: content
		});
	} else {
		const blob = convertDataUrlToBlob(content);
		return ajax<PutArtefactFileResponse>({
			method: 'PUT',
			url,
			contentType: 'application/octet-stream',
			responseType: 'json',
			timeout: 30000,
			file: blob
		});
	}
}

type QueueItem = {
	filePath: string,
	contentType: ContentType,
	content: string
};

interface CreateArtefactResponse {
	dataDir: string;
	commit: string;
}

interface PutArtefactFileResponse {
	success: boolean;
}
