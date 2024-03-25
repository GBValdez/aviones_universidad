import { NgClass, NgStyle } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import {
  seatInterface,
  seatPosInterface,
  sectionDto,
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
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DrErrorInputsDirective } from '@utils/dr-error-inputs/dr-error-inputs.directive';
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
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './plane-page.component.html',
  styleUrl: './plane-page.component.scss',
})
export class PlanePageComponent implements AfterViewInit {
  constructor(private fb: FormBuilder) {}
  ngAfterViewInit(): void {
    this.ctx = this.getCanvas.getContext('2d')!;
  }

  seeGrid: boolean = true;
  ctx!: CanvasRenderingContext2D;
  form: FormGroup = this.fb.group({
    sizeSeat: [10, [Validators.min(1), Validators.required]],
  });

  validatorOffset: ValidatorFn = (control) => {
    const tamPx = this.form.get('sizeSeat')?.value;
    return control.value > tamPx ? { offset: true } : null;
  };

  formDisplace: FormGroup = this.fb.group({
    x: [1, [Validators.min(0), Validators.required, this.validatorOffset]],
    y: [1, [Validators.min(0), Validators.required, this.validatorOffset]],
  });

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  get getCanvas() {
    return this.canvas.nativeElement;
  }
  seats: seatPosInterface[] = [];
  sections: sectionDto[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizePlane();
  }

  img: any;
  wScreen: number = window.innerWidth;
  hScreen: number = window.innerHeight;
  reMakeCanvas() {
    setTimeout(() => {
      const { height, width } = this.getCanvas.getBoundingClientRect();
      console.log(height, width);
      this.ctx.clearRect(0, 0, width, height);
      const tam = this.form.get('sizeSeat')!.value;
      if (tam === 0 || tam == '' || tam == null || tam == undefined) return;
      this.ctx.lineWidth = 0.5;
      this.ctx.beginPath();
      for (let y = 0; y < height; y += tam / 2) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(width, y);
      }
      for (let x = 0; x < width; x += tam) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, height);
      }
      this.ctx.strokeStyle = '#f00';

      this.ctx.stroke();
    }, 100);
  }

  resizePlane() {
    this.wScreen = window.innerWidth;
    this.hScreen = window.innerHeight;
  }

  uploadFile(event: FileList | undefined): void {
    if (event) {
      this.img = URL.createObjectURL(event[0]);
      this.resizePlane();
      this.reMakeCanvas();
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
