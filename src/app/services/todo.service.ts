import { Injectable } from '@angular/core';
import { Todo } from "../interfaces/todo";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private _data: Subject<Todo[]> = new Subject();
  data$: Observable<Todo[]> = this._data.asObservable();

  private URL = 'https://jsonplaceholder.typicode.com/todos';
  private data: Todo[] = [];

  constructor(private http: HttpClient) {
    this.data$.subscribe((d) => this.data = d );
  }


  load(): void {
    console.error('load');

    this.http.get<Todo[]>(this.URL)
      .subscribe((d)=> {
        // this.data = d.map(i => ({
        //   ...i,
        //   // uuid: uuidv4(),
        // }));
        //
        this._data.next(d);

        console.error('load', d);
      });
  }

  delete(id: number): void {
    this.http.delete<Todo>(`${this.URL}/${id}`)
      .subscribe((result)=> {
        console.error('delete result', result);
        this._data.next(this.data.filter((d: Todo) => d.id !== id ));
      });
  }

  add(result: Todo): void {
    this.data = [
      {
        ...result,
        // uuid: uuidv4(),
      },
      ...this.data,
    ];

    this._data.next(this.data);
  }

  edit(item: Todo, dataSource: Todo[]): void {
    this.http.put<Todo>(`${this.URL}/${item.id}`, item)
      .subscribe((result)=> {

        const ttt = this.data.map((d: Todo) => d.id === item.id ? result : d);

        console.error('ttt', this.data, ttt);

        this._data.next(this.data.map((d: Todo) => d.id === item.id ? result : d ));

        // console.error('edit', d);
      });
  }
}
