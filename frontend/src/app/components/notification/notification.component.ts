import { Component } from '@angular/core';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  isSuccess: boolean = true;
  title: string = '';
  message: string = '';

  constructor () {}

}
