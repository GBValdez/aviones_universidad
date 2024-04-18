import { DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SectionsSvcService } from '@section/services/sections-svc.service';
import { catalogueInterface } from '@utils/commons.interface';
import { ListMakerListComponent } from '@utils/components/list-maker-list/list-maker-list.component';

@Component({
  selector: 'app-section-selection-menu',
  standalone: true,
  imports: [DialogModule, ListMakerListComponent, MatCardModule],
  templateUrl: './section-selection-menu.component.html',
  styleUrl: './section-selection-menu.component.scss',
})
export class SectionSelectionMenuComponent implements OnInit {
  constructor(private sectionSvc: SectionsSvcService) {}
  ngOnInit(): void {
    this.sectionSvc.get().subscribe((res) => {
      this.sectionsList = res.items;
    });
  }
  sectionsList: catalogueInterface[] = [];
}
