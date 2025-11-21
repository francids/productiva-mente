// Angular
import {
  Component,
  inject,
  signal,
  effect,
  computed,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  RouterLink,
  RouterOutlet,
  Router,
  NavigationEnd,
} from "@angular/router";
import { CommonModule } from "@angular/common";

// RxJS
import { filter } from "rxjs/operators";

// Components
import { LogoComponent } from "./components/logo/logo.component";

// Services
import { TitleService } from "./services/title.service";
import { FirstVisitService } from "./services/first-visit.service";

@Component({
  selector: "app-root",
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule,
    LogoComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private router = inject(Router);
  private titleService = inject(TitleService);
  private firstVisitService = inject(FirstVisitService);

  title = signal("Productiva Mente");
  currentRoute = signal("");
  sidenavOpen = signal(false);
  showWelcomeDialog = signal(false);

  isEditPage = computed(() => this.currentRoute().includes("/notes/edit"));

  constructor() {
    effect(() => {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.currentRoute.set(event.urlAfterRedirects);
        });
    });

    effect(() => {
      this.titleService.title$.subscribe((title) => {
        this.title.set(title);
      });
    });

    effect(() => {
      if (this.firstVisitService.isFirstVisit()) {
        setTimeout(() => {
          this.showWelcomeDialog.set(true);
        }, 1000);
      }
    });
  }

  toggleSidenav() {
    this.sidenavOpen.update(v => !v);
  }

  closeSidenav() {
    this.sidenavOpen.set(false);
  }

  closeWelcomeDialog() {
    this.showWelcomeDialog.set(false);
    this.firstVisitService.setVisited();
  }
}
