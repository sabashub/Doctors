import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { User } from '../../models/User';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle, MatFormFieldModule, MatInputModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  constructor( private appService:  AppService, private formBuilder: FormBuilder, 
    private router: Router, private activatedRoute: ActivatedRoute, public dialogRef: MatDialogRef<LoginComponent>, public dialog: MatDialog) {
   this.appService.user$.pipe(take(1)).subscribe({
    next: (user: User | null) => {
      if(user){
        this.router.navigateByUrl('/');
    }
  }
   })

}
    
  ngOnInit(): void {
    this.initialiseForm();
  }
  initialiseForm(){
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }



  async login() {
    this.submitted = true;
    this.errorMessages = [];
  
    if (this.loginForm.valid) {
      try {
        await this.appService.login(this.loginForm.value);
        const user = await firstValueFrom(this.appService.user$);
        
        if (user && user.Type === 'User') {
          this.router.navigateByUrl('/user');
        } else if (user && user.Type === 'Doctor') {
          // Navigate to doctor page
        }
        
        // Close the dialog regardless of user type
        this.dialogRef.close();
      } catch (error) {
        
          this.errorMessages.push('Invalid email or password');
        
      }
    }
  }

}
