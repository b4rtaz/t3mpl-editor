import { SectionContractMap } from 't3mpl-core/core/model';

import { groupByPanel } from './sidebar.component';

describe('groupByPanel()', () => {

	it('groupByPanel() returns proper value', () => {
		const map: SectionContractMap = {
			ALFA: {
				_panel: 'ubuntu',
				properties: {}
			},
			BETA: {
				_panel: 'linux',
				properties: {}
			},
			GAMMA: {
				_panel: null,
				properties: {}
			},
			DELTA: {
				_panel: 'ubuntu',
				properties: {}
			},
			OMEGA: {
				_panel: 'linux',
				properties: {}
			}
		};

		const panels = groupByPanel(map);

		const panel1SectionNames = Object.keys(panels[0]);
		expect(panel1SectionNames).toContain('ALFA');
		expect(panel1SectionNames).toContain('DELTA');

		const panel2SectionNames = Object.keys(panels[1]);
		expect(panel2SectionNames).toContain('BETA');
		expect(panel2SectionNames).toContain('OMEGA');

		const panel3SectionNames = Object.keys(panels[2]);
		expect(panel3SectionNames).toContain('GAMMA');
	});
});
