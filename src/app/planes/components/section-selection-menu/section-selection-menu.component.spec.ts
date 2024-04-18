import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSelectionMenuComponent } from './section-selection-menu.component';

describe('SectionSelectionMenuComponent', () => {
  let component: SectionSelectionMenuComponent;
  let fixture: ComponentFixture<SectionSelectionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionSelectionMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SectionSelectionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
