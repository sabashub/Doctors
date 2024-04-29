import { Component, NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { RouterModule,  } from '@angular/router';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterDoctorComponent } from './pages/register-doctor/register-doctor.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { DoctorPageComponent } from './pages/doctor-page/doctor-page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DoctorDetailsComponent } from './pages/doctor-details/doctor-details.component';
export const routes: Routes = [
  
  {path: 'doctors', component: MainPageComponent },
  {path: '', component: MainPageComponent },
  {path: 'registration', component: RegistrationComponent },
  {path: 'register-doctor', component: RegisterDoctorComponent},
  {path: 'login', component: LoginComponent},
  {path: 'user', component: UserPageComponent},
  {path: 'doctor', component: DoctorPageComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'doctor/:id', component: DoctorDetailsComponent },
  {path: '**', redirectTo: '/' }
  
 
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

  export class AppRoutingModule { }