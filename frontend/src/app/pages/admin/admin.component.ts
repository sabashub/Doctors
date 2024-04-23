import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsGridComponent } from '../../components/doctors-grid/doctors-grid.component';
import { HandleCategoriesComponent } from '../../components/handle-categories/handle-categories.component';
import { HandleRegistrationComponent } from '../../components/handle-registration/handle-registration.component';
import { Doctor } from '../../models/Doctor';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, DoctorsGridComponent, HandleCategoriesComponent, HandleRegistrationComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  showDoctorsGrid = false;
  showCategoriesGrid = false;
  showRegistration = false;
  activeButton: number = 0;
  selectedDoctor: Doctor | null = null;

  showGrid(gridNumber: number, buttonIndex: number): void {
    this.activeButton = buttonIndex;
    this.showRegistration = gridNumber === 1;
    this.showCategoriesGrid = gridNumber === 2;
    this.showDoctorsGrid = gridNumber === 3;
  }

  
}
