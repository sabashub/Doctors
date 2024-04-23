import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from '../../pages/registration/registration.component';
import { RegisterDoctorComponent } from '../../pages/register-doctor/register-doctor.component';
import { RegisterAdminComponent } from '../../components/register-admin/register-admin.component';
@Component({
  selector: 'app-handle-registration',
  standalone: true,
  imports: [CommonModule, RegistrationComponent, RegisterDoctorComponent,RegisterAdminComponent],
  templateUrl: './handle-registration.component.html',
  styleUrl: './handle-registration.component.css'
})
export class HandleRegistrationComponent {
  showUserRegistration = false;
  showDoctorRegistration = false;
  showAdminRegistration = false;
  activeButton: number = 0;

  showRegistration(gridNumber: number, buttonIndex: number): void {
    this.activeButton = buttonIndex;
    this.showUserRegistration = gridNumber === 1;
    this.showDoctorRegistration = gridNumber === 2;
    this.showAdminRegistration = gridNumber === 3;
  }
}
