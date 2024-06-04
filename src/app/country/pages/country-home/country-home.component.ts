import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { CatalogueFormComponent } from '@catalogues/catalogue-form/catalogue-form.component';
import { CatalogueService } from '@catalogues/services/catalogue.service';
import { countryDto } from '@country/interfaces/pais.interface';
import { CountryService } from '@country/services/country.service';
import { catalogueInterface, catalogueModal } from '@utils/commons.interface';
import Swal from 'sweetalert2';
import { CountryFormComponent } from '../country-form/country-form.component';

@Component({
  selector: 'app-country-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './country-home.component.html',
  styleUrl: './country-home.component.scss',
})
export class CountryHomeComponent {
  constructor(private dataSvc: CountryService, private dialog: MatDialog) {}
  data: countryDto[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  dataSize: number = 0;

  ngOnInit(): void {
    this.getData(this.pageNumber, this.pageSize);
  }

  getData(pageNumber: number, pageSize: number) {
    this.dataSvc
      .get({
        pageNumber: pageNumber + 1,
        pageSize,
      })
      .subscribe((res) => {
        if (res.total > 0) {
          this.data = res.items;
          this.dataSize = res.total;
        } else {
          this.data = [];
          this.dataSize = 0;
          Swal.fire('No se encontraron registros', '', 'info');
        }
      });
  }

  changePagination(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getData(this.pageNumber, this.pageSize);
  }
  async deleteItem(catalogue: countryDto) {
    const result = await Swal.fire({
      title: '¿Estas seguro de eliminar este registro?',
      text: `Eliminar ${catalogue.nombre}`,
      icon: 'warning',
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      this.dataSvc.delete(catalogue.id!).subscribe(async () => {
        await Swal.fire('Eliminado', 'Registro eliminado', 'success');
        this.pageNumber = 0;
        this.getData(this.pageNumber, this.pageSize);
      });
    }
  }

  openForm(item?: countryDto) {
    this.dialog
      .open(CountryFormComponent, {
        width: '60%',
        minWidth: '280px',
        data: item,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res?.modify) {
          this.getData(this.pageNumber, this.pageSize);
        }
      });
  }
}
