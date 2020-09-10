import * as JSZip from 'jszip';
import { ExportHandler } from 't3mpl-core/core/exporter';
import { ContentType } from 't3mpl-core/core/storage';

export function zipExportHandler(zip: JSZip): ExportHandler {
	return (filePath: string, contentType: ContentType, content) => {
		if (contentType === 'text') {
			zip.file(filePath, content, { binary: false });
		} else {
			const base64 = removeDataUrlPrefix(content);
			zip.file(filePath, base64, { base64: true });
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

function removeDataUrlPrefix(dataUrl: string): string {
	return dataUrl.substring(dataUrl.indexOf(','));
}

export interface ZipFile {
	content: Blob;
	fileName: string;
}
