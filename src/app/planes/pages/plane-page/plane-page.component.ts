import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import {
  posInterface,
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
import { MatSliderModule } from '@angular/material/slider';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InputAutocompleteComponent } from '@utils/components/input-autocomplete/input-autocomplete.component';
import { SectionsSvcService } from '@section/services/sections-svc.service';
import { catalogueInterface } from '@utils/commons.interface';
import Swal from 'sweetalert2';
import { LocalStorageService } from '@utils/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { SeatsService } from '@plane/services/seats.service';
import {
  seatCreationDto,
  seatPlaneCreation,
} from '@plane/interfaces/seats.interface';
import { PlaneService } from '@plane/services/plane.service';
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
    InputAutocompleteComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './plane-page.component.html',
  styleUrl: './plane-page.component.scss',
})
export class PlanePageComponent implements AfterViewInit, OnInit {
  closeSidenav: boolean = false;
  seeGrid: boolean = true;
  fitToGrid: boolean = true;
  ctx!: CanvasRenderingContext2D;
  idPlane: number = 0;
  timeOutSize: any;
  opt: WritableSignal<string> = signal('navigation');
  zoom: WritableSignal<number> = signal(1);
  keepClicking: boolean = false;
  dragTouchSeat?: seatPosInterface;
  posOrigin?: posInterface;
  translatePos: posInterface = { x: 0, y: 0 };
  sizePixelSize: number = 10;
  sectIonsOpt: catalogueInterface[] = [];
  sectionsSelected: catalogueInterface[] = [];
  formSect: FormControl = new FormControl();
  secCurrent?: catalogueInterface;
  constructor(
    private fb: FormBuilder,
    private matSnack: MatSnackBar,
    private dialog: MatDialog,
    private sectionSvc: SectionsSvcService,
    private localStorageSvc: LocalStorageService,
    private routerAct: ActivatedRoute,
    private seatsSvc: SeatsService,
    private avionSvc: PlaneService
  ) {
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
  ngOnInit(): void {}

  savePlane(): void {
    if (this.seats.length == 0) {
      Swal.fire({ title: 'Inserte asientos en el plano', icon: 'error' });
      return;
    }
    if (this.form.invalid) {
      Swal.fire({
        title: 'El tamaño de los asientos es invalido',
        icon: 'error',
      });
      return;
    }
    const SEATS_CREATION: seatCreationDto[] = this.seats.map((seat) => {
      return {
        ClaseId: seat.clase.id!,
        posicion: `${seat.position.x}|${seat.position.y}`,
        codigo: 'XD',
      };
    });
    const SEND_BODY: seatPlaneCreation = {
      asientos: SEATS_CREATION,
      sizeSeat: this.form.get('sizeSeat')!.value,
    };
    this.seatsSvc.saveSeats(SEND_BODY, this.idPlane).subscribe((res) => {
      this.localStorageSvc.removeItem('seats');
      this.localStorageSvc.removeItem('imgBackPlane');
      this.localStorageSvc.removeItem('sizeSeat');
      Swal.fire({
        title: 'Los asientos se han guardado con éxito',
        icon: 'success',
      });
    });
  }

  ngAfterViewInit(): void {
    this.idPlane = this.routerAct.snapshot.params['id'];
    this.ctx = this.getCanvas.getContext('2d')!;
    this.sectionSvc.get({ all: true }).subscribe((res) => {
      this.sectIonsOpt = res.items;
    });
    const IMG = this.localStorageSvc.getItem<FileList>('imgBackPlane');
    if (IMG) this.uploadFile(IMG);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key.toUpperCase()) {
      case 'A':
        this.opt.set('navigation');
        break;
      case 'S':
        if (this.secCurrent) this.opt.set('add');
        else
          this.matSnack.open('Selecciona una sección', 'Ok', {
            duration: 2000,
          });
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
    ) {
      this.dragTouchSeat.position = newPos;
      this.localStorageSvc.setItem('seats', this.seats, 0.25 / 24);
    }
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

  validatorHundred: ValidatorFn = (control) => {
    return control.value > 100 || control.value <= 0 ? { hundred: true } : null;
  };
  form: FormGroup = this.fb.group({
    sizeSeat: [10, [this.validatorHundred, Validators.required]],
  });
  modifyTam() {
    setTimeout(() => {
      this.formDisplace.patchValue({ xDes: 0, yDes: 0 });
      this.localStorageSvc.setItem(
        'sizeSeat',
        this.form.get('sizeSeat')!.value
      );
      this.reMakeCanvas();
      this.resizeSeat();
    }, 10);
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
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      const fntPor: number = this.form.get('sizeSeat')!.value;
      this.sizePixelSize =
        (fntPor / 100) * this.container.nativeElement.clientWidth;
    }
  }

  img: any;
  wScreen: number = window.innerWidth;
  hScreen: number = window.innerHeight;

  reMakeCanvas() {
    this.form.updateValueAndValidity();
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

  async uploadFile(event: FileList | undefined) {
    if (event) {
      const reader = new FileReader();
      const ef = this.localStorageSvc;
      reader.onload = function (e) {
        ef.setItem('imgBackPlane', reader.result, 0.25 / 24);
      };
      reader.readAsDataURL(event[0]);
      this.img = URL.createObjectURL(event[0]);

      const SECTION_PREVIEW =
        this.localStorageSvc.getItem<seatPosInterface[]>('seats');
      const SIZE_SEAT = this.localStorageSvc.getItem<number>('sizeSeat');

      if (SECTION_PREVIEW || SIZE_SEAT) {
        const WARNING = await Swal.fire({
          title: '¿Quieres cargar los datos temporales?',
          text: 'Se perderán si no se guardan',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
        });
        if (WARNING.isConfirmed) {
          this.matSnack.open('Datos temporales cargados', 'Ok', {
            duration: 2000,
          });
          if (SECTION_PREVIEW) this.seats = SECTION_PREVIEW;
          else this.getFromDBSeat();
          if (SIZE_SEAT) this.form.get('sizeSeat')!.setValue(SIZE_SEAT);
          else this.getFromDBSize();
        } else {
          this.getFromDBSeat();
          this.getFromDBSize();
        }
      } else {
        this.localStorageSvc.removeItem('seats');
        this.localStorageSvc.removeItem('imgBackPlane');
        this.localStorageSvc.removeItem('sizeSeat');

        this.getFromDBSeat();
        this.getFromDBSize();
      }
    }
    if (this.timeOutSize) clearTimeout(this.timeOutSize);
    this.timeOutSize = setTimeout(() => {
      this.resizeSeat();
      this.resizePlane();
      this.reMakeCanvas();
    }, 2);
  }

  getFromDBSeat() {
    this.seatsSvc
      .get({ query: { AvionId: this.idPlane }, all: true })
      .subscribe((res) => {
        this.matSnack.open('Datos de la ultima actualización cargados', 'Ok', {
          duration: 2000,
        });
        this.seats = res.items.map((seat) => {
          const [x, y] = seat.posicion.split('|').map(Number);
          console.log(seat);
          return { position: { x, y }, clase: seat.clase };
        });
      });
  }
  getFromDBSize() {
    this.avionSvc
      .get({
        query: {
          id: this.idPlane,
        },
        all: true,
      })
      .subscribe((res) => {
        if (res.items.length == 0) return;
        this.form.get('sizeSeat')!.setValue(res.items[0].tamAsientoPorc);
        this.modifyTam();
      });
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
    this.seats.push({
      position: this.setPosition(event),
      clase: this.secCurrent!,
    });
    this.localStorageSvc.setItem('seats', this.seats, 0.25 / 24);
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
    this.localStorageSvc.setItem('seats', this.seats, 0.25 / 24);
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

  addSection(item: catalogueInterface) {
    this.formSect.patchValue('');

    if (this.sectionsSelected.some((el) => el.id === item.id)) {
      Swal.fire('Error', 'La sección ya esta en la lista', 'error');
      return;
    }
    this.sectionsSelected.push(item);
  }

  makeColSec(index: number) {
    const COL = 360 / this.sectionsSelected.length;
    return `hsl(${COL * index},100%,50%)`;
  }

  async quitSection(item: catalogueInterface) {
    const QUESTION = await Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Quieres eliminar la sección ${item.nombre}?. Se eliminaran todos los asientos que tenga esta sección`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (QUESTION.isConfirmed) {
      this.sectionsSelected = this.sectionsSelected.filter(
        (el) => el.id !== item.id
      );
      if (this.sectionsSelected.length == 0) {
        this.secCurrent = undefined;
        this.opt.set('navigation');
      }
      this.seats = this.seats.filter((el) => el.clase.id !== item.id);
    }
  }
}
