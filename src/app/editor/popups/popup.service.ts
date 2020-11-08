import { ComponentFactoryResolver, Injectable, Type, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PopupService {

	private container: ViewContainerRef;

	public constructor(
		private readonly factoryResolver: ComponentFactoryResolver) {
	}

	public setContainer(container: ViewContainerRef) {
		this.container = container;
	}

	public open<R, T extends PopupComponent<R>>(type: Type<T>, setup: (instance: T) => void): Observable<R> {
		if (!this.container) {
			throw new Error('The container is required.');
		}

		const factory = this.factoryResolver.resolveComponentFactory(type);
		const component = factory.create(this.container.injector);
		setup(component.instance);
		this.container.insert(component.hostView);

		return component.instance.result
			.pipe(map(r => {
				this.container.remove();
				return r;
			}));
	}
}

export interface PopupComponent<T> {
	result: Subject<T>;
}
