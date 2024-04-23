import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleCategoriesComponent } from './handle-categories.component';

describe('HandleCategoriesComponent', () => {
  let component: HandleCategoriesComponent;
  let fixture: ComponentFixture<HandleCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandleCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
