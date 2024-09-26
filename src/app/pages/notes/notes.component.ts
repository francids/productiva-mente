import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'notes-page',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MatCardModule, MatListModule, MatDividerModule, MatButtonModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  notes = [
    {
      id: 1,
      title: "Note 1",
    },
    {
      id: 2,
      title: "Note 2",
    },
  ];

  constructor(private router: Router) { }

  createNewNote() {
    const newNoteId = uuidv4();
    this.router.navigate(['/notes', newNoteId]);
  }
}
