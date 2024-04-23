import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleRegistrationComponent } from './handle-registration.component';

describe('HandleRegistrationComponent', () => {
  let component: HandleRegistrationComponent;
  let fixture: ComponentFixture<HandleRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandleRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
