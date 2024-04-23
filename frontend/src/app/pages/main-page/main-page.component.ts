import { Component } from '@angular/core';
import { DoctorCardComponent } from '../../components/doctor-card/doctor-card.component';
import { CategoryComponent } from '../../components/category/category.component';
import { DoctorsComponent } from '../doctors/doctors.component';
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [DoctorsComponent, CategoryComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
