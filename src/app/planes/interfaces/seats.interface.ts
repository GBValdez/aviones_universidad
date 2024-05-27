import { catalogueInterface } from '@utils/commons.interface';

export interface seatBaseDto {
  codigo: string;
  posicion: string;
}

export interface seatCreationDto extends seatBaseDto {
  ClaseId: number;
  AvionId?: number;
}

export interface seatPlaneCreation {
  asientos: seatCreationDto[];
  sizeSeat: number;
}

export interface seatDto extends seatBaseDto {
  id: number;
  clase: catalogueInterface;
}
