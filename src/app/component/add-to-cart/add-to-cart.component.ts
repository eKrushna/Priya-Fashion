import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-add-to-cart',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css'
})
export class AddToCartComponent {
  cartItems: any[] = [];

  constructor(public cartService: ProductService,private router:Router) {
    
  }

  ngOnInit() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      console.log(this.cartItems);
    });
  }
  

  getTotalAmount() {
    return this.cartItems.reduce((total, item) => total + item.rate * item.quantity, 0);
  }

  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
    this.cartService.updateCart(this.cartItems);
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.cartService.updateCart(this.cartItems);
    }
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
    this.cartService.updateCart(this.cartItems);
  }

  navigate(){
   this.router.navigate(['/policy']);
  }
 
}
