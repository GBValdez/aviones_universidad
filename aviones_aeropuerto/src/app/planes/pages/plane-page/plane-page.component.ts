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
  posInterface,
  seatInterface,
  seatPosInterface,
  sectionDto,
} from '@plane/interfaces/plane.interface';
import { BtnUploadFileModule } from '@utils/btn-upload-file/btn-upload-file.module';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DrErrorInputsDirective } from '@utils/dr-error-inputs/dr-error-inputs.directive';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';

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
    MatSliderModule,
  ],
  templateUrl: './plane-page.component.html',
  styleUrl: './plane-page.component.scss',
})
export class PlanePageComponent implements AfterViewInit {
  currentWidth: number = 0;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key.toUpperCase()) {
      case 'A':
        this.opt = 'add';
        break;
      case 'S':
        this.opt = 'move';
        break;
      case 'D':
        this.opt = 'delete';
        break;
    }
  }

  opt: string = 'add';
  keepClicking: boolean = false;

  constructor(private fb: FormBuilder) {}
  ngAfterViewInit(): void {
    this.ctx = this.getCanvas.getContext('2d')!;
  }
  pressClick(event: MouseEvent) {
    if (event.button == 0) {
      this.addSeat(event);
      this.keepClicking = true;
    }
  }
  releaseClick(event: MouseEvent) {
    if (event.button == 0) this.keepClicking = false;
  }

  seeGrid: boolean = true;
  fitToGrid: boolean = true;
  ctx!: CanvasRenderingContext2D;
  form: FormGroup = this.fb.group({
    sizeSeat: [10, [Validators.min(1), Validators.required]],
  });

  validatorOffset: ValidatorFn = (control) => {
    const tamPx = this.form.get('sizeSeat')?.value;
    return control.value > tamPx ? { offset: true } : null;
  };
  modifyTam() {
    this.formDisplace.patchValue({ xDes: 0, yDes: 0 });
    this.reMakeCanvas();
  }

  formDisplace: FormGroup = this.fb.group({
    xDes: [0, [Validators.min(0), Validators.required, this.validatorOffset]],
    yDes: [0, [Validators.min(0), Validators.required, this.validatorOffset]],
  });

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  get getCanvas() {
    return this.canvas.nativeElement;
  }
  seats: seatPosInterface[] = [];
  sections: sectionDto[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeSeat();
    this.resizePlane();
    if (this.seeGrid) this.reMakeCanvas();
  }

  resizeSeat() {
    if (this.form.valid) {
      const fntSize: number = this.form.get('sizeSeat')!.value;
      const newFntSize =
        (fntSize * this.container.nativeElement.clientWidth) /
        this.currentWidth;
      this.form.get('sizeSeat')!.setValue(newFntSize);
    }
    this.currentWidth = this.container.nativeElement.clientWidth;
  }

  img: any;
  wScreen: number = window.innerWidth;
  hScreen: number = window.innerHeight;

  reMakeCanvas() {
    if (this.form.valid && this.img && this.formDisplace.valid)
      setTimeout(() => {
        const container = this.container.nativeElement;
        this.getCanvas.height = container.clientHeight;
        this.getCanvas.width = container.clientWidth;
        const { height, width } = this.getCanvas;
        this.ctx.clearRect(0, 0, width, height);
        const tam = this.form.get('sizeSeat')!.value;
        const { xDes, yDes } = this.formDisplace.value;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        for (let y = -tam + yDes; y < height; y += tam) {
          this.ctx.moveTo(0, y);
          this.ctx.lineTo(width, y);
        }
        for (let x = -tam + xDes; x < width; x += tam) {
          this.ctx.moveTo(x, 0);
          this.ctx.lineTo(x, height);
        }
        this.ctx.strokeStyle = '#000000';

        this.ctx.stroke();
      }, 70);
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
      setTimeout(() => {
        this.currentWidth = this.container.nativeElement.clientWidth;
      }, 5);
    }
  }

  fitAtGrid(x: number, y: number) {
    if (!this.fitToGrid || !this.seeGrid) return { x, y };
    const tam = this.form.get('sizeSeat')!.value;
    const { xDes, yDes } = this.formDisplace.value;
    x = Math.floor(x / tam) * tam + tam / 2;
    x += xDes;
    y = Math.floor(y / tam) * tam + tam / 2;
    y += yDes;
    return { x, y };
  }

  addSeat(event: MouseEvent) {
    if (!this.keepClicking) return;
    if (this.opt != 'add') return;
    const pos = this.setPosition(event);
    if (
      this.seats.find(
        (seat) => seat.position.x == pos.x && seat.position.y == pos.y
      )
    )
      return;
    this.seats.push({ position: this.setPosition(event), clase_id: '1' });
  }

  sliderChange(control: string, value: number) {
    this.formDisplace.get(control)!.setValue(value);
    this.reMakeCanvas();
  }

  drag(event: DragEvent, seat: seatPosInterface) {
    if (this.opt != 'move') return;
    seat.position = this.setPosition(event);
  }

  setPosition(mouse: MouseEvent): posInterface {
    const rect = this.container.nativeElement.getBoundingClientRect();
    let x = mouse.pageX - rect.left - window.scrollX; // Posición relativa X dentro del elemento
    let y = mouse.pageY - rect.top - window.scrollY; // Posición relativa Y dentro del elemento
    const { x: x1, y: y1 } = this.fitAtGrid(x, y);
    x = (x1 * 100) / this.getCanvas.width;
    y = (y1 * 100) / this.getCanvas.height;
    return { x, y };
  }
  deleteSeat(seat: seatPosInterface) {
    if (!this.keepClicking) return;
    this.deletingSeat(seat);
  }
  deletingSeat(seat: seatPosInterface) {
    if (this.opt != 'delete') return;
    this.seats = this.seats.filter((s) => s != seat);
  }

  deleteMousedown(event: MouseEvent, seat: seatPosInterface) {
    if (event.button == 0) this.deletingSeat(seat);
  }
}
