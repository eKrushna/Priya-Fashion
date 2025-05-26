import { Component } from '@angular/core';
import { HomeComponent } from "./component/home/home.component";
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./component/nav/nav.component";
import { FooterComponent } from "./component/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Jaipur_kurti';
}
