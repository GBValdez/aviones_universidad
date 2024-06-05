import { countryDto } from '@country/interfaces/pais.interface';

export interface aeropuertoDto {
  id: number;
  iata: string;
  oaci: string;
  nombre: string;
  ciudad: string;
  localidad: string;
  zonaHoraria: string;
  latitud: string;
  longitud: string;
  telefono: string;
  email: string;
  activo: boolean;
  interno: boolean;
  pais: countryDto;
}

export interface aeropuertoCreationDto {
  iata: string;
  oaci: string;
  nombre: string;
  ciudad: string;
  localidad: string;
  zonaHoraria: string;
  latitud: string;
  longitud: string;
  telefono: string;
  email: string;
  activo: boolean;
  interno: boolean;
  paisId: number;
}
