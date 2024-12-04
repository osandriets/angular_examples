import { Component, inject, Inject, signal } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { Todo } from "../../interfaces/todo";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-modal-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.scss'
})
export class ModalEditComponent {
  readonly dialogRef = inject(MatDialogRef<ModalEditComponent>);
  readonly title = new FormControl('', [Validators.required, Validators.max(250)]);
  errorMessage = signal('');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Todo,
  ) {
    this.title.setValue(data.title);
  }

  updateErrorMessage(): void {
    if(this.title.hasError('required')) {
      this.errorMessage.set('You must enter a title');
    } else if(this.title.hasError('max')) {
      this.errorMessage.set('Title less 250');
    } else {
      this.errorMessage.set('Invalid title');
    }
  }

  onSave(): void {
    this.dialogRef.close({
      ...this.data,
      title: this.title.value
    });
  }
}
