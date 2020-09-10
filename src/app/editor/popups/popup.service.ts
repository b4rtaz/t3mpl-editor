import { Injectable, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PopupService {

	private container: ViewContainerRef;

	public setContainer(container: ViewContainerRef) {
		this.container = container;
	}

	public getContainer(): ViewContainerRef {
		if (!this.container) {
			throw new Error('No container.');
		}
		return this.container;
	}
}

export interface PopupComponent<T> {
	result: Subject<T>;
}
