import { avionDto } from '@plane/interfaces/avion.interface';
import { aeropuertoDto } from '../../airport/interface/aeropuerto.interface';
import { catalogueInterface } from '@utils/commons.interface';

export interface vueloDto {
  id: number;
  codigo: string;
  fechaSalida: Date;
  fechaLlegada: Date;
  aeropuertoDestino: aeropuertoDto;
  aeropuertoOrigen: aeropuertoDto;
  avion: avionDto;
  vueloClases: vueloClaseDto[];
}

export interface vueloDtoCreation {
  codigo: string;
  fechaSalida: Date;
  fechaLlegada: Date;
  avionId: number;
  aeropuertoOrigenId: number;
  aeropuertoDestinoId: number;
  vueloClases: VueloClaseCreationDto[];
}
export interface vueloClaseDto {
  id: number;
  clase: catalogueInterface;
  cantidadMaletasMax: number;
  precio: number;
}

export interface VueloClaseCreationDto {
  claseId: number;
  precio: number;
}
export interface selectVueloDto {
  VueloId: number;
  AsientoId: number;
}
