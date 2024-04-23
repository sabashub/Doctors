import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  problemDescription: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  bookAppointment(): void {
    if (this.problemDescription.trim() !== '') {
      this.dialogRef.close({ problem: this.problemDescription });
    }
  }
}
