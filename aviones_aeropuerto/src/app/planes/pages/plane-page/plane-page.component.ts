import { NgClass, NgStyle } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { BtnUploadFileModule } from '@utils/btn-upload-file/btn-upload-file.module';

@Component({
  selector: 'app-plane-page',
  standalone: true,
  imports: [BtnUploadFileModule, NgClass, NgStyle],
  templateUrl: './plane-page.component.html',
  styleUrl: './plane-page.component.scss',
})
export class PlanePageComponent {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {}

  img: any;
  uploadFile(event: FileList | undefined): void {
    if (event) {
      this.img = URL.createObjectURL(event[0]);
    }
  }
}
