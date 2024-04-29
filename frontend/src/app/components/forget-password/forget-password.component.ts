import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { User } from '../../models/User';
@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit{
  resetCode: string = ''; // Variable to hold the reset code
  newPassword: string = ''; // Variable to hold the new password
  repeatNewPassword: string = ''; // Variable to hold the repeated new password
  errorMessage: string | null = null;
  user: User | null = null;
  resetCodeMatched: boolean = false; // Flag to indicate if the reset code matches

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.appService.user$.subscribe(user => {
      this.user = user;
      // Automatically send reset code when component is initialized
      if (user?.email) {
        this.sendResetCode();
      }
    });
  }

  sendResetCode(): void {
    if (!this.user?.email) {
      //alert('User email not found. Please try again later.');
      return;
    }

    // Make a POST request to initiate password reset
    this.http.post<any>('http://localhost:5005/api/Account/forgot-password', { email: this.user.email }).subscribe(
      (response: any) => {
        // Handle success response, if needed
        alert(response.message);
      },
      (error: any) => {
        // Handle error response, if needed
        console.error(error);
        this.errorMessage = 'Failed to initiate password reset. Please try again later.';
      }
    );
  }

  checkResetCode(): void {
    if (!this.user?.email) {
      alert('User email not found. Please try again later.');
      return;
    }

    // Make a POST request to check if the entered code matches the sent code
    this.http.post<any>('http://localhost:5005/api/Account/check-reset-code', { email: this.user.email, code: this.resetCode }).subscribe(
      (response: any) => {
        // Handle success response
        if (response.codeMatched) {
          alert('Reset code matched. You can now proceed to reset your password.');
          this.resetCodeMatched = true; // Set the flag to true if code matches
        } else {
          alert('Reset code does not match. Please try again.');
          this.resetCodeMatched = false; // Set the flag to false if code does not match
        }
      },
      (error: any) => {
        // Handle error response
        console.error(error);
        alert('Failed to check reset code. Please try again later.');
        this.resetCodeMatched = false; // Set the flag to false in case of error
      }
    );
  }

  resetPassword(): void {
    // Validate new password fields
    if (!this.newPassword || !this.repeatNewPassword) {
      alert('Please enter your new password and repeat it.');
      return;
    }

    if (this.newPassword !== this.repeatNewPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    // Make a POST request to reset the password
    this.http.post<any>('http://localhost:5005/api/Account/reset-password', { email: this.user?.email, newPassword: this.newPassword }).subscribe(
      (response: any) => {
        // Handle success response
        alert(response.message);
        // Close the dialog
        this.dialogRef.close();
      },
      (error: any) => {
        // Handle error response
        console.error(error);
        alert('Failed to reset password. Please try again later.');
      }
    );
  }
}
