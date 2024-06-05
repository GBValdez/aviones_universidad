import { countryDto } from '@country/interfaces/pais.interface';

interface airlineDtoBase {
  nombre: string;
  codigo: string;
  direccion: string;
  telefono: string;
  email: string;
}
export interface airlineDto extends airlineDtoBase {
  id: number;
  pais: countryDto;
}

export interface airlineCreationDto extends airlineDtoBase {
  paisId: number;
}
