import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../interfaces/user";
import { tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly http = inject(HttpClient);
  readonly router = inject(Router);

  users!: User[];

  private URL = 'https://jsonplaceholder.typicode.com/users';
  private user = '';


  load(): void {
    this.http.get<User[]>(this.URL)
      .pipe(
        tap(users => this.users = users)
      ).subscribe();
  }

  login(user: string) {
    this.user = user;
    this.router.navigateByUrl('/home').then();
  }

  authenticated() {
    return !!this.user;
  }

  hasAccess(email: string): boolean {
    return !!this.users.find(user => user.email === email);
  }

  getUserId(): number {
    const currentUser = this.users.find(user => user.email === this.user);
    return currentUser?.id ?? 0;
  }
}
