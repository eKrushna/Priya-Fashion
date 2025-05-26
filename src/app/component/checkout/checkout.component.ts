import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Customer, Product } from '../../models/product';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';

declare var Razorpay: any;


interface RazorpayResponse {
  razorpay_payment_id: string;
  error?: {
    code: string;
    description: string;
  };
}

@Component({
  selector: 'app-checkout',
  imports: [FormsModule,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
   //gstat: number = 0 ; 
  user: Customer | null = null;
  defaultUrl:any="https://ppriyafashion.com/business_guru_admin/Product_Image/";
  isDirectPurchase: boolean = false;
  product: any;
  totalMRP: number = 0;
  discount: number = 0;
  totalAmount: number = 0;
  gstAmount: number = 0;  // ✅ Added missing property
  totalWithGST: number = 0; // ✅ Added missing property

  responseData: any[] = [];
  myForm: FormGroup;
  User_Id: any = ''; // Add other required properties and provide initial values
  User_Name: any = '';
  Password1: any = '';
  F_Name: any = '';
  L_Name: any = '';
  Email_Id:any=''; 
  Mobile_No:any = '';
  Address_1: any = '';
  Address_2: any = '';
  Address_3: any = '';
  Address_4: any = '';
  Address_5: any = '';
  User_Type:any = '';
  Status1: any= ''; 
  Gst_Amt: any ='';
  Gst_Amt1: any ='';
  S_Amt:any='';
  Gst:any='';
  Item_Amt='';
  S_G_Amt:any='';
  MRP:any='';
  Rate='';
  P_Rate='';
  cartItems: any[] = [];
  quantity: number = 0;
  showAddressForm = true;
  isPaymentModeSelected: boolean = false;


  selectedPaymentMethod: string | null = null; // Initialize with an empty value



  paymentRequest!: google.payments.api.PaymentDataRequest
  gstat: any;
  Item_Net_Amt: any;

  selectedState: string = '';
  selectedCity: string = '';
  filteredCities: string[] = [];
  
  locality: string = '';
  pinCode: string = '';
  address: string = '';

   // List of states
   states: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];
  
  constructor(private router: Router,private loginService:LoginService,private http: HttpClient,private cartService: ProductService,public SharedService:ProductService,
    private formBuilder: FormBuilder) {this.myForm = this.formBuilder.group({

     
      
      
      // Define other form controls and their validators
    });}
   
  

  ngOnInit(): void {
    const directItem = localStorage.getItem('directCheckoutItem');

    if (directItem) {
      this.cartItems = JSON.parse(directItem);
      console.log("Direct checkout item:", this.cartItems);
      
      localStorage.removeItem('directCheckoutItem'); // Optional: clear after use
    } else {
      this.cartService.getCartItems().subscribe((items) => {
        this.cartItems = items;
      });
    }
    
    // Retrieve the product details passed through state
    const navigation = window.history.state;
    if (navigation && navigation.product) {
      this.product = navigation.product;
      console.log('Product info:', this.product);
    }
    this.loginService.response$.subscribe(data => {
      this.responseData = data;
      if (this.responseData && Array.isArray(this.responseData) && this.responseData.length > 0) {
        this.User_Name = this.responseData[0].User_Name;
      } else {
        console.error("responseData is null, undefined, or empty", this.responseData);
      }
      
      // Do something with the response 
      console.log("this data from my acc", this.responseData)
      this.cartItems = this.SharedService.cartItems;

    });

    const customerDataStr = sessionStorage.getItem('customerData');
    console.log("this is cd",customerDataStr);
    if (customerDataStr) {
      const customerData = JSON.parse(customerDataStr);
      this.F_Name = customerData[0].F_Name;
      this.L_Name = customerData[0].L_Name;
      this.Email_Id = customerData[0].Email_Id;
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
      this.User_Name=customerData[0].User_Name
      this.S_Amt =this.SharedService.calculateGrandTotal2();
      this.Gst_Amt=this.SharedService.getGstat();
      // this.Gst_Amt =this.SharedService.calculateGrandTotal2();
      this.Gst=this.SharedService.getRate();
      this.S_G_Amt=this.SharedService.calculateGrandTotal()
      


    }
    this.loadCart();
  }


  loadCart() {
    this.SharedService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      console.log("Cart Items Loaded:", this.cartItems);
    });
  }

  getHoveredImageUrl(product: any): string {
    if (product?.Images && product.Images.length > 0 && product.Images[0]?.P_URL) {
      return 'https://ppriyafashion.com/business_guru_admin/Product_Image/' + product.Images[0].P_URL;
    }
    return 'https://ppriyafashion.com/business_guru_admin/Product_Image/default.jpg'; // Provide a fallback image
  }

  
  calculateGrandTotal(): number {
    const subtotal = this.updateSubtotal(); // Get the subtotal
    const gst = subtotal  
    console.log("this is gst",gst);
    const grandTotal = subtotal  // Calculate the grand total by adding GST to the subtotal
  
    return grandTotal;
  }

  subtotal: number = 0;

  updateSubtotal(): number {
  

    this.subtotal = 0; // Reset subtotal to 0 before calculating

  
    for (let i = 0; i < this.cartItems.length; i++) {
      const rate = parseFloat(this.cartItems[i].rate)*parseFloat(this.cartItems[i].quantity); // Convert Rate to a number
      this.subtotal += rate;
    }

  return this.subtotal;
  }
  
  showProfileForm: boolean = true;
  showOrdersForm: boolean = false;

  showProfile(): void {
    this.showProfileForm = true;
    this.showOrdersForm = false;
  }

  showOrders(): void {
    this.showProfileForm = false;
    this.showOrdersForm = true;
  }

  viewData(){
    const customerDataStr = sessionStorage.getItem('customerData');
    
    if (customerDataStr) {
      const customerData = JSON.parse(customerDataStr);
      console.log(customerData[0].User_Id);
      // Access the individual properties from customerData
      this.User_Id = customerData[0].User_Id;
      this.F_Name = customerData[0].F_Name;
      this.L_Name = customerData[0].L_Name;
      this.Email_Id = customerData[0].Email_Id;
      this.Mobile_No = customerData[0].Mobile_No;
      this.Address_1 = customerData[0].Address_1;
      this.Address_2 = customerData[0].Address_2;
      this.Address_3 = customerData[0].Address_3;
      this.Address_4 = customerData[0].Address_4;
      this.Address_5 = customerData[0].Address_5;
      this.Password1 = customerData[0].Password1;
      this.User_Type = customerData[0].User_Type;
      this.Status1 = customerData[0].Status1;
      this.Gst_Amt = customerData[0].Gst_Amt1;
      // this.Gst_Amt1 = customerData[0].Gst_Amt1;
    }
  }
  cartItem: any; // Declare the cartItem variable
S_DTLdata:any[]=[];

generateJsonS_DTL() {
  const customerDataStr = sessionStorage.getItem('customerData');
  const customerData = customerDataStr ? JSON.parse(customerDataStr) : null;
  for (let i = 0; i < this.cartItems.length; i++) {
    const cartItem = this.cartItems[i];
    const sdtlItem = {
      P_Rate: cartItem.rate,
      Product_Code_Id: cartItem.product_id,
      Product_Name: cartItem.name,
      MRP:cartItem.MRP,
      Rate:cartItem.rate,
      User_Id:  customerData[0].User_Id,
      Images: cartItem.image,
      Firm_Code:"3939",
      App_Code:"3939",
      Unit:"0",
      Qty:cartItem.quantity,
      Offer_Qty:"0",
      Disc:"0", 
      Disc_Amt:"0", 
      Gst:"0", 
      Gst_Amt:this.Gst_Amt, 
      Item_Amt:cartItem.Item_Amt, 
      Item_Net_Amt:cartItem.Item_Net_Amt,
      firmCodeKey:"3939",
      appKeyCodeKey:"3939",
      Round_off:"0" ,
      Size1:cartItem.size

    };
    this.S_DTLdata.push(sdtlItem);
    
  }
  
  console.log("sdtlData data:", this.S_DTLdata)
  
}

showPaymentSection = false;

  updatedData:any[]=[]
  onSave() {
    const currentDate = new Date();
const formattedDate = this.formatDate(currentDate);

    this.showAddressForm = !this.showAddressForm;
   // Gather and update the data from the form
   this.updatedData = [
    {
      
      Operation: 'Insert_Operation',
      Invoice_Date :formattedDate,
      

      User_Id: this.User_Id,
      User_Name: this.User_Name,
      // F_Name: this.F_Name,
      // L_Name: this.L_Name,
      // Total_Qty:this.quantity,
      S_Amt:this.S_Amt,
      S_G_Amt:this.S_G_Amt,
      Round_Off:"0",
      Disc:"0",
      Disc_Amt:"0",
      Gst:this.Gst,
      Gst_Amt:this.Gst_Amt,
      Dely_Charge:"0",
      Dely_Id:"0",
      // Mobile_No: this.Mobile_No,
      Spng_Add1: this.Address_1,
      Spng_Add2: this.Address_2,
      Spng_Add3: this.Address_3,
      Spng_Add4: this.Address_4,
      // Address_5: this.Address_5,
      // User_Type: this.User_Type,
      // Status1: this.Status1,
      Payment_Mode:"Online",
      firmCodeKey:"3939",
      appKeyCodeKey:"3939",
      S_DTL: this.S_DTLdata
    }
  ];
this.generateJsonS_DTL();

  
    // const requestUrl = 'http://savrajaipur.com/business_guru_admin/User_Account_Operations.php';
  console.log('Shipping Details : -',this.updatedData)
    // this.http.post(requestUrl, updatedData).subscribe(
    //   (response) => {

    //     sessionStorage.setItem('customerData', JSON.stringify(updatedData));

    //     // Handle the success response
    //     console.log('Data updated successfully', response);
    //     alert(response);
    //   },
    //   (error) => {
    //     // Handle the error response
    //     console.error('Error updating data', error);
    //     alert(error);
    //   }
    // );
  }
  Product_Code_Id='';
  Product_Name='';
  Quantity='';
  

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }
  

uploadtoServer()
{
console.log(this.updatedData);

const currentDate = new Date();
const formattedDate = this.formatDate(currentDate);
  
  
const data=[{"Operation":"Insert_Operation","Invoice_Date":formattedDate
  ,  "User_Id":this.User_Id, "User_Name":this.User_Name,
   "Total_Qty":"0", "S_Amt":this.S_Amt,"S_G_Amt":this.S_G_Amt,"Round_Off":"0","Disc":"0"
   ,"Disc_Amt":"0","Gst":this.Gst,"Gst_Amt":this.Gst_Amt
   ,"Dely_Charge":"0","Dely_Id":"0","Spng_Add1": this.Address_1,
   "Spng_Add2":this.Address_2,"Spng_Add3": this.Address_3,"Spng_Add4": this.Address_4,
   "Payment_Mode":"Online","firmCodeKey":"3939","appKeyCodeKey":"3939",
   "S_DTL":[{"Product_Code_Id":this.Product_Code_Id, "Product_Name":this.Product_Name, 
   "Unit":"0", "MRP":this.MRP, "Rate":this.Rate, "P_Rate":this.P_Rate, "Qty":this.Quantity, 
   "Offer_Qty":"0", "Disc":"0", "Disc_Amt":"0", "Gst":this.Gst, 
   "Gst_Amt":this.Gst_Amt, "Item_Amt":this.Item_Amt, "Item_Net_Amt":this.Item_Net_Amt, 
   "Round_off":"0", "User_Id":this.User_Id,"firmCodeKey":"3939","appKeyCodeKey":"3939"
   }]}]

   console.log("data",data);


    this.SharedService.placeOrder(this.updatedData).subscribe((res)=>{
             
               alert("Order Placed Successfully !");
              console.log("placed data",this.updatedData);
              this.router.navigate(['/']);
               this. clearCart();
              
  },(error)=>{
    console.error(error);

  });

}

showMore = false;

  onLoadPaymentData(event:any) {
    console.log("load payment data", event.detail);
  }

  onPaymentModeSelected(paymentMode: string) {
    this.isPaymentModeSelected = true;
    this.updatedData[0].Payment_Mode = paymentMode; // Set the selected payment mode
    console.log('Payment mode selected:', paymentMode, this.updatedData);
  }
  
  initiatePayment() {
     const grandTotal = this.SharedService.calculateGrandTotal();
      const options = {   
      key: 'rzp_test_MALELw5Ltiwdxs',
      amount: grandTotal * 100, // Amount in paisa (100 paisa = 1 rupee)
      currency: 'INR',
      image:'assets/pinkLogo.jpeg',
      name: 'Priya Fashion',
      description: 'Payment for Order',
      // order_id: orderId,
      prefill: {
        name: 'DINESH GANGWAL', // Remove the spaces before the name
        email: 'eshgangwal42@gmail.com',
        contact: '8104769827',
      },
      
      notes: {
        address: '171/3 Haldighati Marg, Pratap Nagar, Sanganer, Jaipur - 302022',
        // merchant_order_id: orderId,
      },
      theme: {
        color: '#DB185E',
      },
      handler: (response:any) => {
        console.log('Razorpay response:', response);
        
        if (response.razorpay_payment_id) {
          // Payment success logic
          console.log('Payment successful! Payment ID:', response.razorpay_payment_id);
        } else if (response.error) {
          // Payment failed logic
          console.log('Payment failed! Reason:', response.error.description);
        }
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
  clearCart() {
    this.cartItems = [];
    this.SharedService.clearCart(); // Call the clearCart() method in the ProductService

  }

toggleCOD(): void {
  if (this.selectedPaymentMethod === 'COD') {
    this.selectedPaymentMethod = null;
    this.isPaymentModeSelected = false;
  } else {
    this.selectedPaymentMethod = 'COD';
    this.isPaymentModeSelected = true;
  }
}
}
