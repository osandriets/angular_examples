import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../interfaces/user";
import { firstValueFrom, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly http = inject(HttpClient);
  readonly router = inject(Router);

  #users = signal<User[]>([]);
  #user = signal<User | null>(null);
  #URL = 'https://jsonplaceholder.typicode.com/users';

  async login(email: string) {
    try {
      const users = await this.loadUsersHttp();

      console.error('users', users);

      const user = users.find(user => user.email === email);
      if(user) {
        this.#user.set(user);
        this.router.navigateByUrl('/home').then();
      }
    } catch (err) {
      console.error('err', err);
    }
  }

  authenticated() {
    const user = this.#user();

    return !!user;
  }

  hasAccess(email: string): boolean {
    const user = this.#user();

    return !!user;
  }

  getUserId(): number {
    const user = this.#user();

    console.error('getUserId', user, user?.id)
    return user?.id || 0;
  }

  async loadUsersHttp(): Promise<User[]> {
    const users = this.http.get<User[]>(this.#URL);
    const response = await firstValueFrom(users);

    return response;
  }

  async loadUsers() {
    try {
      const users = await this.loadUsersHttp();

      console.error('users', users);

      this.#users.set(users);
    } catch (err) {
      console.error('err', err);
    }
  }
}
