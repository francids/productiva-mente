// Angular
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  effect,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// Services
import { TasksService } from "../../services/tasks.service";
import { TitleService } from "../../services/title.service";
import { DialogService } from "../../services/dialog.service";
import { SnackbarService } from "../../services/snackbar.service";

// Utils
import { v4 as uuidv4 } from "uuid";

// Models
import { Task } from "../../models/task.model";

// Dialogs
import { NewTaskDialogComponent } from "../../components/tasks/new-task-dialog.component";
import { EditTaskDialogComponent } from "../../components/tasks/edit-task-dialog.component";
import { DelTaskDialogComponent } from "../../components/tasks/del-task-dialog.component";
import { TaskStatusSelectComponent } from "../../components/tasks/task-status-select.component";

@Component({
  selector: "tasks-page",
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.scss",
  imports: [
    CommonModule,
    FormsModule,
    TaskStatusSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TasksComponent {
  private readonly titleService = inject(TitleService);
  private readonly tasksService = inject(TasksService);
  private readonly dialog = inject(DialogService);
  private readonly snackbar = inject(SnackbarService);

  readonly tasks = this.tasksService.tasks;
  readonly sortedTasks = signal<Task[]>([]);
  readonly sortColumn = signal<keyof Task | null>(null);
  readonly sortDirection = signal<"asc" | "desc">("asc");

  constructor() {
    this.titleService.updateTitle($localize`:@@tasks:Tareas`);
    effect(() => {
      this.updateSortedTasks();
    });
  }

  updateSortedTasks() {
    const tasks = [...this.tasks()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (column) {
      tasks.sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction === "asc" ? comparison : -comparison;
      });
    }

    this.sortedTasks.set(tasks);
  }

  sortBy(column: keyof Task) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === "asc" ? "desc" : "asc");
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set("asc");
    }
    this.updateSortedTasks();
  }

  async createTask(title: string, description: string): Promise<void> {
    await this.tasksService.createTask({
      id: uuidv4(),
      title,
      description,
      status: 0,
    });
  }

  async updateTaskStatus(task: Task, status: Task["status"]): Promise<void> {
    await this.tasksService.updateTask({ ...task, status });
  }

  async updateTask(task: Task): Promise<void> {
    await this.tasksService.updateTask(task);
  }

  openDialogCreateTask() {
    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      data: { title: "", description: "" },
    });
    dialogRef.afterClosed().then(async (result) => {
      if (result) {
        await this.createTask(result.title, result.description);
      }
    });
  }

  openDialogEditTask(task: Task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: { title: task.title, description: task.description },
    });
    dialogRef.afterClosed().then(async (result) => {
      if (result) {
        await this.updateTask({ ...task, ...result });
      }
    });
  }

  openDialogDeleteTask(taskId: string) {
    const dialogRef = this.dialog.open(DelTaskDialogComponent, {
      data: taskId,
    });
    dialogRef.afterClosed().then(async (result) => {
      if (result) {
        await this.tasksService.deleteTask(taskId);
        this.snackbar.open(
          $localize`:@@tasks.task-deleted:Tarea eliminada`,
          $localize`:@@common.ok:Cerrar`,
          { duration: 2000 }
        );
      }
    });
  }
}
