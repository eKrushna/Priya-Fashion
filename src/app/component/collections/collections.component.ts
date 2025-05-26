import { Component, ElementRef, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit, AfterViewInit {
  products: any[] = [];
  category: string = '';
  defaultUrl: string = 'https://ppriyafashion.com/business_guru_admin/Product_Image/';
  gridClass: string = 'col-lg-3 col-md-4 col-sm-12'; // Default 4-column grid
  dropdownOpen: boolean = false;
  selectedSize: string = '';
  hoveredProductIndex: number = -1;
  constructor(private route: ActivatedRoute, private productService: ProductService, private eRef: ElementRef,private router:Router) {}

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  sortProducts(option: string): void {
    if (option === 'low-to-high') {
      this.products.sort((a, b) => a.MRP - b.MRP);
    } else if (option === 'high-to-low') {
      this.products.sort((a, b) => b.MRP - a.MRP);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') || '';
      this.fetchProducts();
    });
  }

  ngAfterViewInit(): void {
    // Add 'active' class to 4-column grid icon on page load
    setTimeout(() => {
      const defaultIcon = document.querySelector('.view-icons i:nth-child(3)');
      if (defaultIcon) {
        defaultIcon.classList.add('active');
      }
    });
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.products = this.category
        ? data.filter(product => product.Menu_Name.includes(this.category))
        : data;
    });
  }

  getHoveredImageUrl(product: any, productIndex: number): string {
    if (productIndex === this.hoveredProductIndex && product.Images?.[1]) {
      return this.defaultUrl + product.Images[1].P_URL;
    }
    return this.defaultUrl + product.Images[0]?.P_URL;
  }

  changeGrid(grid: number, event: any): void {
    const gridMap: Record<number, string> = {
      2: 'col-lg-6 col-md-6 col-sm-12',
      3: 'col-lg-4 col-md-6 col-sm-12',
      4: 'col-lg-3 col-md-4 col-sm-12'
    };

    this.gridClass = gridMap[grid] ?? this.gridClass;

    // Remove active class from all icons
    document.querySelectorAll('.view-icons i').forEach((el) => el.classList.remove('active'));

    // Add active class to clicked icon
    (event.target as HTMLElement).classList.add('active');
  }

  goToProductDetails(product: any) {
    this.router.navigate(['/product', product.Product_Code_Id], { state: { productData: product } });
  }
  truncateProductName(name: string): string {
    if (!name) return ''; // Handle empty cases
    const words = name.trim().split(/\s+/); // Split by spaces, avoiding extra spaces
    return words.length > 2 ? `${words[0]} ${words[1]}...` : name;
  }
  
}
