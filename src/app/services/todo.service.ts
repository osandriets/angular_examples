import { inject, Injectable, signal } from '@angular/core';
import { Todo } from "../interfaces/todo";
import { HttpClient } from "@angular/common/http";
import { finalize, Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  readonly http = inject(HttpClient);

  // todo switch to signal
  // eslint-disable-next-line
  private _data: Subject<Todo[]> = new Subject();
  data$: Observable<Todo[]> = this._data.asObservable();

  private URL = 'https://jsonplaceholder.typicode.com/todos';
  private data: Todo[] = [];

  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.data$.subscribe((d) => this.data = d);
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.http.get<Todo[]>(this.URL)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (d) => this._data.next(d),
        error: () => this.errorMessage.set('Something wrong'),
      });
  }

  delete(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.http.delete<Todo>(`${this.URL}/${id}`)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
          next: () => {
            this._data.next(this.data.filter((d: Todo) => d.id !== id));
          },
          error: () => this.errorMessage.set('Something wrong'),
        }
      );
  }

  add(item: Partial<Todo>): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.http.post<Todo>(`${this.URL}`, item)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (result) => {
          this._data.next([result, ...this.data]);
        },
        error: () => this.errorMessage.set('Something wrong'),
      });
  }

  edit(item: Todo): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.http.put<Todo>(`${this.URL}/${item.id}`, item)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (result) => {
          this._data.next(this.data.map((d: Todo) => d.id === item.id ? result : d));
        },
        error: () => this.errorMessage.set('Something wrong'),
      });
  }
}
