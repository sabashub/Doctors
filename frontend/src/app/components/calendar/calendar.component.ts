// import { Component } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatIconModule } from '@angular/material/icon';
// import { DialogComponent } from '../dialog/dialog.component';
// import { HttpClient } from '@angular/common/http';
// import { AppService } from '../../app.service';
// import { CommonModule } from '@angular/common';

// export interface Appointment {
//   date: Date;
//   problem: string;
//   userId: string;
//   doctorId: number;
// }

// @Component({
//   selector: 'app-calendar',
//   templateUrl: './calendar.component.html',
//   standalone: true,
//   imports: [CommonModule, MatIconModule],
//   styleUrls: ['./calendar.component.css']
// })
// export class CalendarComponent {
//   currentMonth: string = '';
//   currentYear: number = 2024;
//   currentDay: number = 1;
//   weekDays: string[] = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];
//   hours: number[] = Array.from({ length: 9 }, (_, i) => i + 9); // Hours from 9:00 to 17:00
//   appointments: Appointment[] = [];
//   backgroundColor: string = ''
//   showDialog = false;

//   constructor(public dialog: MatDialog, private http: HttpClient, private appService: AppService  ) {
//     const currentDate = new Date();
//     this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
//     this.currentYear = currentDate.getFullYear();
//     this.currentDay = currentDate.getDate();
    
//   }
//   getBackgroundColor(day: string): string {
//     if (day === 'შაბ' || day === 'კვი') {
//       return 'rgb(248, 248, 235)';
//     } else {
//       return '#ffffff';
//     }
//   }

//   scheduleAppointment(hour: number, day: number, problem: string) {
//     const selectedDate = new Date(this.currentYear, this.getMonthNumber(this.currentMonth), day, hour);
//     if (!isNaN(selectedDate.getTime())) {
//       const appointmentsForHour = this.appointments.filter(appointment => {
//         const appointmentDate = new Date(appointment.date);
//         return appointmentDate.getHours() === hour && appointmentDate.getDate() === day;
//       });
  
//       if (appointmentsForHour.length < 3) {
//         const appointment: Appointment = { date: selectedDate, problem: problem };
//         this.appointments.push(appointment);
//         console.log(`New appointment added: ${selectedDate}`);
//       } else {
//         console.error('Maximum appointments reached for this hour');
        
//       }
//     } else {
//       console.error('Invalid Date');
//     }
//   }
  
  
//   openDialog(hour: number, day: number): void {
//     this.showDialog = true; // Set flag to true to indicate that dialog should be shown

//     // Subscribe to the user$ observable to get the current user object
//     this.appService.user$.subscribe(user => {
//       if (this.showDialog && user && user.type === 'User') {
//         const dialogRef = this.dialog.open(DialogComponent, {
//           width: '400px',
//           data: { problem: '' } // Initialize with an empty string or any default value
//         });

//         dialogRef.afterClosed().subscribe(result => {
//           if (result && result.problem.trim() !== '') {
//             this.scheduleAppointment(hour, day, result.problem);
//           }
//         });
//       } else {
//         console.error('User is not authorized to book appointments');
//       }
//       // Reset the flag after processing
//       this.showDialog = false;
//     });
//   }
  
  
//   isAppointmentScheduled(day: number, hour: number): boolean {
//     const selectedDate = new Date(this.currentYear, this.getMonthNumber(this.currentMonth), day, hour);
//     return this.appointments.some(appointment => appointment.date.getTime() === selectedDate.getTime());
//   }

//   getMonthNumber(month: string): number {
//     const months: { [month: string]: number } = {
//       'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
//       'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
//     };
//     return months[month];
//   }

//   nextWeek() {
//     this.currentDay += 7;
//     if (this.currentDay > this.getDaysInMonth(this.currentMonth, this.currentYear)) {
      
//       const daysInCurrentMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
//       const remainingDays = this.currentDay - daysInCurrentMonth;
//       const nextMonthIndex = this.getMonthNumber(this.currentMonth) + 1;
//       if (nextMonthIndex > 11) {
       
//         this.currentYear++;
//         this.currentMonth = 'January';
//       } else {
       
//         this.currentMonth = Object.keys(this.getMonths())[nextMonthIndex];
//       }
//       this.currentDay = remainingDays;
//     }
//   }

//   prevWeek() {
//     this.currentDay -= 7;
//     if (this.currentDay < 1) {
 
//       const prevMonthIndex = this.getMonthNumber(this.currentMonth) - 1;
//       if (prevMonthIndex < 0) {
        
//         this.currentYear--;
//         this.currentMonth = 'December';
//       } else {
        
//         this.currentMonth = Object.keys(this.getMonths())[prevMonthIndex];
//       }
//       const prevMonthDays = this.getDaysInMonth(this.currentMonth, this.currentYear);
//       this.currentDay += prevMonthDays;
//     }
//   }

//   getDaysInMonth(month: string, year: number): number {
//     return new Date(year, this.getMonthNumber(month) + 1, 0).getDate();
//   }

//   getMonths(): { [month: string]: number } {
//     return {
//       'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
//       'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
//     };
//   }
  
//   getDayIndex(day: string): number {
//     const index = this.weekDays.indexOf(day);
//     return index === -1 ? 0 : index;
//   }
//   isMaxAppointmentsReached(day: number, hour: number): boolean {
//     const appointmentsForHour = this.appointments.filter(appointment => {
//       const appointmentDate = new Date(appointment.date);
//       return appointmentDate.getHours() === hour && appointmentDate.getDate() === day;
//     });
  
//     return appointmentsForHour.length >= 3;
//   }
// }