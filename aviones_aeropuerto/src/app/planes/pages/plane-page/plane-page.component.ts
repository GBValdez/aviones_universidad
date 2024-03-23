import { NgClass, NgStyle } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {
  seatInterface,
  seatPosInterface,
} from '@plane/interfaces/plane.interface';
import { BtnUploadFileModule } from '@utils/btn-upload-file/btn-upload-file.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-plane-page',
  standalone: true,
  imports: [
    BtnUploadFileModule,
    NgClass,
    NgStyle,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
  ],
  templateUrl: './plane-page.component.html',
  styleUrl: './plane-page.component.scss',
})
export class PlanePageComponent {
  seats: seatPosInterface[] = [];
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizePlane();
  }

  img: any;
  wScreen: number = window.innerWidth;
  hScreen: number = window.innerHeight;
  resizePlane() {
    this.wScreen = window.innerWidth;
    this.hScreen = window.innerHeight;
  }

  uploadFile(event: FileList | undefined): void {
    if (event) {
      this.img = URL.createObjectURL(event[0]);
      this.resizePlane();
    }
  }

  addSeat(event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    let x = event.pageX - rect.left - window.scrollX; // Posición relativa X dentro del elemento
    let y = event.pageY - rect.top - window.scrollY; // Posición relativa Y dentro del elemento
    x = (x * 100) / rect.width;
    y = (y * 100) / rect.height;
    this.seats.push({ position: { x, y }, clase_id: '1' });
  }
}
