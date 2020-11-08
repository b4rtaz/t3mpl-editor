import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
	selector: '[appScrollDown]'
})
export class ScrollDownDirective implements OnChanges {

	@Input()
	public follow: any;

	public constructor(
		private readonly el: ElementRef<HTMLElement>) {
	}

	public ngOnChanges() {
		setTimeout(() => {
			this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
		});
	}
}
