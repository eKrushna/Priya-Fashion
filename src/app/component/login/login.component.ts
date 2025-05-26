import { Component } from '@angular/core';
import { Customer } from '../../models/product';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  User_Id: any = ''; // Add other required properties and provide initial values
  User_Name: any = '';
  Password1:  any = '';
  F_Name:  any = '';
  L_Name:  any = '';
  Mobile_No: any = '';
  Email_Id: any = '';
  Address_1:  any = '';
  Address_2:  any = '';
  Address_3:  any = '';
  Address_4:  any = '';
  Address_5:  any = '';
  User_Type:  any = '';
  Status1:  any= '';


  
  customer: Customer = {
    User_Name: '',
    Password1: '',
    Mobile_No: '',
    User_Id:'',
    //mobile: '',
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

  //Mobile_No: any;
  password: any;
  responseData: any;
  errorMessage: any;

  constructor(private router: Router, private loginService: LoginService,private route: ActivatedRoute) {}


 ngOnInit(){
  // this.route.queryParams.subscribe(params => {
  //   const productId = params['productId'];
  //   console.log("Id in login", productId);
  //   // Store the productId in a service or any other suitable place
  //   // You can use a shared service to share data between components
  // });
 }
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isLoggedIn(): boolean {
    return this.loginService.isAuthenticated();
  }

  getMobile_No(): string {
    return this.loginService.getUsername();
  }

  
  login(): void {
    const Mobile_No = this.Mobile_No; // Assign Mobile_No to a local variable
    const password = this.password; // Assign password to a local variable
  
    this.loginService.getUserData(Mobile_No, password).subscribe(
      response => {
        console.log("this is res",this.loginService.setResponseData(response),response);
        this.loginService.setResponseData(response);
        if (response && response.length > 0) {
          if (response[0].Mobile_No === Mobile_No && response[0].Password1 === password) {
            // Login successful
            this.loginService.setCustomer(response);


           
            const productId = this.route.snapshot.queryParams['productId'];
              console.log("Id in login", productId);
              if (productId) {
                console.log("Id in login nevigate 1", productId); // Navigate back to the 'products' component with the retrieved productId
                this.router.navigate(['/product', productId]);
              } else {
                // Navigate back to the 'banner' component if no productId is present
                this.router.navigate(['/']);
              }
              // You can use a shared service to share data between components
            



          } else {
            // Invalid credentials
            this.errorMessage = 'Invalid credentials. Please try again.';
          }
        } else {
          // Invalid credentials
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      },
      error => {
        console.error('An error occurred during login:', error);
        this.errorMessage = 'An error occurred during login. Please try again later.';
      }
    );
  
    // Reset the form fields
    this.Mobile_No = '';
    this.password = '';
  }
  
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}