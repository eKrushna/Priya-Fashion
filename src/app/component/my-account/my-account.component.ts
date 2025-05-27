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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit {
  User_Name: any;
  User_Id: any;
  currentTime: string = '';
  userName: any;
  userInitial: string = '';
  greeting: string = '';
  fetchedDataH: any; // Added to store fetched data
  Uname: any;

  constructor(private router: Router, private menuservice: LoginService, private productservice: ProductService, private http: HttpClient) { }

  ngOnInit(): void {

    console.log("------------------------");
    console.log("My Account Component Initialized");
    console.log("------------------------");
    // Initialize the current time
    this.updateTime();
    const customerDataStr = sessionStorage.getItem('customerData');
    // console.log("customerDataStr", customerDataStr ? JSON.parse(customerDataStr)[0]?.User_Name : undefined);
    // this.getLoggedInUserDetails();
    this.Uname = customerDataStr ? JSON.parse(customerDataStr)[0]?.User_Name : 'Guest';

    setInterval(() => this.updateTime(), 1000);  // Update every second
    const user = localStorage.getItem('user');

    this.userInitial = this.Uname.charAt(0).toUpperCase();
    // alert("Welcome " + this.userInitial);

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



  getLoggedInUserDetails() {
    const customerDataStr = sessionStorage.getItem('customerData');
    if (customerDataStr) {
      const customerData = JSON.parse(customerDataStr);

      this.User_Id = customerData[0].User_Id;
    }

    const postData = [
      {
        operation: 'Display_Operation',
        userId: this.User_Id,
      },
    ];
    console.log('fetched UID', postData);

    const requestUrl =
      'https://ppriyafashion.com/business_guru_admin/WISH_LIST.php';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post<any[]>(requestUrl, postData, { headers }).subscribe(
      (response) => {
        this.fetchedDataH = response;
        console.log('Fetched Data:', this.fetchedDataH);
      },
      (error) => {

        console.error('Error fetching data:', error);
      }
    );
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
