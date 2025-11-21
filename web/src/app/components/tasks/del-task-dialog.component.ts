import { Component, inject } from "@angular/core";
import { DialogRef } from "../../services/dialog.service";

@Component({
  selector: "del-task-dialog",
  template: `
    <div class="modal" (click)="$event.stopPropagation()">
      <h2 class="modal-title" i18n="@@dialogs.delete-task">Eliminar tarea</h2>
      <div class="modal-content">
        <p i18n="@@dialogs.delete-task-confirm">¿Estás seguro de que deseas eliminar esta tarea?</p>
      </div>
      <div class="modal-actions">
        <button class="secondary" (click)="dialogRef.close()" i18n="@@dialogs.cancel">
          Cancelar
        </button>
        <button (click)="dialogRef.close(true)" i18n="@@dialogs.delete">
          Eliminar
        </button>
      </div>
    </div>
  `,
  imports: [],
})
export class DelTaskDialogComponent {
  dialogRef!: DialogRef;
  data!: string;
}
