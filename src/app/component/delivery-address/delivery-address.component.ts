import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyAccountComponent } from "../my-account/my-account.component";
import { Customer, Product } from '../../models/product';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
declare var Razorpay: any;

interface RazorpayResponse {
  razorpay_payment_id: string;
  error?: {
    code: string;
    description: string;
  };
}
@Component({
  selector: 'app-delivery-address',
  imports: [MyAccountComponent,FormsModule,CommonModule],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.css'
})
export class DeliveryAddressComponent {





//   addressForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private loginService: LoginService,
//     private router: Router
//   ) {
//     this.addressForm = this.fb.group({
//       address1: ['', Validators.required],
//       address2: [''],
//       city: ['', Validators.required],
//       state: ['', Validators.required],
//       zip: ['', Validators.required],
//       country: ['', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     this.loadSavedAddress();
//   }

//   loadSavedAddress(): void {
//     this.loginService.getUserAddress().subscribe({
//       next: (address) => {
//         if (address) {
//           this.addressForm.patchValue(address);
//         }
//       },
//       error: (err) => {
//         console.error('Error loading address:', err);
//       },
//     });
//   }

// saveAddress(): void {
//   if (this.addressForm.valid) {
//     this.loginService.saveUserAddress(this.addressForm.value).subscribe({
//       next: (response) => {
//         console.log('Address saved successfully:', response);

//         localStorage.setItem('userAddress', JSON.stringify(this.addressForm.value));
//       },
//       error: (err) => {
//         console.error('Error saving address:', err);

//       }
//     });
//   }
// }


   isFormDirty: boolean = false;
   isAddressFieldsEnabled = false;
   debounceTimer: any;
   isPdfGeneration: boolean = false;
   hasShownInvalidDistrictAlert: boolean = false;
   previousDistrict: string = '';
   onFieldChange() {
     this.isFormDirty = true;
     if (this.Address_1 && this.Address_1.length === 6) {
      this.fetchAddressFromPincode();
    }

   }
   @ViewChild('content', { static: false }) content!: ElementRef;
   showTable = false;
   delieverdData: any[] = [];
   user: Customer | null = null;
   defaultUrl: any =
     'https://ppriyafashion.com/business_guru_admin/Product_Image/';

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

   productData: any[] = [
     { name: 'Blue Cotton Suit', price: 2000, qty: 10, size: 'M' },
   ];
   sizeChartModal: boolean = false;
   menuItems: any;

   constructor(
     private loginService: LoginService,
     private http: HttpClient,
     public SharedService: ProductService,
     private formBuilder: FormBuilder,
     private router: Router
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

     this.loginService.response$.subscribe((data) => {
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
     this.showPopupdata.push(order);
     console.log(this.showPopupdata);

     // Set TrackDisplay to true
     this.TrackDisplay = true;

     const Order = this.showPopupdata[this.showPopupdata.length - 1];
     this.DeliveryVendor = Order?.Delivery_Vendor;
     this.deliveryDocumentsNo = Order?.Delivery_Documents_No;
     this.DeliveryDispatchDate = Order?.Delivery_Dispatch_Date;
     this.AboutToReachTime = Order?.About_To_Reach_Time;
     this.OtherInformation = Order?.Other_Information;

     // alert(`          Delivery Details

     //         Delivery Vendor : ${DeliveryVendor}
     //         Delivery Documents No: ${deliveryDocumentsNo}
     //         Delivery Dispatch Date:${Delivery_Dispatch_Date}
     //         About To Reach Time :${AboutToReachTime}
     //         Other Information:${OtherInformation}`);

     // Optionally, you can set showOrdersForm to false if needed
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
         // Add other properties needed for the delete operation
       },
     ];

     const requestUrl =
       'https://ppriyafashion.com/business_guru_admin/S_MTR_Operations.php';

     this.http.post(requestUrl, deleteData).subscribe(
       (response) => {
         // Handle the success response
         console.log('Order deleted successfully', response);
         // You might want to refresh the order data after deletion
         this.fetchOrederData();
       }
       // (error) => {
       //   // Handle the error response
       //   console.error('Error deleting order', error);
       //   alert(error);
       // }
     );

     // Remove the S_DTL array from the order object
     order.S_DTL = [];
   }

   showDeleiverdForm: boolean = false;

   showProfileForm: boolean = true;
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
     // Prepare the data to be sent in the POST request
     const postData = [
       {
         operation: 'Display_Operation',
         userId: this.User_Id, // Replace this with the actual user ID
       },
     ];
     console.log('fetched UID', postData);

     // Make the HTTP POST request
     const requestUrl =
       'https://ppriyafashion.com/business_guru_admin/WISH_LIST.php';
     const headers = new HttpHeaders().set('Content-Type', 'application/json');
     this.http.post<any[]>(requestUrl, postData, { headers }).subscribe(
       (response) => {
         // Handle the success response
         this.fetchedDataH = response;
         console.log('Fetched Data:', this.fetchedDataH);
       },
       (error) => {
         // Handle the error response
         console.error('Error fetching data:', error);
       }
     );
   }

   viewData() {
     const customerDataStr = sessionStorage.getItem('customerData');

     if (customerDataStr) {
       const customerData = JSON.parse(customerDataStr);
       console.log(customerData[0].User_Id);
       // Access the individual properties from customerData
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

           // Handle the success response
           // console.log('Data updated successfully', response);
           alert(response);
         },
         (error) => {
           // Handle the error response
           console.error('Error updating data', error);
           alert(error);
         }
       );
     } else {
       // Display a message or prevent the form submission
       alert('Please fill in all required fields before saving.');
     }
   }

   onDistrictChange(district: string) {
    this.Address_2 = district;

    if (!district || district.length < 3) {
      this.clearAddressFields();
      return;
    }

    // Debounce API call to prevent unnecessary requests
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.fetchCityAndStateFromDistrict();
    }, 500);
  }

  fetchCityAndStateFromDistrict() {
    const district = this.Address_2?.trim().toLowerCase();

    if (!district || district.length < 3) {
      this.clearAddressFields();
      return;
    }

    this.http.get<any[]>(`https://api.postalpincode.in/postoffice/${district}`).subscribe({
      next: (data) => {
        const postOffices = data[0]?.PostOffice;
        const status = data[0]?.Status;

        if (status === 'Success' && postOffices && postOffices.length > 0) {
          const filteredPOs = postOffices.filter((po: any) =>
            po.District.toLowerCase() === district
          );

          const nonMatchingCities = filteredPOs.filter((po: any) =>
            po.Name.toLowerCase() !== district
          );

          const mainPO = nonMatchingCities[0] || filteredPOs[0] || postOffices[0];

          if (mainPO) {
            this.Address_4 = mainPO.Name; // City
            this.Address_5 = mainPO.State; // State
            this.isAddressFieldsEnabled = true;
            this.hasShownInvalidDistrictAlert = false; // ✅ Reset on success
          } else {
            this.showSingleAlert("Could not find a valid city name for the given district.");
            this.clearAddressFields();
          }
        } else {
          this.showSingleAlert("Could not find a valid city name for the given district.");
          this.clearAddressFields();
        }
      },
      error: (err) => {
        console.error('Error fetching city/state from district:', err);
        this.showSingleAlert('Failed to fetch city/state. Please try again.');
        this.clearAddressFields();
      }
    });
  }

  clearAddressFields() {
    this.Address_4 = '';
    this.Address_5 = '';
    this.isAddressFieldsEnabled = false;
  }

  showSingleAlert(message: string) {
    if (!this.hasShownInvalidDistrictAlert) {
      alert(message); // Or replace with toastr.warning if using ngx-toastr
      this.hasShownInvalidDistrictAlert = true;
    }
  }


fetchAddressFromPincode() {
  if (!this.Address_1 || this.Address_1.length !== 6) {
    alert('Please enter a valid 6-digit pin code.');
    return;
  }

  this.http.get<any[]>(`https://api.postalpincode.in/pincode/${this.Address_1}`).subscribe({
    next: (data) => {
      const postOffice = data[0]?.PostOffice?.[0];
      if (postOffice) {
        this.Address_4 = postOffice.District; // City
        this.Address_5 = postOffice.State;    // State
      } else {
        alert('Invalid Pin Code. Please enter a valid one.');
      }
    },
    error: (err) => {
      console.error('Error fetching city/state from pincode:', err);
    }
  });
}

onPincodeChange(value: string): void {
  this.Address_1 = value;

  if (!value || value.length < 6) {
    this.Address_4 = ''; // Clear City
    this.Address_5 = ''; // Clear State
    this.isAddressFieldsEnabled = false;
  }

  this.onFieldChange(); // If you still want to track field changes
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

         this.delieverdData = res.filter((order: { S_DTL: Product[] }) =>
           order.S_DTL.some(
             (product: Product) => product.Status1 === 'Delivered'
           )
         );
         console.log('this is delieverdData', this.delieverdData);

         console.log('Deliver ', this.delieverdData);
       },
       (error) => {
         console.log(error);
       }
     );
   }

   viewProduct(index: any): void {
     // this.showProductShowcase = false;

     this.router.navigate(['/products', index]);
     // [routerLink]="['/product', product.Product_Code_Id]"
   }

   orderData: any[] = [];
   orderData2: any[] = [];
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

     //  const headers=new HttpHeaders().set("contentType","application/json");
     //  const url="https://savrajaipur.com/business_guru_admin/S_MTR_Operations.php"
     this.SharedService.getOrder(reqData).subscribe(
       (res) => {
         this.orderData = res;
         this.orderData2 = res;
         console.log('this is orderData', this.orderData);
       },
       (error) => {
         console.log(error);
       }
     );
   }

   productNames: string[] = [];

   private extractProductNames(): void {
     console.log('this.is checking orderdata', this.orderData);
     for (const order of this.orderData) {
       for (const product of order.S_DTL) {
         this.productNames.push(product.Product_Name);
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
