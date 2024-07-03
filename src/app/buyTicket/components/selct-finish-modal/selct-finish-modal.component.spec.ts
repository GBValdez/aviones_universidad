import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelctFinishModalComponent } from './selct-finish-modal.component';

describe('SelctFinishModalComponent', () => {
  let component: SelctFinishModalComponent;
  let fixture: ComponentFixture<SelctFinishModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelctFinishModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelctFinishModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
