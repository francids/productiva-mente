import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home-box",
  templateUrl: "./home-box.component.html",
  styleUrl: "./home-box.component.scss",
  imports: [RouterLink],
})
export class HomeBoxComponent {
  title = input<string>("");
  path = input<string>("");
}
