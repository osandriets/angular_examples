import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { Observable } from "rxjs";
import { User } from "../../interfaces/user";
import { Todo } from "../../interfaces/todo";
import { AsyncPipe, JsonPipe } from "@angular/common";

@Component({
  selector: 'app-log-in',
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  standalone: true,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent implements OnInit {
  users$!: Observable<User[]>

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.userService.load();
    this.users$ = this.userService.users$;
  }
}
