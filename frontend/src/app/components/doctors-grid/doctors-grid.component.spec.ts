import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsGridComponent } from './doctors-grid.component';

describe('DoctorsGridComponent', () => {
  let component: DoctorsGridComponent;
  let fixture: ComponentFixture<DoctorsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
