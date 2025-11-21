import { Component, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DialogRef } from "../../services/dialog.service";

@Component({
  selector: "edit-task-dialog",
  template: `
    <div class="modal" (click)="$event.stopPropagation()">
      <h2 class="modal-title" i18n="@@dialogs.edit-task">Editar tarea</h2>
      <div class="modal-content">
        <form
          [formGroup]="taskForm()"
          (ngSubmit)="taskForm().valid && onSaveClick()"
        >
          <div class="form-field">
            <label i18n="@@dialogs.task-title">Título de la tarea</label>
            <input type="text" formControlName="title" />
            @if (taskForm().get('title')!.hasError('required') && taskForm().get('title')!.touched) {
            <span class="error" i18n="@@dialogs.error.title-required"
              >El título es obligatorio.</span
            >
            }
          </div>
          <div class="form-field">
            <label i18n="@@dialogs.task-description"
              >Descripción de la tarea</label
            >
            <textarea formControlName="description" rows="3"></textarea>
            @if (taskForm().get('description')!.hasError('required') && taskForm().get('description')!.touched) {
            <span class="error" i18n="@@dialogs.error.description-required"
              >La descripción es obligatoria.</span
            >
            }
          </div>
        </form>
      </div>
      <div class="modal-actions">
        <button class="secondary" (click)="onNoClick()" i18n="@@dialogs.cancel">
          Cancelar
        </button>
        <button
          (click)="onSaveClick()"
          [disabled]="taskForm().invalid"
          i18n="@@dialogs.save"
        >
          Guardar
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .form-field input,
      .form-field textarea {
        width: 100%;
      }
      .error {
        color: var(--error-color);
        font-size: 0.75rem;
      }
    `,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditTaskDialogComponent {
  private readonly fb = inject(FormBuilder);
  dialogRef!: DialogRef;
  data!: { title: string; description: string };
  
  readonly taskForm = signal(
    this.fb.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
    })
  );

  ngOnInit() {
    if (this.data) {
      this.taskForm().patchValue(this.data);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.taskForm().valid) {
      const newTask = this.taskForm().value;
      this.dialogRef.close(newTask);
    } else {
      this.taskForm().markAllAsTouched();
    }
  }
}
