import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { IMAGE_CONTENT_BASE_PATH } from 't3mpl-core/core/constants';
import { generateFileName } from 't3mpl-core/core/utils/file-name-generator';
import { getFileExt } from 't3mpl-core/core/utils/path-utils';

import { StateService } from '../../state.service';
import { PopupComponent } from '../popup.service';

const MAX_SIZE = 200;

@Component({
	selector: 'app-image-picker-popup',
	templateUrl: './image-picker-popup.component.html'
})
export class ImagePickerPopupComponent implements OnInit, PopupComponent<string> {

	private context: CanvasRenderingContext2D;
	private newFilePath: string;

	public readonly result: Subject<string> = new Subject();

	@ViewChild('canvas', { static: true })
	public canvas: ElementRef<HTMLCanvasElement>;

	public filePath: string;

	public constructor(
		private readonly stateService: StateService) {
	}

	public ngOnInit() {
		this.context = this.canvas.nativeElement.getContext('2d');
		if (this.filePath) {
			this.reloadPreview();
		}
	}

	public onChanged(event: Event) {
		const files = (event.target as any).files as File[];
		if (files && files[0]) {
			const reader = new FileReader();
			reader.onload = () => {
				const data = reader.result as string;
				const sourceFileName = files[0].name;
				this.newFilePath = IMAGE_CONTENT_BASE_PATH + generateFileName({
					fileExt: getFileExt(sourceFileName)
				});
				this.stateService.contentStorage.setContent('dataUrl', this.newFilePath, data);
				this.reloadPreview();
			};
			reader.readAsDataURL(files[0]);
		}
	}

	private reloadPreview() {
		const image = new Image();
		image.onload = () => {
			const scale = Math.min(
				MAX_SIZE / image.width,
				MAX_SIZE / image.height
			);
			const width = image.width * scale;
			const height = image.height * scale;

			this.canvas.nativeElement.width = width;
			this.canvas.nativeElement.height = height;
			this.context.drawImage(image, 0, 0, width, height);
		};
		image.src = this.stateService.contentStorage.getContent('dataUrl', this.getCurrentFilePath());
	}

	private getCurrentFilePath(): string {
		return this.newFilePath
			? this.newFilePath
			: this.filePath;
	}

	public save() {
		this.result.next(this.getCurrentFilePath());
	}

	public cancel() {
		if (this.newFilePath) {
			this.stateService.contentStorage.remove('dataUrl', this.newFilePath);
		}
		this.result.next(this.filePath);
	}
}
