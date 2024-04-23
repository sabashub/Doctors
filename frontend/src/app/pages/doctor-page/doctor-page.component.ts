import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { CategoryComponent } from '../../components/category/category.component';
import { AppService } from '../../app.service';
import { Doctor } from '../../models/Doctor';
import { User } from '../../models/User';
@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [CalendarComponent, CategoryComponent],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.css'
})
export class DoctorPageComponent implements OnInit{
  doctor: User | null = null;
    constructor(private appService: AppService) { }
    ngOnInit(): void {
      this.appService.user$.subscribe(doctor => {
        this.doctor = doctor;
        console.log('User:', this.doctor);
      });
      
      }
  }



