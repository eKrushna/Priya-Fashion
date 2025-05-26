import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
   constructor(private router:Router) {
      
    }
  navigate(){
    this.router.navigate(['/policy']);
   }
   navigatetoaccount(){
    this.router.navigate(['/my-order']);
   }
   navigateprivacy(){
    this.router.navigate(['/privacy']);
   }
}
