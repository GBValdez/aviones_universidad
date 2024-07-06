import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFliesComponent } from './my-flies.component';

describe('MyFliesComponent', () => {
  let component: MyFliesComponent;
  let fixture: ComponentFixture<MyFliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFliesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyFliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
