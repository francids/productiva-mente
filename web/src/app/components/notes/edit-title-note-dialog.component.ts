import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { DialogRef } from "../../services/dialog.service";

@Component({
  selector: "edit-title-note-dialog",
  template: `
    <div class="modal" (click)="$event.stopPropagation()">
      <h2 class="modal-title" i18n="@@dialogs.edit-note-title">Editar título</h2>
      <div class="modal-content">
        <form
          [formGroup]="titleForm()"
          (ngSubmit)="titleForm().valid && onSaveClick()"
        >
          <div class="form-field">
            <label i18n="@@dialogs.note-title">Título de la nota</label>
            <input type="text" formControlName="title" />
            @if (titleForm().get('title')!.hasError('required') && titleForm().get('title')!.touched) {
            <span class="error" i18n="@@dialogs.error.title-required"
              >El título es obligatorio.</span
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
          [disabled]="titleForm().invalid"
          i18n="@@dialogs.save"
        >
          Guardar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .form-field input {
      width: 100%;
    }
    .error {
      color: var(--error-color);
      font-size: 0.75rem;
    }
  `],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class EditTitleNoteDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  dialogRef!: DialogRef;
  data!: { title: string };
  
  readonly titleForm = signal(
    this.fb.group({
      title: ["", [Validators.required]],
    })
  );

  ngOnInit() {
    if (this.data) {
      this.titleForm().patchValue({ title: this.data.title });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.titleForm().valid) {
      const newTitle = this.titleForm().value.title;
      if (newTitle !== this.data.title) {
        this.dialogRef.close(newTitle);
      } else {
        this.dialogRef.close();
      }
    } else {
      this.titleForm().markAllAsTouched();
    }
  }
}
