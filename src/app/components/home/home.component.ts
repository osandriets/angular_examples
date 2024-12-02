import { Component, inject, model, OnInit, signal, ViewChild } from '@angular/core';
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TodoService } from "../../services/todo.service";
import { Todo } from "../../interfaces/todo";
import { Observable, ReplaySubject } from "rxjs";
import { AsyncPipe, JsonPipe } from "@angular/common";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { ModalDeleteComponent } from "../modal-delete/modal-delete.component";
import { MatDialog } from "@angular/material/dialog";
import { ModalEditComponent } from "../modal-edit/modal-edit.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    AsyncPipe,
    JsonPipe,

    MatTableModule,
    MatPaginatorModule,

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [
    TodoService,
  ],
})
export class HomeComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly todoService = inject(TodoService);
  readonly animal = signal('');
  readonly name = model('');

  displayedColumns: string[] = ['title', 'completed', 'actions'];
  dataSource = new ExampleDataSource([]);

  @ViewChild(MatTable) table!: MatTable<Todo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
  }

  ngOnInit(): void {
    this.todoService.load();
    this.todoService.data$
      .subscribe((data: Todo[]) => {
        this.dataSource.setData(data);
      });
  }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }


  onEdit(element: Todo, dataSource: any): void {
    const dialogRef = this.dialog.open(ModalEditComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.edit({
          ...result,
        }, dataSource)
        }
    });
  }

  onDelete(element: any): void {
    const dialogRef = this.dialog.open(ModalDeleteComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.delete(element.id);
      }
    });
  }
}

class ExampleDataSource extends DataSource<Todo> {
  private _dataStream = new ReplaySubject<Todo[]>();

  constructor(initialData: Todo[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Todo[]> {
    return this._dataStream;
  }

  disconnect() {
  }

  setData(data: Todo[]) {
    this._dataStream.next(data);
  }
}
