import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyAccountComponent } from '../my-account/my-account.component';

@Component({
  selector: 'app-replacerequest',
  standalone: true,
  imports: [CommonModule, FormsModule, MyAccountComponent],
  templateUrl: './replacerequest.component.html',
  styleUrls: ['./replacerequest.component.css'],
})
export class ReplacerequestComponent implements OnInit {
  productId: string | null = null;
  orderId: string | null = null;
  quantity: number | null = null;
  productImage: string | null = null;

  // Dynamic values for replacement summary
  itemPrice: number = 0;
  gst: number = 0;
  price: number = 0;

  // Replacement specific fields
  selectedReason: string = '';
  otherReasonText: string = '';
  selectedSize: string = '';
  availableSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  today: Date = new Date();
  dropOffDate: Date = new Date();

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Try to get data from router state first
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras?.state?.['data'];

    if (stateData) {
      this.setData(stateData);
    } else {
      console.warn('No state data found, trying URL query parameters instead');
      // Fallback to URL query parameters
      this.route.queryParams.subscribe((params) => {
        if (Object.keys(params).length > 0) {
          this.productId = params['productId'];
          this.orderId = params['orderId'];
          this.quantity = Number(params['quantity']) || 1;
          this.productImage = params['image'];
          this.itemPrice = Number(params['itemPrice']) || 0;
          this.gst = Number(params['gst']) || 0;
        } else {
          console.error('No data available in either state or query parameters');
        }
      });
    }

    // Set drop-off date to 5 days from now
    this.dropOffDate.setDate(this.today.getDate() + 5);
  }

  private setData(data: any): void {
    this.productId = data.productId;
    this.orderId = data.orderId;
    this.quantity = data.quantity;
    this.productImage = data.image;
    this.itemPrice = data.itemPrice ?? 0;
    this.gst = data.gst ?? 0;
    this.price = data.price ?? 0;

    console.log('Data received:', data);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  onReasonChange(): void {
    // Clear size selection if reason is not 'size'
    if (this.selectedReason !== 'size') {
      this.selectedSize = '';
    }
  }

  isFormValid(): boolean {
    if (!this.selectedReason) return false;

    // If reason is 'other', require text explanation
    if (this.selectedReason === 'other' && !this.otherReasonText) {
      return false;
    }

    // If reason is 'size', require size selection
    if (this.selectedReason === 'size' && !this.selectedSize) {
      return false;
    }

    return true;
  }

  confirmReplacement(): void {
    if (!this.isFormValid()) {
      alert('Please complete all required information');
      return;
    }

    // In a real application, you would send this data to your backend
    const replacementData = {
      productId: this.productId,
      orderId: this.orderId,
      quantity: this.quantity,
      reason: this.selectedReason,
      otherReason: this.otherReasonText,
      newSize: this.selectedSize,
    };

    console.log('Replacement request submitted:', replacementData);
    alert('Your replacement request has been submitted successfully!');

    // Navigate to a success page or back to orders
    // this.router.navigate(['/replacement-success']);
  }
}
