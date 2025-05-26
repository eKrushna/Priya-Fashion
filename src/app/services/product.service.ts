import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://ppriyafashion.com/business_guru_admin/Product_Display.php';
  public headers = new HttpHeaders().set('Content-Type', 'application/json');
  private cartUpdatedSource = new BehaviorSubject<number>(0);
  cartUpdated = this.cartUpdatedSource.asObservable();
  cartItems: any[] = [];
  SharedService: any;
  public gstat: number = 0;
  public gstRate:number=0;



  private cartItemsSubject = new BehaviorSubject<any[]>([]);
cartItems$ = this.cartItemsSubject.asObservable();
  selectedProductId: any;

  constructor(private http: HttpClient) {
    this.gstat = 0;this.gstRate=0;
    this.loadCart();
    this.cartUpdatedSource.next(this.getUniqueProductCount());
  }

  getProducts(): Observable<any> {
    const body = [{ "Operation": "Display_Operation" }];
    const headers = { 'Content-Type': 'application/json' };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        console.log("API Response:", response); // Debugging API response
        if (!response || response.length === 0) {
          console.error("API returned empty response!");
        } else {
          response.forEach((product: any) => {
            if (!product.Rate) {
              console.warn("⚠️ Missing Rate for product:", product);
            }
          });
        }
        return response;
      }),
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }



  navUrl = 'https://ppriyafashion.com/business_guru_admin/Menu_Operations.php';


  getMenu(): Observable<any> {
    const requestData = [{ Operation: 'Display_Operation' }];
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(this.navUrl, requestData, { headers });
  }

  getProductCodeId(product: any): Observable<string> {
    console.log('Product Data:', product);

    return this.http
      .post<any[]>(this.apiUrl, [
        { Operation: 'Display_Operation', Product_Code_Id: product },
      ])
      .pipe(map((response) => response[0].Product_Code_Id));
  }


  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  loadCart() {
    const storedCart = localStorage.getItem('cart');
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];
    this.cartItemsSubject.next([...this.cartItems]); // Ensure proper update
  }




  addToCart(product: any, quantity: number, selectedSize: string) {
    console.log("🛒 Adding product:", product);

    if (!product.Rate || isNaN(parseFloat(product.Rate))) {
      console.error("❌ Missing or invalid rate for:", product);
      return;
    }

    // Determine if the product is a "Saree"
    const isSaree = product.Menu_Name?.trim().toLowerCase() === 'sarees';

    // If it's not a saree, require a selected size
    if (!isSaree && !selectedSize) {
      console.error("❌ No size selected for:", product);
      window.alert("Please select a size before adding to the cart.");
      return;
    }

    // Check if the item already exists in the cart (considering size for non-sarees)
    const existingItem = this.cartItems.find(
      item => item.name === product.Product_Name && (isSaree || item.size === selectedSize)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem = {
        product_id:product.Product_Code_Id,
        name: product.Product_Name,
        description: product.Short_Description,
        quantity: quantity,
        rate: parseFloat(product.Rate) || 0,
        image: product.Images?.[0]?.P_URL || '',
        size: isSaree ? 'N/A' : selectedSize // Assign 'N/A' for sarees instead of empty string
      };

      this.cartItems.push(cartItem);
    }

    this.saveCart();
    this.cartItemsSubject.next(this.cartItems);

    // Ensure cart count starts from 1 instead of 0
    const updatedCount = this.getUniqueProductCount();
    this.cartUpdatedSource.next(updatedCount);

    console.log("✅ Cart after adding:", this.cartItems);
  }



  removeProduct(productName: string, productSize: string) {
    this.cartItems = this.cartItems.filter(item => !(item.name === productName && item.size === productSize));

    this.cartItemsSubject.next([...this.cartItems]); // Ensure deep copy update
    localStorage.setItem('cart', JSON.stringify(this.cartItems)); // Update storage

    const updatedCount = this.getUniqueProductCount();
    this.cartUpdatedSource.next(updatedCount);

    console.log("✅ Product removed completely. Updated count:", updatedCount);
  }




// ✅ Adjust getUniqueProductCount() method to calculate properly
getUniqueProductCount(): number {
  const cartItems = this.cartItemsSubject.getValue();
  return cartItems ? cartItems.length : 0;
}


  getQuantity(quantity:any): number {
    return quantity;
  }

  getCartItems(): Observable<any[]> {
    console.log("cartItems$",this.cartItems$);
    return this.cartItems$; // This will return the current cart items as an observable

}


calculateSubtotal(item: Product): number {
  const rate = parseFloat(item.Rate) || 0; // Ensure it's a valid number
  const quantity = parseFloat(item.Quantity) || 0;

  if (rate === 0) {
    console.warn("⚠️ Skipping item with zero rate:", item);
  }

  return rate * quantity;
}

  grandTotal: number = 0;

  calculateGrandTotal1() {
    this.grandTotal = this.cartItems.reduce((total, item) => {
      return total + this.SharedService.calculateSubtotal(item);
    }, 0);
  }
  getGstat(): number {
    console.log("gsttat",this.gstat);
    return this.gstat; // Expose gstat as a public getter method
  }

  getRate(): number {
    return this.gstRate; // Expose gstat as a public getter method
  }

  subtotal: number = 0;

  updateSubtotal(): number {
    this.loadCart(); // Ensure cart is loaded before calculation

    const cartItems = this.cartItemsSubject.getValue();

    if (!cartItems || cartItems.length === 0) {
      console.warn("⚠️ Subtotal is still 0, cart may be empty.");
      return 0;
    }

    this.subtotal = cartItems.reduce((total, item) => {
      const rate = parseFloat(item.rate);
      const quantity = parseFloat(item.quantity);

      if (isNaN(rate) || isNaN(quantity) || rate === 0 || quantity === 0) {
        console.warn("⚠️ Missing valid rate or quantity for:", item);
        return total; // Skip invalid items
      }

      return total + (rate * quantity);
    }, 0);

    console.log("✅ Final Subtotal:", this.subtotal);
    return this.subtotal;
  }




 getTotalAmount() {
  return this.subtotal;
}


calculateGrandTotal2(): number {
  this.loadCart(); // Ensure cart is loaded before calculation

  const subtotal = this.updateSubtotal(); // Get updated subtotal
  if (subtotal === 0) {
      console.warn("⚠️ Subtotal is still 0, cart may be empty.");
      return 0;
  }

  let gstRate = subtotal > 1000 ? 12 : 5;
  const gstat = (subtotal * gstRate) / 100;

  this.gstat = gstat;
  this.gstRate = gstRate;

  const grandTotal = subtotal + gstat;

  // console.log("Updated Subtotal:", subtotal);
  // console.log("GST Applied:", gstRate, "%");
  // console.log("GST Amount:", gstat);
  // console.log("Final Grand Total:", grandTotal);

  return grandTotal;
}




   calculateGrandTotal(): number {
    const subtotal = this.updateSubtotal(); // Get the subtotal
    const gst = subtotal
    console.log("this is gst",gst);
    const grandTotal = subtotal  // Calculate the grand total by adding GST to the subtotal

    return grandTotal;
  }

  clearCart() {
    localStorage.removeItem('cart'); // Clear storage
    this.cartItems = []; // Reset cart array
    this.cartItemsSubject.next([...this.cartItems]); // Emit updated cart state
    this.cartUpdatedSource.next(0); // Reset cart count

    console.log("🧹 Cart cleared successfully! Cart count reset to 0.");
  }


  updateCart(updatedCart: any[]) {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  private apiUrlOrder = ' https://ppriyafashion.com/business_guru_admin/S_MTR_Operations.php';

  showorderStatus(showOrderStatusData:any){
    return this.http.post<any>(this.apiUrlOrder, showOrderStatusData, { headers: this.headers });

  }


placeOrderUrl:any="https://ppriyafashion.com/business_guru_admin/S_MTR_Operations.php";
  placeOrder(reqData:any){
    return this.http.post<any>(this.placeOrderUrl,reqData,{ headers: this.headers });
  }

  getOrder(reqData:any){
    const url="https://ppriyafashion.com/business_guru_admin/S_MTR_Operations.php"

  return this.http.post<any>(url,reqData, { headers: this.headers });
  }

  insertorderStatus(postOrderStatusData:any){
    return this.http.post<any>(this.apiUrlOrder, postOrderStatusData, { headers: this.headers });
  }

}
