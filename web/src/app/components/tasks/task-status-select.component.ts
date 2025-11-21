import { Component, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Task } from "../../models/task.model";

@Component({
  selector: "task-status-select",
  template: `
    <select
      [value]="task().status"
      (change)="onStatusChange($event)"
      [class.no-started]="task().status === 0"
      [class.in-progress]="task().status === 1"
      [class.completed]="task().status === 2"
      class="task-status-select"
    >
      <option [value]="0" i18n="@@tasks.not-started">No iniciado</option>
      <option [value]="1" i18n="@@tasks.in-progress">En progreso</option>
      <option [value]="2" i18n="@@tasks.completed">Completado</option>
    </select>
  `,
  imports: [CommonModule, FormsModule],
})
export class TaskStatusSelectComponent {
  task = input.required<Task>();
  statusChange = output<Task["status"]>();

  onStatusChange(event: Event) {
    const status = parseInt((event.target as HTMLSelectElement).value) as Task["status"];
    this.statusChange.emit(status);
  }
}
