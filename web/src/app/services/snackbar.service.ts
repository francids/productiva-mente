import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  open(message: string, action?: string, options?: { duration?: number }): void {
    const snackbar = document.createElement("div");
    snackbar.className = "snackbar";
    snackbar.textContent = message;
    document.body.appendChild(snackbar);

    setTimeout(() => {
      snackbar.classList.add("show");
    }, 10);

    const duration = options?.duration || 3000;
    setTimeout(() => {
      snackbar.classList.remove("show");
      setTimeout(() => {
        snackbar.remove();
      }, 300);
    }, duration);
  }
}
