import { catalogueInterface } from '@utils/commons.interface';

export interface seatBaseDto {
  Codigo: string;
  Posicion: string;
}

export interface seatCreationDto extends seatBaseDto {
  ClaseId: number;
  AvionId: number;
}

export interface seatDto extends seatBaseDto {
  Id: number;
  Clase: catalogueInterface;
}
