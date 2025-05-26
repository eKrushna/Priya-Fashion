import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Add this import

@Component({
  selector: 'app-returnrequest',
  standalone: true, // <-- If using standalone components
  imports: [CommonModule], // <-- Add CommonModule here
  templateUrl: './returnrequest.component.html',
  styleUrls: ['./returnrequest.component.css']
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

  today: Date = new Date();
  dropOffDate: Date = new Date();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.queryParamMap.get('productId');
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');
    this.quantity = Number(this.route.snapshot.queryParamMap.get('quantity'));
    this.productImage = this.route.snapshot.queryParamMap.get('image');

    // Example: fetch these values from API or service
    this.itemPrice = 2521 * (this.quantity || 1);
    this.gst = 630 * (this.quantity || 1);

    // GST should be subtracted from the refund
    this.totalRefund = this.itemPrice - this.gst;

    // Example: drop off date is 5 days from today
    this.dropOffDate = new Date();
    this.dropOffDate.setDate(this.today.getDate() + 5);
  }
}
