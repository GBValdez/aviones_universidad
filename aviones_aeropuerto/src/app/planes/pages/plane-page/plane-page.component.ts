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
  imgBlob!: Blob;
  wImg: number = 0;
  hImg: number = 0;
  uploadFile(event: FileList | undefined): void {
    if (event) {
      this.img = URL.createObjectURL(event[0]);
      const imgElement = new Image();
      imgElement.src = this.img;
      imgElement.onload = () => {
        console.log('Image loaded', imgElement.width, imgElement.height);
        const widthEquivalent =
          (imgElement.width * window.innerHeight) / imgElement.height;

        this.wImg = widthEquivalent;
        this.hImg = window.innerHeight;
      };
    }
  }
}
