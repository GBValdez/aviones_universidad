import { catalogueInterface } from '@utils/commons.interface';
import { seatDto } from './seats.interface';

export interface avionBaseDto {
  year: string;
  serie: string;
  capacidadCarga: number;
  capacidadPasajeros: number;
  capacidadCombustible: number;
  tamAsientoPorc: number;
}

export interface avionDto extends avionBaseDto {
  id: number;
  //   aerolinea: Aerolinea;
  estado: catalogueInterface;
  marca: catalogueInterface;
  modelo: catalogueInterface;
  tipoAvion: catalogueInterface;
  //   vuelos: Vuelo[];
  asientos: seatDto[];
}

export interface avionCreationDto extends avionBaseDto {
  MarcaId: number;
  AerolineaId: number;
  ModeloId: number;
  TipoAvionId: number;
  EstadoId: number;
}
