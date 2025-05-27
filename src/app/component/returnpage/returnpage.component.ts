import { FooterComponent } from './../footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MyAccountComponent } from "../my-account/my-account.component";


@Component({
  selector: 'app-returnpage',
  imports: [CommonModule, FormsModule, MyAccountComponent],
  templateUrl: './returnpage.component.html',
  styleUrls: ['./returnpage.component.css'],
  animations: [
    trigger('foldUnfold', [
      state('unfolded', style({
        height: '*',
        opacity: 1,
        overflow: 'visible',
        paddingTop: '*',
        paddingBottom: '*',
        marginTop: '*',
        marginBottom: '*'
      })),
      state('folded', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
        paddingTop: '0px',
        paddingBottom: '0px',
        marginTop: '0px',
        marginBottom: '0px'
      })),
      transition('unfolded <=> folded', [
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
    ])
  ]
})
export class ReturnpageComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router // <-- inject Router here
  ) {
    this.SharedService = productService;
  }

  reasons = [
    { id: 1, label: 'Wrong size' },
    { id: 2, label: 'Damaged item' },
    { id: 3, label: 'Other' }
  ];
  selectedReasonLabel: string = '';
  otherReason: string = '';
  public SharedService: ProductService;

  orderData: any[] = [];
  orderData2: any[] = [];
  selectedOrder: any = null;
  selectedProduct: any = null;
  selectedQuantity: number = 1;
  isFolded: boolean = false;
  selectedAction: string = '';

  quantityOptions: number[] = [];

  onReasonChange(event: any) {
    const selectedId = event.target.value;
    const selected = this.reasons.find(r => r.id == selectedId);
    this.selectedReasonLabel = selected ? selected.label : '';
  }

  ngOnInit(): void {
    this.fetchReturnResons();
    this.fetchOrderDetails();
  }

  fetchReturnResons() {
    this.http.get<{ returnReasons: any[] }>('../../../assets/JSON/ReturnResons.json')
      .subscribe(
        (response) => {
          this.reasons = response.returnReasons;
          console.log(this.reasons);
        },
        (error) => {
          console.error('Error fetching return reasons:', error);
        }
      );

    console.log("Fetching return reasons from local JSON...");

  }

  fetchOrderDetails() {
    // Get productId from query params
    const productId = this.route.snapshot.queryParamMap.get('productId');
    // Prepare request data as you already do
    let userId = '';
    const customerDataStr = sessionStorage.getItem('customerData');
    if (customerDataStr) {
      const customerData = JSON.parse(customerDataStr);
      userId = customerData[0]?.User_Id || '';
    }
    const reqData = [
      {
        Operation: 'Display_Operation',
        User_Id: userId,
        appKeyCodeKey: '3939',
        firmCodeKey: '3939',
      },
    ];

    this.SharedService.getOrder(reqData).subscribe(
      (res) => {
        this.orderData = res;
        // Find the order and product by productId
        let found = false;
        for (const order of this.orderData) {
          const foundProduct = order.S_DTL.find((p: any) => p.Product_Code_Id == productId);
          if (foundProduct) {
            this.selectedOrder = order;
            this.selectedProduct = foundProduct;
            found = true;
            break;
          }
        }
        // If not found, fallback to first order/product
        if (!found && this.orderData.length > 0 && this.orderData[0].S_DTL.length > 0) {
          this.selectedOrder = this.orderData[0];
          this.selectedProduct = this.selectedOrder.S_DTL[0];
        }

        // After fetching selectedProduct, set selectedQuantity to its Quantity
        if (this.selectedProduct) {
          const qty = Number(this.selectedProduct.Quantity) || 1;
          this.quantityOptions = Array.from({ length: qty }, (_, i) => i + 1);
          this.selectedQuantity = 1; // Always default to 1
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  onContinue() {
    this.isFolded = true;
  }
  onUnfold() {
    this.isFolded = false;
  }
  onProceed() {
    console.log('Selected Product:', this.selectedProduct);

    if (!this.selectedProduct) {
      console.error('No product selected');
      return;
    }

    const requestData = {
      productId: this.selectedProduct.Product_Code_Id,
      orderId: this.selectedOrder?.S_MTR_Id,
      quantity: this.selectedQuantity,
      image: this.selectedProduct.Images?.[0]?.P_URL,
      itemPrice: this.selectedProduct.P_Rate,
      gst: this.selectedProduct.GST || 0,
    };

    console.log('Sending data:', requestData);

    // For reliable data transfer, use both state and queryParams
    if (!this.isFormValid() || !this.isActionValid()) {
      console.error('Form is invalid or action is not selected');
      return;
    }

    if (this.selectedAction === 'return') {
      this.router.navigate(['/returnrequest'], {
        state: { data: requestData },
        queryParams: requestData
      });
    } else if (this.selectedAction === 'replace') {

      this.router.navigate(['/replacerequest'], {
        state: { data: requestData },
        queryParams: requestData
      });
    }
  }

  isFormValid(): boolean {
    // Add other required fields as needed
    const reasonValid: boolean = !!this.selectedReasonLabel && (this.selectedReasonLabel.toLowerCase() !== 'other' || !!this.otherReason);
    return !!this.selectedQuantity && !!this.selectedReasonLabel && reasonValid;
  }

  isActionValid(): boolean {
    return !!this.selectedAction;
  }
}

