import { Component } from '@angular/core';
import { DoctorCardComponent } from '../../components/doctor-card/doctor-card.component';
import { AppService } from '../../app.service';
import { Doctor } from '../../models/Doctor';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [DoctorCardComponent,CommonModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent {
  doctors: Doctor[] = [];
  constructor(private appService: AppService, private router: Router){}
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
  getImageUrl(imageName: string): string {
   
    return `/images/${imageName}`; 
  }
  viewDoctorDetails(doctorId: number): void {
    this.router.navigate(['/doctor', doctorId.toString()]);
  }
}
