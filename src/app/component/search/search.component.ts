import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [FormsModule,CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm = '';
  selectedSize: string = '';
  productdata: any[] = [];
  filteredProducts: any[] = [];
  hoveredProductIndex: number = -1;
  showSearchModal = false;
   defaultUrl: string = 'https://ppriyafashion.com/business_guru_admin/Product_Image/';
    private searchSubject = new Subject<string>();
  constructor(private productservice:ProductService,private router:Router){}

   ngOnInit(): void {
     
  
      this.searchSubject.pipe(
        debounceTime(0), // Waits for 300ms after the user stops typing
        distinctUntilChanged(),
        switchMap((term) => this.productservice.getProducts()) // Fetch API data
      ).subscribe({
        next: (data) => {
          this.productdata = data;
          this.filterProducts();
        },
        error: (err) => console.error('Failed to fetch products:', err)
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
    truncateProductName(name: string): string {
      if (!name) return ''; // Handle empty cases
      const words = name.trim().split(/\s+/); // Split by spaces, avoiding extra spaces
      return words.length > 2 ? `${words[0]} ${words[1]}...` : name;
    }
}
