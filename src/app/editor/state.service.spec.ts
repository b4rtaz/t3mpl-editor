import { Page } from 't3mpl-core/core/model';

import { getNextCurrentPage } from './state.service';

describe('StateService', () => {

	it('getNextCurrentPage() returns proper value', () => {
		const pages1: Page[] = [
			{ filePath: 'a.html', name: 'A', templateFilePath: 'a.html' },
			{ filePath: 'b.html', name: 'B', templateFilePath: 'b.html' },
			{ filePath: 'c.html', name: 'C', templateFilePath: 'c.html' }
		];

		const pages2 = [...pages1];
		pages2.splice(1, 2);
		pages2.push({ filePath: 'o.html', name: 'O', templateFilePath: 'o.html' });

		const r1 = getNextCurrentPage(pages1, pages1, pages1[1]);
		expect(r1).toBeNull();

		const r2 = getNextCurrentPage(pages1, pages2, pages1[0]);
		expect(r2.filePath).toEqual('a.html');

		const r3 = getNextCurrentPage([], pages1, null);
		expect(r3.filePath).toEqual('a.html');

		const r4 = getNextCurrentPage(pages1, pages2, pages1[1]);
		expect(r4.filePath).toEqual('a.html');
	});
});
