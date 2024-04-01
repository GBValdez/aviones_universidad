import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import {
  posInterface,
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
import { MatSliderModule } from '@angular/material/slider';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  closeSidenav: boolean = false;
  seeGrid: boolean = true;
  fitToGrid: boolean = true;
  ctx!: CanvasRenderingContext2D;
  form: FormGroup = this.fb.group({
    sizeSeat: [10, [Validators.min(1), Validators.required]],
  });
  timeOutSize: any;
  opt: WritableSignal<string> = signal('navigation');
  zoom: WritableSignal<number> = signal(1);
  keepClicking: boolean = false;
  dragTouchSeat?: seatPosInterface;
  posOrigin?: posInterface;
  translatePos: posInterface = { x: 0, y: 0 };
  sizePixelSize: number = 10;
  constructor(private fb: FormBuilder, private matSnack: MatSnackBar) {
    effect(() => {
      switch (this.opt()) {
        case 'add':
          this.matSnack.open('Modo añadir sillas', 'Ok', { duration: 2000 });
          break;
        case 'move':
          this.matSnack.open('Modo mover sillas', 'Ok', { duration: 2000 });
          break;
        case 'delete':
          this.matSnack.open('Modo eliminar sillas', 'Ok', { duration: 2000 });
          break;
        case 'navigation':
          this.matSnack.open('Modo navegación', 'Ok', { duration: 2000 });
          break;
      }
    });
    effect(() => {
      matSnack.open(`Zoom: ${this.zoom()}`, 'Ok', { duration: 2000 });
    });
  }
  ngAfterViewInit(): void {
    this.ctx = this.getCanvas.getContext('2d')!;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key.toUpperCase()) {
      case 'A':
        this.opt.set('navigation');
        break;
      case 'S':
        this.opt.set('add');
        break;
      case 'D':
        this.opt.set('move');
        break;
      case 'F':
        this.opt.set('delete');
        break;
      case 'Q':
        this.zoom.update((z) => z - 0.1);
        break;
      case 'W':
        this.zoom.update((z) => z + 0.1);
        break;
      case 'E':
        this.zoom.set(1);
        break;
      case 'R':
        this.closeSidenav = !this.closeSidenav;
        this.matSnack.open(
          this.closeSidenav
            ? "'Ocultar menú lateral'"
            : 'Mostrar barra lateral',
          'Ok',
          { duration: 2000 }
        );
        break;
    }
  }
  //Presionar
  pressTouch(event: TouchEvent) {
    event.preventDefault();
    this.startInteraction(event.touches[0]);
  }

  pressClick(event: MouseEvent) {
    if (event.button == 0) this.startInteraction(event);
  }

  startInteraction(event: MouseEvent | Touch): void {
    this.keepClicking = true;
    this.addSeat(event);
    this.navigationStart(event);
  }

  //Mover
  touchMove(event: TouchEvent) {
    if (event.changedTouches && event.changedTouches.length > 0)
      this.interactionMove(event.changedTouches[0], event);
  }
  mouseMove(event: MouseEvent) {
    this.interactionMove(event, event);
  }

  interactionMove(
    event: MouseEvent | Touch,
    evt: MouseEvent | TouchEvent
  ): void {
    evt.preventDefault();
    this.addSeat(event);
    this.navigateMove(event);
    if (this.opt() != 'move') return;
    if (this.dragTouchSeat == undefined) return;
    const newPos = this.setPosition(event);
    if (
      !this.seats.some(
        (s) => s.position.x == newPos.x && s.position.y == newPos.y
      )
    )
      this.dragTouchSeat.position = newPos;
  }
  //Soltar
  releaseClick(event: MouseEvent) {
    if (event.button == 0) this.endInteraction(event);
  }

  touchEnd(event: TouchEvent): void {
    if (event.changedTouches && event.changedTouches.length > 0) {
      this.endInteraction(event.changedTouches[0]);
    }
  }
  endInteraction(event: MouseEvent | Touch): void {
    this.keepClicking = false;
    this.navigateEnd();
    if (this.opt() != 'move') return;
    if (this.dragTouchSeat == undefined) return;
    this.dragTouchSeat.position = this.setPosition(event);
    this.dragTouchSeat = undefined;
  }
  //Click o touch en silla
  mousedown(event: MouseEvent, seat: seatPosInterface) {
    if (event.button == 0) this.interactiveSeat(seat, event);
  }

  touchStart(seat: seatPosInterface, event: TouchEvent) {
    this.interactiveSeat(seat, event);
  }

  interactiveSeat(seat: seatPosInterface, event: MouseEvent | TouchEvent) {
    this.deletingSeat(seat);
    if (this.opt() != 'move') return;
    this.dragTouchSeat = seat;
    event.preventDefault();
  }

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
    if (this.timeOutSize) clearTimeout(this.timeOutSize);
    this.resizePlane();
    this.timeOutSize = setTimeout(() => {
      if (this.seeGrid) this.reMakeCanvas();
      this.resizeSeat();
    }, 20);
  }

  resizeSeat() {
    const fntPor: number = this.form.get('sizeSeat')!.value;
    this.sizePixelSize =
      (fntPor / 100) * this.container.nativeElement.clientWidth;
    console.log('size', this.sizePixelSize);
    console.log('width', this.container.nativeElement.clientWidth);
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
        const tam = (this.form.get('sizeSeat')!.value / 100) * width;
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
      if (this.timeOutSize) clearTimeout(this.timeOutSize);
      this.timeOutSize = setTimeout(() => {
        this.resizeSeat();
        this.resizePlane();
        this.reMakeCanvas();
      }, 2);
    }
  }

  fitAtGrid(x: number, y: number) {
    if (!this.fitToGrid || !this.seeGrid) return { x, y };
    const container = this.container.nativeElement;
    const tam =
      (this.form.get('sizeSeat')!.value / 100) * container.clientWidth;
    const { xDes, yDes } = this.formDisplace.value;
    x = Math.floor(x / tam) * tam + tam / 2;
    x += xDes;
    y = Math.floor(y / tam) * tam + tam / 2;
    y += yDes;
    return { x, y };
  }

  addSeat(event: MouseEvent | Touch) {
    if (!this.keepClicking) return;
    if (this.opt() != 'add') return;
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

  setPosition(mouse: MouseEvent | Touch): posInterface {
    const rect = this.container.nativeElement.getBoundingClientRect();
    let x = mouse.pageX - rect.left - window.scrollX; // Posición relativa X dentro del elemento
    let y = mouse.pageY - rect.top - window.scrollY; // Posición relativa Y dentro del elemento
    x = x / this.zoom(); // Ajusta x por el factor de zoom
    y = y / this.zoom(); // Ajusta y por el factor de zoom
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
    if (this.opt() != 'delete') return;
    this.seats = this.seats.filter((s) => s != seat);
  }

  navigationStart(event: MouseEvent | Touch) {
    if (this.opt() != 'navigation') return;
    this.posOrigin = this.setPosition(event);
  }

  navigateMove(event: MouseEvent | Touch) {
    if (this.opt() != 'navigation' || !this.keepClicking) return;
    if (!this.posOrigin) return;
    const pos = this.setPosition(event);
    this.translatePos = {
      x: this.translatePos.x + pos.x - this.posOrigin.x,
      y: this.translatePos.y + pos.y - this.posOrigin.y,
    };
  }
  navigateEnd() {
    if (this.opt() != 'navigation') return;
    this.posOrigin = undefined;
  }
  refresh() {
    this.zoom.set(1);
    this.posOrigin = undefined;
    this.translatePos = { x: 0, y: 0 };
  }
}
