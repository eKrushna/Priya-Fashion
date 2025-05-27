import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyAccountComponent } from '../my-account/my-account.component';

@Component({
  selector: 'app-returnrequest',
  standalone: true,
  imports: [CommonModule, MyAccountComponent],
  templateUrl: './returnrequest.component.html',
  styleUrls: ['./returnrequest.component.css'],
})
export class ReturnrequestComponent implements OnInit {
  productId: string | null = null;
  orderId: string | null = null;
  quantity: number | null = null;
  productImage: string | null = null;

  // Dynamic values for refund summary
  itemPrice: number = 0;
  gst: number = 0;
  totalRefund: number = 0;
  price: number = 0;

  today: Date = new Date();
  dropOffDate: Date = new Date();

  constructor(private router: Router, private route: ActivatedRoute) {}

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

          // Calculate total refund
          this.totalRefund = this.itemPrice * this.quantity - this.gst;
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

    // Calculate total refund
    this.totalRefund = this.itemPrice * (this.quantity || 1) - this.gst;

    console.log('Data received:', data);
  }
}
