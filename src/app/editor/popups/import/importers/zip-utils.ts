import * as JSZip from 'jszip';
import { WritableStorage } from 't3mpl-core/core/storage';
import { getFileExt, isTextFileExt } from 't3mpl-core/core/utils/path-utils';

export async function unzipToStorage(file: File, storage: WritableStorage): Promise<void> {
	const zip = new JSZip();
	await zip.loadAsync(file);

	const filePaths = Object.keys(zip.files)
		.filter(fp => !fp.endsWith('/'));

	for (const filePath of filePaths) {
		const fileExt = getFileExt(filePath);
		const isText = isTextFileExt(fileExt);
		const zipFile = zip.file(filePath);

		if (isText) {
			const textContent = await zipFile.async('text');
			storage.setContent('text', filePath, textContent);
		} else {
			const dataUrlContent = await convertBlobToDataUrl(zipFile.async('blob'));
			storage.setContent('dataUrl', filePath, dataUrlContent);
		}
	}
}

function convertBlobToDataUrl(p: Promise<Blob>): Promise<string> {
	return new Promise((resolve, reject) => {
		p.then(blob => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result as string);
			};
			reader.onerror = e => reject(e);
			reader.readAsDataURL(blob);
		}, e => reject(e));
	});
}
