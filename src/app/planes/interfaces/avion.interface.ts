import { catalogueInterface } from '@utils/commons.interface';
import { seatDto } from './seats.interface';
import { crewDto } from '@crew/pages/crew/interface/crew.interface';

export interface avionBaseDto {
  codigo: string;
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
  tripulaciones: crewDto[];
}

export interface avionCreationDto extends avionBaseDto {
  MarcaId: number;
  AerolineaId: number;
  ModeloId: number;
  TipoAvionId: number;
  EstadoId: number;
}
