import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvionFormComponent } from './avion-form.component';

describe('AvionFormComponent', () => {
  let component: AvionFormComponent;
  let fixture: ComponentFixture<AvionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
