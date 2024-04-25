import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../app.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';
export interface Appointment {
  date: Date;
  problem: string;
  userId: string;
  doctorId: number;
}
@Component({
  selector: 'app-doctor-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-calendar.component.html',
  styleUrl: './doctor-calendar.component.css'
})


export class DoctorCalendarComponent  implements OnInit{
  currentMonth: string = '';
  currentYear: number = 2024;
  currentDay: number = 1;
  weekDays: string[] = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];
  hours: number[] = Array.from({ length: 9 }, (_, i) => i + 9); // Hours from 9:00 to 17:00
  appointments: Appointment[] = [];
  backgroundColor: string = ''
  showDialog = false;
  user: User | null = null;
  doctorId: any = null;

  constructor(public dialog: MatDialog, private http: HttpClient, private appService: AppService  ) {
    const currentDate = new Date();
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = currentDate.getFullYear();
    this.currentDay = currentDate.getDate();
    
  }
  ngOnInit(): void {
    
    this.getAppointmentsByDoctorId()


  }
  getBackgroundColor(day: string): string {
    if (day === 'შაბ' || day === 'კვი') {
      return 'rgb(248, 248, 235)';
    } else {
      return '#ffffff';
    }
  }

  scheduleAppointment(hour: number, day: number, problem: string) {
  //   this.appService.user$.subscribe(user => {
  //     this.user = user;
  //     console.log('User:', this.user);
  //   });
    const url = window.location.href;
  const segments = url.split('/');
  const doctorSegmentIndex = segments.findIndex(segment => segment === 'doctor'); // Find the index of 'doctor' segment
  if (doctorSegmentIndex !== -1 && segments.length > doctorSegmentIndex + 1) {
    const doctorIdString = segments[doctorSegmentIndex + 1]; // Get the segment after 'doctor/'
    this.doctorId = parseInt(doctorIdString, 10); // Parse the segment as integer
  } else {
    console.error('DoctorId not found in the URL');
  }
    const selectedDate = new Date(this.currentYear, this.getMonthNumber(this.currentMonth), day, hour + 4);
    if (!isNaN(selectedDate.getTime())) {
      const appointmentsForHour = this.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getHours() === hour && appointmentDate.getDate() === day;
      });
  
      if (appointmentsForHour.length < 3) {
        console.log(this.user?.id)
        const appointment: Appointment = { date: selectedDate, problem: problem, userId: "28b69834-649f-441b-80f4-e7ca62404144", doctorId: this.doctorId };
        this.http.post('http://localhost:5005/api/Appointment/create', appointment)
          .subscribe(
            (response) => {
              console.log('Appointment created successfully:', response);

              this.getAppointmentsByDoctorId()
              console.log(this.appointments)
              // You may want to update the UI or perform other actions upon successful creation
            },
            (error) => {
              console.error('Error creating appointment:', error);
              // Handle errors, e.g., show error message to the user
            }
          );
      } else {
        console.error('Maximum appointments reached for this hour');
        // Handle maximum appointments reached scenario
      }
    } else {
      console.error('Invalid Date');
      // Handle invalid date scenario
    }
  }
  getAppointmentsByDoctorId(): void {
    // Replace '1' with the actual doctor ID you want to fetch appointments for
    const doctorId = 1;
    const apiUrl = `http://localhost:5005/api/Appointment/getByDoctorId/${doctorId}`;
    
    this.http.get<Appointment[]>(apiUrl).subscribe(
      (response) => {
        // Parse date strings into Date objects
        this.appointments = response.map(appointment => ({
          ...appointment,
          date: new Date(appointment.date)
        }));
        console.log('Appointments:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
        // Handle errors, e.g., show error message to the user
      }
    );
  }
  
  
  openDialog(hour: number, day: number): void {
    this.showDialog = true; // Set flag to true to indicate that dialog should be shown

    // Subscribe to the user$ observable to get the current user object
    this.appService.user$.subscribe(user => {
      if (this.showDialog && user && user.type === 'User') {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '400px',
          data: { problem: '' } // Initialize with an empty string or any default value
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.problem.trim() !== '') {
            this.scheduleAppointment(hour, day, result.problem);
          }
        });
      } else {
        console.error('User is not authorized to book appointments');
      }
      // Reset the flag after processing
      this.showDialog = false;
    });
  }
  
  
  isAppointmentScheduled(day: number, hour: number): boolean {
    const selectedDate = new Date(this.currentYear, this.getMonthNumber(this.currentMonth), day, hour);
    return this.appointments.some(appointment => appointment.date.getTime() === selectedDate.getTime());
  }

  getMonthNumber(month: string): number {
    const months: { [month: string]: number } = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    return months[month];
  }

  nextWeek() {
    this.currentDay += 7;
    if (this.currentDay > this.getDaysInMonth(this.currentMonth, this.currentYear)) {
      
      const daysInCurrentMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
      const remainingDays = this.currentDay - daysInCurrentMonth;
      const nextMonthIndex = this.getMonthNumber(this.currentMonth) + 1;
      if (nextMonthIndex > 11) {
       
        this.currentYear++;
        this.currentMonth = 'January';
      } else {
       
        this.currentMonth = Object.keys(this.getMonths())[nextMonthIndex];
      }
      this.currentDay = remainingDays;
    }
  }

  prevWeek() {
    this.currentDay -= 7;
    if (this.currentDay < 1) {
 
      const prevMonthIndex = this.getMonthNumber(this.currentMonth) - 1;
      if (prevMonthIndex < 0) {
        
        this.currentYear--;
        this.currentMonth = 'December';
      } else {
        
        this.currentMonth = Object.keys(this.getMonths())[prevMonthIndex];
      }
      const prevMonthDays = this.getDaysInMonth(this.currentMonth, this.currentYear);
      this.currentDay += prevMonthDays;
    }
  }

  getDaysInMonth(month: string, year: number): number {
    return new Date(year, this.getMonthNumber(month) + 1, 0).getDate();
  }

  getMonths(): { [month: string]: number } {
    return {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
  }
  
  getDayIndex(day: string): number {
    const index = this.weekDays.indexOf(day);
    return index === -1 ? 0 : index;
  }
  isMaxAppointmentsReached(day: number, hour: number): boolean {
    const appointmentsForHour = this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getHours() === hour && appointmentDate.getDate() === day;
    });
  
    return appointmentsForHour.length >= 3;
  }
}
