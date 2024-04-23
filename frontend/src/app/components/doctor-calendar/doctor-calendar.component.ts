import { Component } from '@angular/core';
import { Appointment } from '../calendar/calendar.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../app.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-doctor-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-calendar.component.html',
  styleUrl: './doctor-calendar.component.css'
})
export class DoctorCalendarComponent {
  
}
