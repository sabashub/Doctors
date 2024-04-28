import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { Doctor } from '../../models/Doctor';
import { DoctorCalendarComponent } from '../../components/doctor-calendar/doctor-calendar.component';
//import { CalendarComponent } from '../../components/calendar/calendar.component';
import { CategoryComponent } from '../../components/category/category.component';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [DoctorCalendarComponent, CategoryComponent, ],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.css'
})
export class DoctorDetailsComponent implements OnInit{
  doctorId: string = '';
  doctor: Doctor | null = null;
  doctorNumId: number = 0

  constructor(private route: ActivatedRoute, private appService: AppService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = params['id'];
      this.doctorNumId = parseInt(params['id'], 10);
      this.fetchDoctorDetails(this.doctorId);
      
    });
  }
  fetchDoctorDetails(doctorId: string): void {
    this.appService.getDoctorById(doctorId).subscribe(
      (doctor: Doctor) => {
        this.doctor = doctor;
        console.log('Doctor:', this.doctor);
      },
      (error) => {
        console.error('Error fetching doctor details:', error);
      }
    );
  }
}
