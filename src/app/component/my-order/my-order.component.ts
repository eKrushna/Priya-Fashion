import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MyAccountComponent } from "../my-account/my-account.component";
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Customer, Product } from '../../models/product';
import { LoginService } from '../../services/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-order',
  imports: [MyAccountComponent,FormsModule,CommonModule],
  templateUrl: './my-order.component.html',
  styleUrl: './my-order.component.css'
})
export class MyOrderComponent  implements OnInit{
    isFormDirty: boolean = false;
    isPdfGeneration: boolean = false;
    onFieldChange() {
      this.isFormDirty = true;
    }
    @ViewChild('content', { static: false }) content!: ElementRef;
    showTable = false;
    delieverdData: any[] = [];
    user: Customer | null = null;
    defaultUrl: any ='https://ppriyafashion.com/business_guru_admin/Product_Image/';
    responseData: any[] = [];
    myForm: FormGroup;
    User_Id: any = '';
    User_Name: any = '';
    Email_Id: any = '';
    Password1: any = '';
    F_Name: any = '';
    L_Name: any = '';
    Mobile_No: any = '';
    Address_1: any = '';
    Address_2: any = '';
    Address_3: any = '';
    Address_4: any = '';
    Address_5: any = '';
    User_Type: any = '';
    Status1: any = '';
    cartItems: Product[] = [];
    quantity: number = 0;
    DeliveryVendor: any = '';
    deliveryDocumentsNo: any = '';
    DeliveryDispatchDate: any = '';
    AboutToReachTime: any = '';
    OtherInformation: any = '';
    orderData: any[] = [];
    orderData2: any[] = [];

    productData: any[] = [
      { name: 'Blue Cotton Suit', price: 2000, qty: 10, size: 'M' },
    ];
    sizeChartModal: boolean = false;
    menuItems: any;
    loading: boolean = true;  // Set loading to true initially
  
    constructor(
      private loginService: LoginService,
      private http: HttpClient,
      public SharedService: ProductService,
      private formBuilder: FormBuilder,
      private router: Router,
    ) {
      this.myForm = this.formBuilder.group({
        // Define other form controls and their validators
      });
      this.extractProductNames();
    }
    showPopupdata: any[] = [];
    ngOnInit(): void {
      this.showdata();
      this.SharedService.getMenu().subscribe((response) => {
        this.menuItems = response;
        console.log('menuitems', this.menuItems);
      });
  
      // Filter the delieverdData to include only delivered products
      this.delieverdData = this.delieverdData.filter((order) =>
        order.S_DTL.some((product: Product) => product.Status1 === 'Delivered')
      );
  
      this.fetchData();
      this.deleteOrder(this.orderData);
  
      this.loginService.response$.subscribe((data:any) => {
        this.responseData = data;
        this.User_Name = this.responseData[0].User_Name;
        // Do something with the response
        console.log('this data from my acc', this.responseData);
      });
  
      const customerDataStr = sessionStorage.getItem('customerData');
      console.log('this is cd', customerDataStr);
      if (customerDataStr) {
        const customerData = JSON.parse(customerDataStr);
        this.F_Name = customerData[0].F_Name;
        this.L_Name = customerData[0].L_Name;
        this.Mobile_No = customerData[0].Mobile_No;
        this.Address_1 = customerData[0].Address_1;
        this.Address_2 = customerData[0].Address_2;
        this.Address_3 = customerData[0].Address_3;
        this.Address_4 = customerData[0].Address_4;
        this.Address_5 = customerData[0].Address_5;
        this.Password1 = customerData[0].Password1;
        this.User_Type = customerData[0].User_Type;
        this.Status1 = customerData[0].Status1;
        this.User_Id = customerData[0].User_Id;
        this.Email_Id = customerData[0].Email_Id;
      }
      this.cartItems = this.SharedService.cartItems;
      this.quantity = this.SharedService.getQuantity(this.quantity);
      console.log('cart:--', this.cartItems);
  
      this.fetchOrederData();
      this.extractProductNames();
    }
  
    TrackDisplay: boolean = false;
  
    TrackPopup(order: any) {
      // Push order data to showPopupdata array
      console.log("hello");
      this.showPopupdata.push(order);
      console.log("track order",this.showPopupdata);
  
      // Set TrackDisplay to true
      this.TrackDisplay = true;
  
      
      this.DeliveryVendor = order?.Delivery_Vendor || 'N/A';
      this.deliveryDocumentsNo = order?.Delivery_Documents_No || 'N/A';
      this.DeliveryDispatchDate = order?.Delivery_Dispatch_Date || 'N/A';
      this.AboutToReachTime = order?.About_To_Reach_Time || 'N/A';
      this.OtherInformation = order?.Other_Information || 'N/A';
  
      this.showOrdersForm = true;
      this.sizeChartModal = true;
    }
  
    showMore = false;
  
    formatProductName(productName: string): string {
      // Use a regular expression to add spaces between words
      return productName.replace(/([a-z])([A-Z])/g, '$1 $2');
    }
  
     
  
    deleteOrder(order: any): void {
      const deleteData = [
        {
          Operation: 'Delete_Operation',
          S_MTR_Id: order.S_MTR_Id,
          appKeyCodeKey: '3939',
          firmCodeKey: '3939',
           
        },
      ];
  
      const requestUrl =
        'https://ppriyafashion.com/business_guru_admin/S_MTR_Operations.php';
  
      this.http.post(requestUrl, deleteData).subscribe(
        (response) => {
           
          console.log('Order deleted successfully', response);
           
          this.fetchOrederData();
        }
         
      );
  
      
      order.S_DTL = [];
    }
  
    showDeleiverdForm: boolean = false;
  
    showProfileForm: boolean = false;
    showOrdersForm: boolean = true;
  
    showProfile(): void {
      this.showProfileForm = true;
      this.showOrdersForm = false;
      this.showDeleiverdForm = false;
    }
  
    showOrders(): void {
      this.showProfileForm = false;
      this.showOrdersForm = true;
      this.showDeleiverdForm = false;
    }
  
    showDeleiverdProduct(): void {
      this.showOrdersForm = false;
      this.showProfileForm = false;
      this.showDeleiverdForm = true;
    }
  
    fetchedDataH: any;
    fetchData() {
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
  
    viewData() {
      const customerDataStr = sessionStorage.getItem('customerData');
  
      if (customerDataStr) {
        const customerData = JSON.parse(customerDataStr);
        console.log(customerData[0].User_Id);
         
        this.User_Id = customerData[0].User_Id;
        this.F_Name = customerData[0].F_Name;
        this.L_Name = customerData[0].L_Name;
        this.Mobile_No = customerData[0].Mobile_No;
        this.Email_Id = customerData[0].Email_Id;
        this.Address_1 = customerData[0].Address_1;
        this.Address_2 = customerData[0].Address_2;
        this.Address_3 = customerData[0].Address_3;
        this.Address_4 = customerData[0].Address_4;
        this.Address_5 = customerData[0].Address_5;
        this.Password1 = customerData[0].Password1;
        this.User_Type = customerData[0].User_Type;
        this.Status1 = customerData[0].Status1;
      }
    }
  
    onSave() {
      if (this.areAllFieldsFilled()) {
        const updatedData = [
          {
            Operation: 'Update_Operation',
            User_Id: this.User_Id,
            Mobile_No: this.Mobile_No,
            User_Name: this.User_Name,
            Email_Id: this.Email_Id,
            Password1: this.Password1,
            F_Name: this.F_Name,
            L_Name: this.L_Name,
            Address_1: this.Address_1,
            Address_2: this.Address_2,
            Address_3: this.Address_3,
            Address_4: this.Address_4,
            Address_5: this.Address_5,
            User_Type: this.User_Type,
            Status1: this.Status1,
          },
        ];
        const requestUrl =
          'https://ppriyafashion.com/business_guru_admin/User_Account_Operations.php';
        console.log('new updatedData', updatedData);
        this.http.post(requestUrl, updatedData).subscribe(
          (response) => {
            console.log('updatedData');
            sessionStorage.setItem('customerData', JSON.stringify(updatedData));
   
            alert(response);
          },
          (error) => {
            
            console.error('Error updating data', error);
            alert(error);
          }
        );
      } else {
         
        alert('Please fill in all required fields before saving.');
      }
    }
  
    selectedItem: string | null = null;
  
    toggleUnderline(item: string) {
      this.selectedItem = this.selectedItem === item ? null : item;
    }
  
    showdata() {
      const customerDataStr = sessionStorage.getItem('customerData');
  
      if (customerDataStr) {
        const customerData = JSON.parse(customerDataStr);
        this.User_Name = customerData[0].User_Name;
        this.User_Id = customerData[0].User_Id;
        this.Status1 = customerData[0].Status1;
      }
  
      const payload = [
        {
          Operation: 'Display_Operation',
          User_Id: this.User_Id,
          Status1: 'Delivered',
          appKeyCodeKey: '3939',
          firmCodeKey: '3939',
        },
      ];
  
      console.log('payload', payload);
  
      this.SharedService.showorderStatus(payload).subscribe(
        (res) => {
          this.selectedItem = 'orders';
  
          this.delieverdData = this.delieverdData.filter((order) =>
            order.S_DTL.some((product: Product) => product.Status1 === 'Delivered')
          );
          
          console.log('this is delieverdData', this.delieverdData);
  
          console.log('Deliver ', this.delieverdData);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  
    viewProduct(product: any): void {
      this.router.navigate(['/product', product]);
    }
  
    
    fetchOrederData() {
      const customerDataStr = sessionStorage.getItem('customerData');
  
      if (customerDataStr) {
        const customerData = JSON.parse(customerDataStr);
        this.User_Name = customerData[0].User_Name;
      }
  
      const reqData = [
        {
          Operation: 'Display_Operation',
          User_Id: this.User_Id,
          appKeyCodeKey: '3939',
          firmCodeKey: '3939',
        },
      ];
  
      console.log('reqOrederData', reqData);
   
      this.SharedService.getOrder(reqData).subscribe(
        (res) => {
          console.log('API Response:', res); // Debug API response
          if (res) {
            this.orderData = res;
            this.orderData2 = res;
            console.log('this is orderData',res);
            this.extractProductNames();
          } else {
            console.warn('Empty response received');
          }
          this.loading = false;
        },
        (error) => {
          console.error('API Error:', error);
        }
      );
      
      
    }
  
   
  
  
    productNames: string[] = [];
  
    private extractProductNames(): void {
      console.log('this.is checking orderdata', this.orderData);
      for (const order of this.orderData) {
        for (const product of order.S_DTL) {
          this.productNames.push(product.name);
          console.log('productNames', this.productNames);
        }
      }
    }
  
    // Inside your component class
    areAllFieldsFilled(): boolean {
      // Check if all required fields have values
      return (
        this.F_Name &&
        this.L_Name &&
        this.Email_Id &&
        this.Mobile_No &&
        this.Address_1 &&
        this.Address_2 &&
        this.Address_3 &&
        this.Address_4 &&
        this.Address_5
      );
    }
}
