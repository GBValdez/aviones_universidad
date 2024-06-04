import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvionHomeComponent } from './avion-home.component';

describe('AvionHomeComponent', () => {
  let component: AvionHomeComponent;
  let fixture: ComponentFixture<AvionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvionHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
