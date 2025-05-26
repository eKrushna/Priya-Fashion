import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://ppriyafashion.com/business_guru_admin/User_Account_Operations.php';
  private customer: Customer | null = null;
  private responseDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  //user:any;

  constructor(private http: HttpClient) {
    const storedCustomerDataString: string | null = sessionStorage.getItem('customerData');
    if (storedCustomerDataString) {
      this.customer = JSON.parse(storedCustomerDataString);
    }   
  }

  private responseSubject = new BehaviorSubject<any>(null);
  response$ = this.responseSubject.asObservable();

  setResponseData(data: any) {
    this.responseSubject.next(data);
  }
      getResponseData(): Observable<any[]> {
            return this.responseDataSubject.asObservable();
          }


  login(Mobile_No: string, password: string): Observable<any> {
    const loginData = {
      Operation: 'Display_User_Pass_Operation',
      Mobile_No: Mobile_No,
      Password1: password
    };
  
    return this.http.post(this.apiUrl, [loginData]);
  }
  
  getUserData(Mobile_No: string, password: string): Observable<any> {
    const requestData = [{
      "Operation": "Display_User_Pass_Operation",
      "Mobile_No": Mobile_No,
      "Password1": password
    }];

    return this.http.post<any>(this.apiUrl, requestData);
  }
  getEmail(Email_Id: string): Observable<any> {
    const requestData = [{
      "Operation": "Display_Email_Id_Operation",
      "Email_Id": Email_Id
      
    }];

    return this.http.post<any>(this.apiUrl, requestData);
  }

  signup(customer: Customer): Observable<any> {
    const signupData = {
      Operation: 'Insert_Operation',
      User_Name: customer.User_Name,
      Password1: customer.Password1,
      Mobile_No: customer.Mobile_No,
      Email_Id: customer.Email_Id

    };

    return this.http.post(this.apiUrl, [signupData]);
  }
  
  isAuthenticated(): boolean {
    return this.customer !== null;
  }

  // getCustomer(): Customer | null {
  //   return this.customer;
  // }


  getCustomer() {
    const customerData = sessionStorage.getItem('customerData');
    if (customerData !== null) {
      const customerN = JSON.parse(customerData);
      // console.log(customerN[0].User_Name)
      return customerN;
      
    }
   
    return null; // or handle the case when customer data is not found
  }

  setCustomer(customer: Customer | null): void {
    this.customer = customer;
    if (customer) {
      sessionStorage.setItem('customerData', JSON.stringify(customer));
    } else {
      sessionStorage.removeItem('customerData');
    }
  }

  getUsername(): string {
    const customer = this.getCustomer();
    return customer ? customer.Mobile_No : '';
  }
  
  logout(): void {
    this.setCustomer(null);
  }

}