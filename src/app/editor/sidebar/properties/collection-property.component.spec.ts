import { getCollectionItemName } from './collection-property.component';

describe('getCollectionItemName', () => {

	it('getCollectionItemName() returns proper value', () => {
		expect(getCollectionItemName('Rows')).toEqual('Row');
		expect(getCollectionItemName('Menu Items')).toEqual('Menu Item');
		expect(getCollectionItemName('Logo')).toEqual('Item');
		expect(getCollectionItemName('Item')).toEqual('Item');
		expect(getCollectionItemName('s')).toEqual('Item');
	});
});
