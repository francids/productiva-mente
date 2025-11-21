import { ChangeDetectionStrategy, signal, inject } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DialogRef } from "../../services/dialog.service";

@Component({
  selector: "new-note-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal" (click)="$event.stopPropagation()">
      <h2 class="modal-title" i18n="@@dialogs.create-note">Crear nota</h2>
      <div class="modal-content">
        <form [formGroup]="titleForm()" (ngSubmit)="onSaveClick()">
          <div class="form-field">
            <label i18n="@@dialogs.note-title">Título de la nota</label>
            <input type="text" formControlName="title" />
            @if (titleForm().get('title')?.hasError('required') && titleForm().get('title')?.touched) {
            <span class="error" i18n="@@dialogs.error.title-required">
              El título es obligatorio.
            </span>
            }
          </div>
        </form>
      </div>
      <div class="modal-actions">
        <button class="secondary" (click)="onNoClick()" i18n="@@dialogs.cancel">
          Cancelar
        </button>
        <button
          type="submit"
          [disabled]="titleForm().invalid"
          i18n="@@dialogs.save"
          (click)="onSaveClick()"
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
export class NewNoteDialogComponent implements OnInit {
  dialogRef!: DialogRef;
  data!: { title: string };
  private readonly fb = inject(FormBuilder);

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

  onNoClick() {
    this.dialogRef.close();
  }

  onSaveClick() {
    if (this.titleForm().valid) {
      this.dialogRef.close(this.titleForm().value.title);
    } else {
      this.titleForm().markAllAsTouched();
    }
  }
}
