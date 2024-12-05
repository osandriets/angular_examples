import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TodoService } from "../../services/todo.service";
import { Todo } from "../../interfaces/todo";
import { merge } from "rxjs";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { ModalDeleteComponent } from "../modal-delete/modal-delete.component";
import { MatDialog } from "@angular/material/dialog";
import { ModalEditComponent } from "../modal-edit/modal-edit.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UserService } from "../../services/user.service";
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatProgressBar,
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
  readonly userService = inject(UserService);

  readonly title = new FormControl('', [Validators.required, Validators.maxLength(250)]);
  errorMessage = signal('');

  loading = this.todoService.loading;
  tableErrorMessage = this.todoService.errorMessage;

  displayedColumns: string[] = ['title', 'actions'];
  dataSource = new MatTableDataSource<Todo>([]);

  @ViewChild(MatTable) table!: MatTable<Todo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultsLength = 0;

  constructor() {
    merge(this.title.statusChanges, this.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {
    this.todoService.load();
    this.todoService.data$
      .subscribe((data: Todo[]) => {
        this.dataSource.data = data;
        this.resultsLength = data.length;
        this.dataSource.paginator = this.paginator
      });
  }

  onAdd() {
    if(this.title.valid) {
      const item: Partial<Todo> = {
        completed: false,
        title: `${this.title.value}`,
        userId: this.userService.getUserId(),
      }
      this.todoService.add(item);
    } else {

      this.title.markAllAsTouched();
      this.updateErrorMessage();
    }
  }

  onEdit(element: Todo): void {
    const dialogRef = this.dialog.open(ModalEditComponent, {
      data: {...element},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.todoService.edit({
          ...result,
        })
      }
    });
  }

  onDelete(element: Todo): void {
    const dialogRef = this.dialog.open(ModalDeleteComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.todoService.delete(element.id);
      }
    });
  }

  updateErrorMessage() {
    if (this.title.hasError('required')) {
      this.errorMessage.set('You must enter a title');
    } else if (this.title.hasError('maxlength')) {
      this.errorMessage.set('Title maxlength 250');
    } else {
      this.errorMessage.set('Invalid title');
    }
  }
}
