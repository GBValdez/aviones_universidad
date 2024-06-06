import { Component } from '@angular/core';
import { CrewService } from './services/crew.service';
import { MatDialog } from '@angular/material/dialog';
import { crewDto } from './interface/crew.interface';
import Swal from 'sweetalert2';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CrewFormComponent } from './components/crew-form/crew-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-crew',
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
  templateUrl: './crew.component.html',
  styleUrl: './crew.component.scss',
})
export class CrewComponent {
  constructor(private dataSvc: CrewService, private dialog: MatDialog) {}
  data: crewDto[] = [];
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
  async deleteItem(catalogue: crewDto) {
    const result = await Swal.fire({
      title: '¿Estas seguro de eliminar este registro?',
      text: `Eliminar la tripulacion:  ${catalogue.codigo}`,
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

  openForm(item?: crewDto) {
    this.dialog
      .open(CrewFormComponent, {
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
