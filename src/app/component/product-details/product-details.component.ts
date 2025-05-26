import { CommonModule } from '@angular/common';
import { Component, ViewChildren, QueryList, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Product } from '../../models/product';
declare var bootstrap: any;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product: any;
  productdata:any[]=[];
  productdetail: any = {};
   isOutOfStock: boolean = false;
  defaultUrl: string = 'https://ppriyafashion.com/business_guru_admin/Product_Image/';
  selectedProduct: any;
  selectedImage: string | undefined;
  productCID: string | undefined;
  isZoomed: any;
  fullScreenImageUrl: string = '';
  isFullScreenImageVisible: boolean = false;
  productCodeId!: number;
  currentIndex: number = 0;
 selectedSize: string = '';
 //selectedSize: string = 'Small';
 selectedRate: number = 0;
selectedMRP: number = 0;

  showStickyBar = false;
  lastScrollTop = 0;
  @ViewChild('productCarousel', { static: false }) productCarousel!: ElementRef;
  @ViewChild('checkButtonRef', { static: false }) checkButtonRef!: ElementRef;


  @ViewChildren('largeImageRef') largeImages!: QueryList<ElementRef>;
@ViewChildren('smallImageRef') smallImages!: QueryList<ElementRef>;

currentImageIndex: number = 0;
isStickyBarVisible = false;
selectedProductImage = ''; // Image for sticky bar

// Listen to Window Scroll
ngAfterViewInit() {
  if (this.productdetail?.Sizes?.length && this.productdetail.Product_Name !== 'Saree') {
    const defaultSize = this.productdetail.Sizes.find((size: any) => size.Size_Name === 'Small');
    if (defaultSize) {
      this.selectedRate = defaultSize.Rate;
      this.selectedMRP = defaultSize.MRP;
      this.selectedSize = defaultSize.Size_Name;
    }
  }
  this.onScroll(); // Check initial visibility
}

// Example: Assign Product Data (Adjust based on API data)
selectProduct(product: any) {
  this.selectedProduct = product;
  this.selectedProductImage = product.Images?.[0]?.P_URL;
}


  constructor(private sanitizer: DomSanitizer,private route: ActivatedRoute,private productservice:ProductService,private router:Router,private loginservice:LoginService) {
  }

  isSizeChartOpen = false;
  quantity = 1;

  openSizeChart() {
    this.isSizeChartOpen = true;
  }



  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getHoveredImageUrl(product: any): string {
    return this.defaultUrl + product.Images[0]?.P_URL;
  }
  proceedToCheckout(product: any) {
    // Pass the product details directly to the checkout page
    this.router.navigate(['/checkout'], { state: { product: product } });
  }




  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Raw Route Parameters:', params);
      this.productCodeId = parseInt(params['id'], 10);
      console.log('Parsed Product Code ID:', this.productCodeId);

      this.productservice.getProducts().subscribe({
        next: (data) => {
          console.log('Product Data:', data);
          this.productdata = data;

          const productDetail = this.productdata.find(
            (p) => p.Product_Code_Id.toString() === this.productCodeId?.toString()
          );

          if (productDetail) {
            this.productdetail = productDetail; // Store productDetail if needed elsewhere

            const isSaree = productDetail.Menu_Name?.trim().toLowerCase() === 'saree';

            if (isSaree) {
              // For Saree, use the product rate directly (no need for size selection)
              this.selectedRate = productDetail.Rate;
            } else if (productDetail.Sizes && productDetail.Sizes.length > 0) {
              const defaultSize = productDetail.Sizes.find((s: { Size_Name: string; Rate?: number; MRP?: number }) => s.Size_Name === 'Small');
              this.selectSize(defaultSize);
            } else {
              // No sizes, fallback to product-level rate
              this.selectedRate = productDetail.Rate;
            }
          }
        },
        error: (err) => {
          console.error('Failed to fetch products:', err);
        }
      });
    });

    if (this.productCarousel) {
      new bootstrap.Carousel(this.productCarousel.nativeElement, {
        interval: 1000,
        ride: 'carousel'
      });
    }
  }




  selectedImageIndex: number = 0;

  



  selectImage(productIndex: number, imageIndex: number): void {
    this.currentImageIndex = imageIndex;
    const imageElement = this.largeImages.toArray()[imageIndex];

    if (imageElement) {
      // Manually scroll to adjust positioning without unnecessary spacing
      const offsetTop = imageElement.nativeElement.offsetTop;
      window.scrollTo({
        top: offsetTop - 125, // Adjust the value (20px) to align properly
        behavior: 'smooth'
      });

      this.updateActiveSmallImage();
    }
  }

  // selectSize(size: { Size_Name: string; Rate: number }) {
  //   this.selectedSize = size.Size_Name;
  //   this.selectedRate = size.Rate;
  //   //this.selectedMRP = size.MRP; // Optional: if you're using MRP too
  // }

  selectSize(size: { Size_Name: string; Rate: number } | undefined) {
    if (size) {
      this.selectedSize = size.Size_Name;
      this.selectedRate = size.Rate;
    }
  }



  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    let closestIndex = 0;
    let closestDistance = Number.MAX_VALUE;

    this.largeImages.forEach((image, index) => {
      const rect = image.nativeElement.getBoundingClientRect();
      const distanceFromTop = Math.abs(rect.top -1); // Adjust offset if needed

      if (distanceFromTop < closestDistance) {
        closestDistance = distanceFromTop;
        closestIndex = index;
      }
    });

    this.currentImageIndex = closestIndex;
    this.updateActiveSmallImage();
  }

  updateActiveSmallImage(): void {
    this.smallImages.forEach((img, index) => {
      img.nativeElement.classList.toggle('active', index === this.currentImageIndex);
    });
  }





  getProductCodeDetails(productCodeId: number): void {
    this.productservice.getProductCodeId(productCodeId).subscribe(
      ProductCodeId => {
        this.productCID = ProductCodeId;
        console.log('Additional Product Code ID:', ProductCodeId);
      },
      error => {
        console.error('Error fetching Product Code ID:', error);
      }
    );
  }


  displayFullScreenImage(imageUrl: string) {
    const product = this.productdata.find(p => p.Product_Code_Id.toString() === this.productCodeId.toString());

    if (product) {
      this.currentImageIndex = product.Images.findIndex((img: { P_URL: string }) =>
        this.defaultUrl + img.P_URL === imageUrl
      );

      this.fullScreenImageUrl = imageUrl;
      this.isFullScreenImageVisible = true;
    }
  }


  closeFullScreenImage(event: Event) {
    event.stopPropagation();
    this.isFullScreenImageVisible = false;
    document.body.style.overflow = '';
  }


  toggleZoom(event: MouseEvent): void {
    this.isZoomed = !this.isZoomed;
    const zoomedImage = event.target as HTMLImageElement;
    const zoomFactor = this.isZoomed ? 2 : 1;
    const transitionDuration = '0.5s';

    zoomedImage.style.transition = `transform ${transitionDuration}`;

    if (this.isZoomed) {
      const container = zoomedImage.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const clickX = (event.clientX - containerRect.left) / containerRect.width;
        const clickY = (event.clientY - containerRect.top) / containerRect.height;

        zoomedImage.style.transformOrigin = `${clickX * 100}% ${clickY * 100}%`;
        zoomedImage.style.transform = `scale(${zoomFactor})`;

        container.style.overflow = 'auto';
        container.style.width = '150%';
        container.style.height = '150%';
      }
    } else {
      zoomedImage.style.transformOrigin = 'center center';
      zoomedImage.style.transform = `scale(${zoomFactor})`;

      const container = zoomedImage.parentElement;
      if (container) {
        container.style.overflow = 'hidden';
        container.style.width = '100%';
        container.style.height = '100%';
      }
    }
  }

  // addToCart2(product: Product, quantity: number, menuName: string, size: string, rate: number) {
  //   console.log('Product Menu Name:', menuName); // Debugging

  //   // Convert menu name to lowercase and trim spaces to avoid case sensitivity issues
  //   const isSaree = menuName?.trim().toLowerCase() === 'sarees';

  //   // If the product is NOT a saree, check for size selection
  //   if (!isSaree && !this.selectedSize) {
  //     window.alert('Please select a size before adding to the cart.');
  //     return; // Stop execution if size is not selected
  //   }

  //   // Check if the user is authenticated
  //   if (this.loginservice.isAuthenticated()) {
  //     const loggedInUser = this.loginservice.getCustomer();
  //     if (loggedInUser) {
  //       // Show success message using window alert
  //       window.alert('Product Successfully added to Cart!');

  //       // Add product to cart
  //       this.productservice.addToCart(
  //         isSaree ? { ...product } : { ...product, selectedSize: this.selectedSize },
  //         quantity,
  //         isSaree ? "" : this.selectedSize // Skip selectedSize for saree
  //       );
  //     }
  //   } else {
  //     // Redirect to login page and pass the product ID for redirection after login
  //     this.router.navigate(['/login'], { queryParams: { productId: product?.Product_Code_Id } });
  //     console.log('Id for Login', product?.Product_Code_Id);
  //   }
  // }

  addToCart2(product: Product, quantity: number, menuName: string, size: string, rate: number) {
    console.log('Product Menu Name:', menuName);

    const isSaree = menuName?.trim().toLowerCase() === 'sarees';

    // ✅ Only check size for non-sarees
    if (!isSaree && !size) {
      window.alert('Please select a size before adding to the cart.');
      return;
    }

    if (this.loginservice.isAuthenticated()) {
      const loggedInUser = this.loginservice.getCustomer();
      if (loggedInUser) {
        window.alert('Product Successfully added to Cart!');

        // ✅ Pass the correct size or "N/A" for sarees
        this.productservice.addToCart(
          { ...product, Menu_Name: menuName, Rate: rate },
          quantity,
         isSaree ? "" : size
        );
      }
    } else {
      this.router.navigate(['/login'], {
        queryParams: { productId: product?.Product_Code_Id }
      });
      console.log('Id for Login', product?.Product_Code_Id);
    }
  }




  buyNow(product: any, quantity: number, menuName: string, size: string, rate: number) {
    if (this.loginservice.isAuthenticated()) {
      const loggedInUser = this.loginservice.getCustomer();

      if (loggedInUser) {
        const isSaree = menuName?.trim().toLowerCase() === 'sarees';

        if (!isSaree && !size) {
          window.alert('Please select a size before proceeding.');
          return;
        }

        const productWithSize = isSaree ? { ...product } : { ...product, selectedSize: size, Rate: rate };

        // Step 1: Add product to cart
        this.productservice.addToCart(productWithSize, quantity, isSaree ? '' : size);

        // Step 2: Prepare and store in localStorage for direct checkout view
        const checkoutProduct = {
          name: product?.Product_Name,
          rate: isSaree ? product?.Rate : rate,
          quantity: quantity,
          image: product?.Image,
          size: isSaree ? '' : size,
          product_id: product?.Product_Code_Id,
        };

        localStorage.setItem('directCheckoutItem', JSON.stringify([checkoutProduct]));

        // Step 3: Navigate to checkout
        this.router.navigate(['/checkout']);
      }
    } else {
      alert('Please login to proceed with your purchase.');
      this.router.navigate(['/login']);
    }
  }

  isVideo(fileName: string): boolean {
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return videoExtensions.includes(ext);
  }

  getSafeURL(fileName: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultUrl + fileName);
  }


showSizeErrorMessage : boolean = false;

resetErrorMessage() {
  this.showSizeErrorMessage = false;
}




sizeChart = [
  { name: 'XS', bust: 31, waist: 28, hip: 33, inseam: 27 },
  { name: 'S', bust: 33, waist: 30, hip: 35, inseam: 27 },
  { name: 'M', bust: 35, waist: 32, hip: 37, inseam: 27 },
  { name: 'L', bust: 37, waist: 34, hip: 39, inseam: 27 },
  { name: 'XL', bust: 39, waist: 37, hip: 43, inseam: 27 },
  { name: '2XL', bust: 41, waist: 39, hip: 45, inseam: 27 },
];

closeSizeChart() {
  this.isSizeChartOpen = false;
}




imageList: string[] = []; // Store all images for navigation



nextImage() {
  if (!this.productdata || this.productdata.length === 0) return;

  const product = this.productdata.find(p => p.Product_Code_Id.toString() === this.productCodeId.toString());

  if (product && product.Images.length > 0) {
    this.currentImageIndex = (this.currentImageIndex + 1) % product.Images.length;
    this.fullScreenImageUrl = this.defaultUrl + product.Images[this.currentImageIndex].P_URL;

    setTimeout(() => this.resetZoom(), 10); // Allow the image to update first
  }
}

prevImage() {
  if (!this.productdata || this.productdata.length === 0) return;

  const product = this.productdata.find(p => p.Product_Code_Id.toString() === this.productCodeId.toString());

  if (product && product.Images.length > 0) {
    this.currentImageIndex = (this.currentImageIndex - 1 + product.Images.length) % product.Images.length;
    this.fullScreenImageUrl = this.defaultUrl + product.Images[this.currentImageIndex].P_URL;

    setTimeout(() => this.resetZoom(), 10); // Allow the image to update first
  }
}






// Function to reset zoom
resetZoom() {
  this.zoomTransform = 'scale(1)';
  this.zoomOrigin = 'center center'; // Reset origin
  this.isZoomed = false;
}




zoomTransform: string = 'scale(1)';
zoomOrigin: string = 'center center';


zoomImage(event: MouseEvent) {
  if (!this.isFullScreenImageVisible) return;

  const imgElement = event.target as HTMLElement;
  const rect = imgElement.getBoundingClientRect();

  const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
  const yPercent = ((event.clientY - rect.top) / rect.height) * 100;

  if (!this.isZoomed) {
    // Zoom In
    this.zoomTransform = 'scale(2)'; // Adjust scale as needed
    this.zoomOrigin = `${xPercent}% ${yPercent}%`;
    this.isZoomed = true;
  } else {
    // Zoom Out
    this.resetZoom();
  }
}





openFullScreen(imageUrl: string) {
  this.fullScreenImageUrl = imageUrl;
  this.isFullScreenImageVisible = true;

  // Reset zoom state when opening full-screen mode
  this.resetZoom();
}
}
