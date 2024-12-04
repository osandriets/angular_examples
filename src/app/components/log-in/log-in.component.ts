import { Component, inject } from '@angular/core';
import { UserService } from "../../services/user.service";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-log-in',
  imports: [
    FormsModule,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardContent,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  readonly userService = inject(UserService);

  email = '';
  message = '';

  private errorMessage = "Enter Email or you don't have access";

  onLogIn() {
    if(this.email && this.userService.hasAccess(this.email)) {
      this.message = '';
      this.userService.login(this.email);
    } else {
      this.message = this.errorMessage;
    }
  }
}
