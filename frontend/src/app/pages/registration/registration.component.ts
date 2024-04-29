import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, FormBuilder } from '@angular/forms';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { User } from '../../models/User';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{

  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];




  constructor( private appService:  AppService, private router: Router,
    private formBuilder: FormBuilder,
    ) {}


  ngOnInit(): void {
    this.initialiseForm();
  }
  initialiseForm(){
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      privateNumber: ['', [Validators.required, Validators.pattern("^[0-9]{11}$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/) ]],
    });
  }
register(){
  this.submitted = true;
  this.errorMessages = [];

  
  if(this.registerForm.valid){
    this.appService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log(response);
        alert("Account created succesfully, go to the email for verification")
        this.router.navigate(['/']);
        
        
      },
      error: (error) => {
        let errorMessage = 'An error occurred while registering.';

        // Check if the error contains a specific message
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        alert(errorMessage);
        
      }
  
    })
  }
  
  console.log(this.registerForm.value);
}

}