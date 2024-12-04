import { inject, Injectable } from '@angular/core';
import { Todo } from "../interfaces/todo";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  readonly http = inject(HttpClient);

  private _data: Subject<Todo[]> = new Subject();
  data$: Observable<Todo[]> = this._data.asObservable();

  private URL = 'https://jsonplaceholder.typicode.com/todos';
  private data: Todo[] = [];

  constructor() {
    this.data$.subscribe((d) => this.data = d);
  }


  load(): void {
    this.http.get<Todo[]>(this.URL)
      .subscribe((d) => {
        this._data.next(d);
      });
  }

  delete(id: number): void {
    this.http.delete<Todo>(`${this.URL}/${id}`)
      .subscribe(() => {
        this._data.next(this.data.filter((d: Todo) => d.id !== id));
      });
  }

  add(item: Partial<Todo>): void {
    this.http.post<Todo>(`${this.URL}`, item)
      .subscribe((result) => {
        this._data.next([result, ...this.data]);
      });
  }

  edit(item: Todo): void {
    this.http.put<Todo>(`${this.URL}/${item.id}`, item)
      .subscribe((result) => {
        this._data.next(this.data.map((d: Todo) => d.id === item.id ? result : d));
      });
  }
}
