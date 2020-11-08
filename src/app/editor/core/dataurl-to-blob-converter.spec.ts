import { convertDataUrlToBlob } from './dataurl-to-blob-converter';

describe('convertDataUrlToBlob()', () => {

	it('convertDataUrlToBlob() returns proper value', async () => {
		const blob = convertDataUrlToBlob('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
		expect(await blob.text()).toEqual('Hello, World!');
	});
});
