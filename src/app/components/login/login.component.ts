import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private dialogRef: MatDialogRef<LoginComponent>,
              private userService: AuthService) {}

  onLoginClicked() {
    this.errorMessage = '';
    this.loading = true;

    this.userService.logIn(this.username, this.password).subscribe(
      success => {
        this.loading = false;
        this.dialogRef.close();
      },
      error => {
        this.loading = false;
        this.errorMessage = error.error.message;
      });
  }

}
