import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = 'mikedimartino';
  password = 'Sparkalark414!';
  loading = false;
  errorMessage = '';

  constructor(private dialogRef: MatDialogRef<LoginComponent>,
              private userService: UserService) {}

  onLoginClicked() {
    this.errorMessage = '';
    this.loading = true;

    console.log(`Username: ${this.username} | Password: ${this.password}`);
    this.userService.logIn(this.username, this.password).subscribe(
      success => {
        this.loading = false;
        this.dialogRef.close();
      },
      error => {
        console.log('error!!!:', error);
        this.loading = false;
        this.errorMessage = error.message;
      });
  }

  onKeyDown(event: KeyboardEvent) {
    console.log(event);
  }

  onSubmit() {
    console.log('SUBMIT!!!');
  }

}
