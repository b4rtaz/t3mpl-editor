import { isEqualOrChildOf } from './dropdown.directive';

describe('isEqualOrChildOf', () => {

	it('isEqualOrChildOf() returns proper value', () => {
		// <A>
		//   <B></B>
		//   <C>
		//     <D />
		//   </C>
		// </A>
		const A = document.createElement('i');
		const B = document.createElement('i');
		A.appendChild(B);
		const C = document.createElement('i');
		A.appendChild(C);
		const D = document.createElement('i');
		C.appendChild(D);

		expect(isEqualOrChildOf(B, A)).toBeTrue();
		expect(isEqualOrChildOf(C, A)).toBeTrue();
		expect(isEqualOrChildOf(D, A)).toBeTrue();
		expect(isEqualOrChildOf(A, B)).toBeFalse();
		expect(isEqualOrChildOf(A, C)).toBeFalse();
		expect(isEqualOrChildOf(A, D)).toBeFalse();

		expect(isEqualOrChildOf(D, C)).toBeTrue();
		expect(isEqualOrChildOf(D, B)).toBeFalse();

		expect(isEqualOrChildOf(A, A)).toBeTrue();
	});
});
