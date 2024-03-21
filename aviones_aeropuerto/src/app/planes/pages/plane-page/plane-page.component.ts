import { Component } from '@angular/core';
import { BtnUploadFileModule } from '@utils/btn-upload-file/btn-upload-file.module';

@Component({
  selector: 'app-plane-page',
  standalone: true,
  imports: [BtnUploadFileModule],
  templateUrl: './plane-page.component.html',
  styleUrl: './plane-page.component.scss',
})
export class PlanePageComponent {
  img: any;
  uploadFile(event: FileList | undefined): void {
    if (event) {
      this.img = URL.createObjectURL(event[0]);
    }
  }
}
