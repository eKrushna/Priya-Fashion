import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Customer, Product } from '../../models/product';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-my-account',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit{
  User_Name:any;
    currentTime: string ='';
    userName: any;
    userInitial: string = '';
    greeting:string='';
  
    constructor(private router: Router,private menuservice:LoginService,private productservice:ProductService) {}
  
    ngOnInit(): void {
      // Initialize the current time
      this.updateTime();
      setInterval(() => this.updateTime(), 1000);  // Update every second
      const user = localStorage.getItem('user');
      if (user) {
        // If user data is found, parse it and set the username
        this.userName = JSON.parse(user).name;
        this.userInitial = this.userName.charAt(0).toUpperCase();
      }
      this.setGreeting();
    }
    updateTime(): void {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      this.currentTime = `${hours}:${minutes}:${seconds}`;  // Format time as HH:MM:SS
    }
    setGreeting() {
      const currentHour = new Date().getHours();  // Get current hour
  
      if (currentHour >= 5 && currentHour < 12) {
        this.greeting = 'Good Morning';
      } else if (currentHour >= 12 && currentHour < 17) {
        this.greeting = 'Good Afternoon';
      } else if (currentHour >= 17 && currentHour < 21) {
        this.greeting = 'Good Evening';
      } else {
        this.greeting = 'Good Night';
      }
    }
    logout() {
      // Clear user data
      localStorage.removeItem('user');
      
      // Clear the cart
      this.productservice.clearCart(); 
      this.menuservice.logout();
      // Redirect to the login page
      this.router.navigate(['/login']);
    
      // Reset username to 'Guest'
      this.User_Name = 'Guest';
  
    
    }
  
  }