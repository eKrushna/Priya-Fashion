import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Customer } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule,FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  
  User_Id:  any = ''; // Add other required properties and provide initial values
  User_Name: any = '';
  Password1:  any= '';
  F_Name:  any = '';
  L_Name:  any = '';
  Mobile_No: any = '';
  Email_Id: any = '';
  Address_1: any = '';
  Address_2:  any = '';
  Address_3:  any = '';
  Address_4:  any = '';
  Address_5:  any= '';
  User_Type:  any = '';
  Status1:  any = '';


  customer: Customer = {
    User_Name: '',
    Password1: '',
    Mobile_No: '',
    User_Id:'',
   // mobile: '',
    Email_Id: '',
    F_Name: '',
    L_Name:'',
    Address_1: '',
    Address_2: '',
    Address_3:'',
    Address_4: '',
    Address_5: '',
    User_Type: '',
    Status1: ''
  };

  constructor(private router: Router, private loginService: LoginService) {}

  isLoggedIn(): boolean {
    return this.loginService.isAuthenticated();
  }

  getUsername(): string {
    const customer = this.loginService.getCustomer();
    return customer ? customer.User_Name : '';
  }

  signup(): void {
    this.router.navigate(['/login']);
    
    this.loginService.signup(this.customer).subscribe(
      (response: any[]) => {
console.log("new",response);
console.log("customer",this.customer);

        
        if (response && response.length > 0 && response[0].Status1 === 'Success') {
          // Signup successful
          this.loginService.setCustomer(this.customer);
          
        } else {
          // Signup failed
          alert(response);
        }
      },
      error => {
        console.error('An error occurred during signup:', error);
      }
    );

    // Reset the form fields
    this.customer.User_Name = '';
    this.customer.Password1 = '';
    this.customer.Mobile_No = '';
    this.customer.Email_Id = '';
  }
  isValidPassword(): boolean {
    const passwordPattern = /^(?=.[0-9])(?=.[a-zA-Z])(?=.[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(this.customer.Password1);
  }
  logout(): void {
    // Clear the user data from the login service
    this.loginService.setCustomer(null);

    // Navigate to the login page
    this.router.navigate(['/login']);
  }
}
