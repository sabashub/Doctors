import { Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AppService } from '../../app.service';
import { LoginComponent } from '../../pages/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/User';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatTabsModule, CommonModule, MatButtonModule, MatToolbarModule, RouterLink ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit{

  links = [{url:'doctors', label:'ექიმები'}, {url: 'register-doctor', label: 'კლინიკები'}, {url: 'Third', label: 'ანოტაციები'},{url: 'Third', label: 'აქციები'},{url: 'Third', label: 'სერვისები'},{url: 'Third', label: 'მედიკამენტები'},{url: 'Third', label: 'კონტაქტი'},];
  activeLink = this.links[0];
  user: User | null = null
  logoUrl: string = '';
  name : string = '';
  routerLink: string = ''
  
  constructor(public appService:  AppService, public dialog: MatDialog, private router: Router) { } 


  ngOnInit(): void {
    this.selectLogoAndName()
  }

  openLoginDialog(){
    this.dialog.open(LoginComponent, {width: '500px', height: '350px'});
  }
  logout(){
    this.appService.logout();
  }


  selectLogoAndName(){
    this.appService.user$.subscribe(user => {
      this.user = user;
      if(this.user?.type === 'User'){
        this.logoUrl = "../../../assets/UserLogo.png"
        this.name = `${this.user?.firstName} ${this.user?.lastName}`
        this.routerLink = '/user'; 
        
      }
      if(this.user?.type === 'Doctor'){
        this.logoUrl = this.user?.imageUrl
        this.name = `${this.user?.firstName} ${this.user?.lastName}`
        this.routerLink = '/doctor';
      }
     
      if(this.user?.type === 'Admin'){
        this.name = 'ადმინისტრატორი'
        this.routerLink = '/admin';
      }
        
   
    });
    
  }

 
}


