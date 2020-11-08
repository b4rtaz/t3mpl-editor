
export function convertDataUrlToBlob(dataUrl: string): Blob {
	const pos = dataUrl.indexOf(',');
	const bytes = atob(dataUrl.substring(pos + 1));

	const ab = new ArrayBuffer(bytes.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}
	return new Blob([ab]);
}
