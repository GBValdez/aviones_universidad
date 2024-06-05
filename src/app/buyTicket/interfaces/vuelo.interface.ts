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
}

export interface vueloDtoCreation {
  codigo: string;
  fechaSalida: Date;
  fechaLlegada: Date;
  avionId: number;
  aeropuertoOrigenId: number;
  aeropuertoDestinoId: number;
  vueloClases: VueloClase[];
}

export interface VueloClase {
  claseId: number;
  vueloId: number;
  precio: number;
}
export interface selectVueloDto {
  VueloId: number;
  AsientoId: number;
}
