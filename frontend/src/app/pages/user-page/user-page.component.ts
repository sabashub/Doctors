import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from '../../components/category/category.component';
import { User } from '../../models/User';
//import { CalendarComponent } from '../../components/calendar/calendar.component';
import { UserCalendarComponent } from '../../components/user-calendar/user-calendar.component';
import { ForgetPasswordComponent } from '../../components/forget-password/forget-password.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, CategoryComponent, UserCalendarComponent, FormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  user: User | null = null;
  passwordResetEmail: string = ''; // Variable to hold the email for password reset

  constructor(private appService: AppService, private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.appService.user$.subscribe(user => {
      this.user = user;
    });
  }

  openForgetPasswordDialog(): void {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, {
      width: '400px', height: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
  


