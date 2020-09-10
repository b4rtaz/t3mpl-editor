import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagePropertyContract } from 't3mpl-core/core/model';

import { ImagePickerPopupService } from '../../popups/image-picker/image-picker-popup.service';
import { StateService } from '../../state.service';

const MAX_HEIGHT = 55;
const MAX_WIDTH = 100;

@Component({
	selector: 'app-image-property',
	templateUrl: './image-property.component.html'
})
export class ImagePropertyComponent implements OnInit {

	@Input()
	public property: ImagePropertyContract;
	@Input()
	public dataPath: string;

	public value: string;
	public previewDataUrl: SafeResourceUrl;
	public validationError: string;

	public pickerWidth: number;
	public pickerHeight: number;

	public constructor(
		private readonly stateService: StateService,
		private readonly imagePickerService: ImagePickerPopupService,
		private readonly domSanitizer: DomSanitizer) {
	}

	public ngOnInit() {
		this.value = this.stateService.getValue<string>(this.dataPath);
		this.validate();
		this.loadPreview();

		if (this.property.width && this.property.height) {
			if (this.property.width > MAX_WIDTH || this.property.height > MAX_HEIGHT) {
				let scale = MAX_WIDTH / this.property.width;
				this.pickerWidth = scale * this.property.width;
				this.pickerHeight = scale * this.property.height;
				if (this.pickerHeight > MAX_HEIGHT) {
					scale = MAX_HEIGHT / this.pickerHeight;
					this.pickerWidth *= scale;
					this.pickerHeight *= scale;
				}
			} else {
				this.pickerWidth = this.property.width;
				this.pickerHeight = this.property.height;
			}
		} else {
			this.pickerWidth = MAX_WIDTH / 2;
			this.pickerHeight = MAX_HEIGHT / 2;
		}
	}

	private loadPreview() {
		if (this.value) {
			const content = this.stateService.contentStorage.getContent('dataUrl', this.value);
			this.previewDataUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(content);
		} else {
			this.previewDataUrl = null;
		}
	}

	public pick() {
		this.imagePickerService.pick(this.value).subscribe(filePath => {
			if (this.value !== filePath) {
				this.stateService.setValue(this.dataPath, filePath);
				this.value = filePath;
				this.validate();
				this.loadPreview();
			}
		});
	}

	public clear() {
		this.stateService.setValue(this.dataPath, null);
		this.value = null;
		this.previewDataUrl = null;
	}

	private validate() {
		this.validationError = this.stateService.validate(this.property, this.dataPath, this.value);
	}
}
