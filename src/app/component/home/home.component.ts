import { Component } from '@angular/core';
import { CarousalSliderComponent } from "../carousal-slider/carousal-slider.component";
import { CardComponent } from "../card/card.component";

@Component({
  selector: 'app-home',
  imports: [CarousalSliderComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
