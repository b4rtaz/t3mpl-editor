import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {

	private isVisible: boolean;

	@Input()
	public target: HTMLElement;

	public constructor(
		private readonly el: ElementRef<HTMLElement>,
		private readonly renderer: Renderer2) {
	}

	public ngOnInit() {
		this.hide();
	}

	@HostListener('window:click', ['$event'])
	public onWindowClicked(event: Event) {
		if (this.isVisible) {
			this.hide();
		} else if (isEqualOrChildOf(event.target as HTMLElement, this.el.nativeElement)) {
			this.show();
		}
	}

	@HostListener('window:blur')
	public onWindowBlurred() {
		if (this.isVisible) {
			this.hide();
		}
	}

	private hide() {
		this.renderer.setStyle(this.target, 'display', 'none');
		this.isVisible = false;
	}

	private show() {
		this.renderer.setStyle(this.target, 'display', 'block');
		this.isVisible = true;
	}
}

export function isEqualOrChildOf(element: HTMLElement, parent: HTMLElement): boolean {
	let current = element;
	do {
		if (current === parent) {
			return true;
		}
		current = current.parentElement;
	} while (current);
	return false;
}
