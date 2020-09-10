import { readTitleSuffix } from './editor.component';

describe('EditorComponent', () => {

	it('readTitleSuffix() returns proper value', () => {
		expect(readTitleSuffix('alfa - dot.com', ' - ')).toEqual('dot.com');
		expect(readTitleSuffix('alfa - beta - bar.com', ' - ')).toEqual('bar.com');
		expect(readTitleSuffix('foo.org', ' - ')).toEqual('foo.org');
	});
});
