import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../interfaces/user";
import { firstValueFrom } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly http = inject(HttpClient);
  readonly router = inject(Router);

  #user = signal<User | null>(null);
  #URL = 'https://jsonplaceholder.typicode.com/users';

  #loading = signal(false);
  loading = this.#loading.asReadonly();

  errorMessage = signal('');

  async login(email: string): Promise<void> {
    this.#loading.set(true);
    this.errorMessage.set('');

    try {
      const users = await this.loadUsersHttp();
      const user = users.find(user => user.email === email);
      if(user) {
        this.#user.set(user);
        this.router.navigateByUrl('/home').then();
      } else {
        this.errorMessage.set('No access');
      }
    } catch (err) {
      console.error('err', err);
      this.errorMessage.set('Error');

    } finally {
      this.#loading.set(false);
    }
  }

  authenticated(): boolean {
    const user = this.#user();

    return !!user;
  }

  getUserId(): number {
    const user = this.#user();

    return user?.id || 0;
  }

  async loadUsersHttp(): Promise<User[]> {
    const users = this.http.get<User[]>(this.#URL);
    const response = await firstValueFrom(users);

    return response;
  }
}
