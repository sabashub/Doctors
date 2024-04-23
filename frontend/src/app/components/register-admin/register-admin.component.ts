import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent implements OnInit{
  admin = {
    email: '',
    password: ''
  };
  admins: any[] = [];


  constructor(private appService: AppService) {}
  ngOnInit(): void {
    this.getAllAdmins();
  }
  onSubmit(): void {
    this.appService.registerAdmin(this.admin)
      .subscribe(
        response => {
          console.log('Admin registered successfully');
          this.admin = { email: '', password: '' }; 
        },
        error => {
          console.log('Error registering admin:', error);
          // Handle error (e.g., show error message)
        }
      );
  }
  getAllAdmins(): void {
    this.appService.getAllAdmins()
      .subscribe(
        admins => {
          this.admins = admins;
        },
        error => {
          console.log('Error fetching admins:', error);
          // Handle error (e.g., show error message)
        }
      );
  }

  deleteAdmin(id: number): void {
    const confirmDelete = confirm("Are you sure you want to delete this admin?");
    if (confirmDelete) {
      this.appService.deleteAdmin(id)
        .subscribe(
          response => {
            console.log(`Admin with ID ${id} deleted successfully`);
            this.getAllAdmins(); // Refresh the admin list after deletion
          },
          error => {
            console.log(`Error deleting admin with ID ${id}:`, error);
            // Handle error (e.g., show error message)
          }
        );
    }
  }
  editAdmin(adminId: number): void {
    const propertyToEdit = prompt('Which property do you want to edit? (email or password)');
    if (propertyToEdit === 'email') {
      const newEmail = prompt(`Enter the new email`);
      if (newEmail !== null) {
        this.appService.editAdminEmail(adminId, newEmail).subscribe(
          response => {
            console.log(`Admin email updated successfully`);
            this.getAllAdmins(); // Refresh admin list
          },
          error => {
            console.log(`Error updating email for admin`, error);
            // Handle error
          }
        );
      }
    } else if (propertyToEdit === 'password') {
      const newPassword = prompt(`Enter the new password`);
      if (newPassword !== null) {
        this.appService.editAdminPassword(adminId, newPassword).subscribe(
          response => {
            console.log(`Admin password updated successfully`);
            this.getAllAdmins(); // Refresh admin list
          },
          error => {
            console.log(`Error updating password for admin`, error);
            // Handle error
          }
        );
      }
    } else {
      alert('Invalid property choice. Please choose email or password.');
    }
  }
  

}
