import { Injectable } from '@angular/core';
import { Todo } from "../interfaces/todo";
import { HttpClient } from "@angular/common/http";
import { User } from "../interfaces/user";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$!: Observable<User[]>;

  private URL = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {
  }


  load(): void {
    console.error('load');

    this.users$ = this.http.get<User[]>(this.URL)
      .pipe(
        tap(console.error)
      );
  }
}
