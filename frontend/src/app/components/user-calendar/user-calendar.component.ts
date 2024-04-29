import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-calendar.component.html',
  styleUrl: './user-calendar.component.css'
})
export class UserCalendarComponent implements OnInit{
  currentMonth: string = '';
  currentYear: number = 2024;
  currentDay: number = 1;
  weekDays: string[] = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];
  hours: number[] = Array.from({ length: 9 }, (_, i) => i + 9); // Hours from 9:00 to 17:00
  appointments: any[] = [];
  backgroundColor: string = ''
  showDialog = false;
  user: any = null;
  userId: any = null;
  selectedAppointment: any | null = null;

  constructor( private http: HttpClient, private appService: AppService  ) {
    const currentDate = new Date();
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = currentDate.getFullYear();
    this.currentDay = currentDate.getDate();
    
  }
  ngOnInit(): void {
   
    this.getUser();
    

  }
  
  getBackgroundColor(day: string): string {
    if (day === 'შაბ' || day === 'კვი') {
      return 'rgb(248, 248, 235)';
    } else {
      return '#ffffff';
    }
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
  
  
  getUser(){
    this.appService.user$.subscribe(user => {
      this.user = user;
      console.log('User:', this.user);
      this.userId = user?.id
    });
    console.log('UserId:', this.userId);
    this.getAppointmentsByUserId(this.userId)
  }
  getAppointmentsByUserId(userId: any): void {
    const apiUrl = `http://localhost:5005/api/Appointment/getByUserId/${userId}`;
    
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.appointments = response.map(appointment => ({
          ...appointment,
          date: new Date(appointment.date)
        }));
        console.log('Appointments:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
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
  openActionMenu(day: number, hour: number) {
    // Find the selected appointment
    this.selectedAppointment = this.appointments.find(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getDate() === day && appointmentDate.getHours() === hour;
    });
  }

  // Method to delete the selected appointment
  deleteAppointment() {
    if (this.selectedAppointment) {
      const confirmation = confirm('Are you sure you want to delete this appointment?');
      if (confirmation) {
        const apiUrl = `http://localhost:5005/api/Appointment/delete/${this.selectedAppointment.id}`;
        this.http.delete(apiUrl).subscribe(
          () => {
            // Remove the appointment from the appointments array
            this.appointments = this.appointments.filter(appointment => appointment.id !== this.selectedAppointment?.id);
            // Reset selectedAppointment
            this.selectedAppointment = null;
          },
          (error) => {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment. Please try again later.');
          }
        );
      }
    }
  }

  // Method to edit the problem of the selected appointment
  editAppointment(): void {
    if (this.selectedAppointment) {
      console.log("selected", this.selectedAppointment)
      const newProblem = window.prompt('Enter the new problem:', this.selectedAppointment.problem);
      if (newProblem !== null) {
        // Create an updated appointment object with only the problem field updated
        const updatedAppointment = {
          id: this.selectedAppointment.id, // Keep the original appointment ID
          problem: newProblem, // Update the problem with the new value
          date: this.selectedAppointment.date,
          userId: this.selectedAppointment.userId,
          doctorId: this.selectedAppointment.doctorId
        };

        console.log("updated", updatedAppointment)
  
        // Make the PUT request to update the appointment's problem
        const apiUrl = `http://localhost:5005/api/Appointment/update/${this.selectedAppointment.id}`;
        this.http.put(apiUrl, updatedAppointment).subscribe(
          () => {
            console.log('Appointment problem updated successfully');
            // Update the problem in the local appointments array
            const index = this.appointments.findIndex(appointment => appointment.id === this.selectedAppointment?.id);
            if (index !== -1) {
              this.appointments[index].problem = newProblem;
            }
          },
          (error) => {
            console.error('Error updating appointment problem:', error);
            // Handle error (e.g., show error message to the user)
          }
        );
      }
    }
  }
}