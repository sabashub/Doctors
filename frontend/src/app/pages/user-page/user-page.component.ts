import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from '../../components/category/category.component';
import { User } from '../../models/User';
//import { CalendarComponent } from '../../components/calendar/calendar.component';
import { UserCalendarComponent } from '../../components/user-calendar/user-calendar.component';
@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, CategoryComponent, UserCalendarComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  message: string | undefined;
  user: User | null = null;
  
  constructor(private appService: AppService, ) { }
  ngOnInit(): void {
    this.appService.user$.subscribe(user => {
      this.user = user;
      console.log('User:', this.user);
    });
    
    }
  }


