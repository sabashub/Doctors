import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/Doctor';
import { AppService } from '../../app.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { DoctorCalendarComponent } from '../doctor-calendar/doctor-calendar.component';
@Component({
  selector: 'app-doctors-grid',
  standalone: true,
  imports: [CommonModule, DoctorCalendarComponent],
  templateUrl: './doctors-grid.component.html',
  styleUrl: './doctors-grid.component.css'
})
export class DoctorsGridComponent implements OnInit{
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  doctorId: any = 0
  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.fetchDoctors();
    
  }

  fetchDoctors(): void {
    this.appService.getDoctors().subscribe(
      (doctors: Doctor[]) => {
        this.doctors = doctors;
        
        console.log('Doctors:', this.doctors);
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
    
  }

  editDoctor(doctor: Doctor): void {
    // Implement edit functionality
  }

 
    deleteDoctor(doctor: Doctor): void {
      if (confirm('Are you sure you want to delete this doctor?')) {
        this.appService.deleteDoctorById(doctor.id).subscribe(
          () => {
            // Filter out the deleted doctor from the local array
            this.doctors = this.doctors.filter(d => d.id !== doctor.id);
            console.log('Doctor deleted successfully');
          },
          (error) => {
            console.error('Error deleting doctor:', error);
          }
        );
      }
    }
  
    showDoctorDetails(doctor: Doctor): void {
      this.selectedDoctor = doctor;
      this.doctorId = this.selectedDoctor.id
    }

    hideDoctorDetails(): void {
      this.selectedDoctor = null;
    }
    
  
  
}
