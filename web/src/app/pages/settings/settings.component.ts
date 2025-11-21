// Angular
import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

// Services
import { TitleService } from "../../services/title.service";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: "settings-page",
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
  imports: [CommonModule],
})
export class SettingsComponent {
  private readonly titleService = inject(TitleService);
  private readonly themeService = inject(ThemeService);

  isDarkMode = signal<boolean>(false);
  isAutoMode = signal<boolean>(false);

  constructor() {
    this.titleService.updateTitle($localize`:@@settings:Configuración`);
  }

  ngOnInit(): void {
    this.isDarkMode.set(this.themeService.isDarkModeEnabled());
    this.isAutoMode.set(this.themeService.isAutoModeEnabled());
  }

  toggleDarkMode(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.themeService.toggleDarkMode(checked);
  }

  toggleAutoMode(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.isAutoMode.set(checked);
    this.themeService.toggleAutoMode(checked);
    if (!checked) {
      this.isDarkMode.set(this.themeService.isDarkModeEnabled());
    }
  }
}
