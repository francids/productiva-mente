// Angular
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  AfterViewInit,
} from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

// Services
import { NotesService } from "../../services/notes.service";
import { TitleService } from "../../services/title.service";
import { ExportService } from "../../services/export.service";
import { DialogService } from "../../services/dialog.service";
import { SnackbarService } from "../../services/snackbar.service";

// Models
import { Note } from "../../models/note.model";

// Dialogs
import { EditTitleNoteDialogComponent } from "../../components/notes/edit-title-note-dialog.component";
import { DelNoteDialogComponent } from "../../components/notes/del-note-dialog.component";

// Components
import { EditorComponent } from "../../components/notes/editor.component";

@Component({
  selector: "note-edit",
  templateUrl: "./note-edit.component.html",
  styleUrl: "./note-edit.component.scss",
  imports: [
    CommonModule,
    RouterLink,
    EditorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteEditComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notesService = inject(NotesService);
  private readonly titleService = inject(TitleService);
  private readonly exportService = inject(ExportService);
  private readonly dialog = inject(DialogService);
  private readonly snackbar = inject(SnackbarService);

  noteId: string | undefined;
  note = signal<Note>({ id: "", title: "", content: "" });
  showMenu = signal(false);

  ngAfterViewInit(): void {
    this.route.params.subscribe(async (params) => {
      this.noteId = params["id"];
      const fetchedNote = await this.notesService.getNoteById(this.noteId!);
      if (!fetchedNote) {
        this.router.navigate(["/notes"]);
        return;
      }
      this.note.set(fetchedNote);
      Promise.resolve().then(() =>
        this.titleService.updateTitle(fetchedNote.title)
      );
    });
  }

  async saveNote(noteContent: string): Promise<void> {
    await this.notesService.updateNote(this.note().id, {
      id: this.note().id,
      title: this.note().title,
      content: noteContent,
    });
  }

  async exportNote(): Promise<void> {
    await this.exportService.generateNoteFile(this.note().id);
    this.showMenu.set(false);
  }

  toggleMenu(): void {
    this.showMenu.update(v => !v);
  }

  openDialogEditTitleNote(): void {
    this.showMenu.set(false);
    const dialogRef = this.dialog.open(EditTitleNoteDialogComponent, {
      data: { title: this.note().title },
    });

    dialogRef.afterClosed().then((result) => {
      if (result !== undefined) {
        this.notesService.updateNote(this.note().id, {
          id: this.note().id,
          title: result,
          content: this.note().content,
        });
        this.note.set({ ...this.note(), title: result });
        this.titleService.updateTitle(result);
        this.snackbar.open(
          $localize`:@@notes.note-title-edited:Título de la nota editado`,
          $localize`:@@common.ok:Cerrar`,
          { duration: 2000 }
        );
      }
    });
  }

  openDialogDeleteNote(): void {
    this.showMenu.set(false);
    const dialogRef = this.dialog.open(DelNoteDialogComponent);

    dialogRef.afterClosed().then((result) => {
      if (result === true) {
        this.notesService.deleteNote(this.note().id);
        this.snackbar.open(
          $localize`:@@notes.note-deleted:Nota eliminada`,
          $localize`:@@common.ok:Cerrar`,
          { duration: 2000 }
        );
        this.router.navigate(["/notes"]);
      }
    });
  }
}
