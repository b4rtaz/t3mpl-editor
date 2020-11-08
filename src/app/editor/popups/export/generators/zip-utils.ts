import * as JSZip from 'jszip';
import { ExportHandler } from 't3mpl-core/core/exporter';
import { ContentType } from 't3mpl-core/core/storage';

import { convertDataUrlToBlob } from '../../../core/dataurl-to-blob-converter';

export function zipExportHandler(zip: JSZip): ExportHandler {
	return (filePath: string, contentType: ContentType, content) => {
		switch (contentType) {
			case 'text':
				zip.file(filePath, content, { binary: false });
				break;

			case 'dataUrl':
				const binary = convertDataUrlToBlob(content);
				zip.file(filePath, binary, { binary: true });
				break;

			default:
				throw new Error('Not supported content type.');
		}
	};
}

export function compress(zip: JSZip): Promise<Blob> {
	return zip.generateAsync({
		type: 'blob',
		compression: 'DEFLATE',
		mimeType: 'application/zip',
		compressionOptions: {
			level: 8
		}
	});
}

export interface ZipFile {
	content: Blob;
	fileName: string;
}
