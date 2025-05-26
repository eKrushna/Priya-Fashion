import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { AddToCartComponent } from "../add-to-cart/add-to-cart.component";
import { LoginService } from '../../services/login.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, AddToCartComponent,RouterLink,FormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  User_Name:any;
  showSearchModal = false;
  searchTerm = '';
  productdata: any[] = [];
  filteredProducts: any[] = [];
  defaultUrl: string = 'https://ppriyafashion.com/business_guru_admin/Product_Image/';
  private searchSubject = new Subject<string>();
  menus: any[] = [];
  isNavbarOpen = false;
  cartItemCount: number = 0;
  hoveredProductIndex: number = -1;
  selectedSize: string = '';
  @ViewChild('searchInput') searchInput!: ElementRef;
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  constructor(private menuService: ProductService, private router:Router,public loginService:LoginService) {
     // Close sidebar when navigating back
     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showCartSidebar = false;
      }
    });
  }


  ngOnInit(): void {
   
    this.menuService.getMenu().subscribe({
      next: (res) => {
        this.menus = res;
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });

    this.searchSubject.pipe(
      debounceTime(0), // Waits for 300ms after the user stops typing
      distinctUntilChanged(),
      switchMap((term) => this.menuService.getProducts()) // Fetch API data
    ).subscribe({
      next: (data) => {
        this.productdata = data;
        this.filterProducts();
      },
      error: (err) => console.error('Failed to fetch products:', err)
    });
  
    // Load initial count on component initialization
    this.cartItemCount = this.menuService.getUniqueProductCount();
  
    // 🔥 Subscribe to cart updates for real-time count changes
    this.menuService.cartUpdated.subscribe((count) => {
      this.cartItemCount = count;
      console.log("🔄 Cart Count Updated:", count);
    });
  }
  
  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  filterProducts() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = []; // Clear the filtered products when input is empty
      return;
    }
  
    this.filteredProducts = this.productdata.filter((product) =>
      product.Product_Name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  
    console.log("Filtered Products:", this.filteredProducts);
  }
  
  ngAfterViewChecked() {
    if (this.showSearchModal && this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }
  

  toggleSearchModal() {
   

    if (window.innerWidth >= 912) {
      this.showSearchModal = !this.showSearchModal;
    
      if (this.showSearchModal) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
        this.showSearchModal=false;
        // ✅ Clear search input and results when closing the modal
        this.searchTerm = '';
        this.filteredProducts = [];
      }
    } else {
      this.router.navigate(['/search']); // Redirect to the search page on smaller screens
    }
  }
  
  
  
  
  updateCartCount() {
    // Get the latest cart item count
    this.cartItemCount = this.menuService.getUniqueProductCount();
    console.log("🔄 Updated Cart Count:", this.cartItemCount);
  }
  

  navigateToCollection(menuName: string, event: Event): void {
    event.preventDefault(); // Prevent page reload
    this.isNavbarOpen = false; // Close navbar on click

    // Navigate to collections page with category parameter
    this.router.navigate(['/products', menuName]);
  }


  navigateToHome(event: Event) {
    event.preventDefault(); // Prevent default anchor behavior
    this.router.navigate(['/']); // Navigate to the Home page
  }

 



  showCartSidebar = false;

 

  navigatetocart(event: Event) {
    event.stopPropagation(); // Prevents unwanted event bubbling

    if (this.router.url.startsWith('/products/')) {
      // If user is on `products/:category`, navigate to full cart page
      this.router.navigate(['/cart']);
    } else {
      // Toggle sidebar
      this.showCartSidebar = !this.showCartSidebar;
    }
  }

 openSidebar() {
  this.showCartSidebar = true;
  document.body.classList.add('sidebar-open'); // Disable background scrolling
}

closeSidebar() {
  this.showCartSidebar = false;
  document.body.classList.remove('sidebar-open'); // Enable background scrolling
}


  // Close sidebar when clicking outside
  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: Event) {
    if (this.showCartSidebar) {
      this.showCartSidebar = false;
    }
  }

  // Prevent closing when clicking inside the sidebar
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  goToMyOrders(): void {
    if (this.loginService.getCustomer()?.length > 0) {
      // User is logged in, navigate to the orders page
      this.router.navigate(['/my-order']); // Adjust the route to your orders page
    } else {
      // User is not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }
  }

  logout() {
    // Clear user data
    localStorage.removeItem('user');
    
    // Clear the cart
    this.menuService.clearCart(); 
    this.loginService.logout();
    // Redirect to the login page
    this.router.navigate(['/login']);
  
    // Reset username to 'Guest'
    this.User_Name = 'Guest';

  
  }
  truncateProductName(name: string): string {
    if (!name) return ''; // Handle empty cases
    const words = name.trim().split(/\s+/); // Split by spaces, avoiding extra spaces
    return words.length > 2 ? `${words[0]} ${words[1]}...` : name;
  }
  getHoveredImageUrl(product: any, productIndex: number): string {
    if (productIndex === this.hoveredProductIndex && product.Images?.[1]) {
      return this.defaultUrl + product.Images[1].P_URL;
    }
    return this.defaultUrl + product.Images[0]?.P_URL;
  }
  goToProductDetails(product: any) {
    this.showSearchModal = false; 
  
    // ✅ Remove modal-open class when navigating
    document.body.classList.remove('modal-open');
  
    this.router.navigate(['/product', product.Product_Code_Id], { state: { productData: product } });
  }
  
 
}
