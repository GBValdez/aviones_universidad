import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueloHomeComponent } from './vuelo-home.component';

describe('VueloHomeComponent', () => {
  let component: VueloHomeComponent;
  let fixture: ComponentFixture<VueloHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VueloHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VueloHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
