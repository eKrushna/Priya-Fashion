import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  activeCategory: string = '';
  hoveredProductIndex: number = -1;
  defaultUrl: string = 'https://ppriyafashion.com/business_guru_admin/Product_Image/';
  menus: any[] = [];
  selectedSize: string = '';
  constructor(private sanitizer: DomSanitizer,private productService: ProductService, private router:Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Product Data:', data);
        this.products = data;
  
        // Set default category to "ETHNIC SETS"
        this.activeCategory = 'ETHNIC SETS';
  
        // Filter products based on default category
        this.filteredProducts = this.products.filter(product => product.Menu_Name.includes(this.activeCategory)).slice(0, 4);
  
        // Apply animation after products are set
        setTimeout(() => {
          this.applyAnimation();
        }, 50);
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
      }
    });


    this.productService.getMenu().subscribe({
      next: (res) => {
        this.menus = res; // Assuming API returns an array of menus
        console.log(this.menus);
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }
  

  onImageError(productName: string) {
    console.error(`Image not found for product: ${productName}`);
  }

  // Method to generate a safe URL for files (used for video or image preview)
  getSafeURL(file: File): string {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Error creating object URL:', error);
      return '';
    }
  }
  isImage(file: File): boolean {
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    return imageTypes.includes(file.type);
  }
  getFirstImage(product: any): File | null {
    return product.Product_Image?.find((file: File) => this.isImage(file)) || null;
  }

  isVideoFile(url: string): boolean {
    if (!url) return false;
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
    const ext = url.split('.').pop()?.toLowerCase() || '';
    return videoExtensions.includes(ext);
  }
  
  
  getMediaUrl(product: any, productIndex: number): { type: 'image' | 'video', url: string } {
    const mediaList = product.Images || [];
  
    const hovered = productIndex === this.hoveredProductIndex;
    const media = hovered && mediaList.length > 1 ? mediaList[1] : mediaList[0];
  
    const fullUrl = this.defaultUrl + media.P_URL;
  
    if (this.isVideoFile(media.P_URL)) {
      return { type: 'video', url: fullUrl };
    }
  
    return { type: 'image', url: fullUrl };
  }
  


  getHoveredImageUrl(product: any, productIndex: number): string {
    const images = product.Images || [];
  
    // Filter out only image files (exclude video files)
    const imageFiles = images.filter((img: any) => !this.isVideoFile(img.P_URL));
  
    if (imageFiles.length === 0) {
      // No images available, return empty or default
      return '';
    }
  
    // If hovering, show the second image (if available) for hover effect
    if (productIndex === this.hoveredProductIndex && imageFiles[1]) {
      return this.defaultUrl + imageFiles[1].P_URL;
    }
  
    // Show the first image if available
    return this.defaultUrl + imageFiles[0].P_URL;
  }
  

  
    hasImageAndVideo(product: any): boolean {
      // Check if the product has at least one image and one video
      const hasImage = product.Product_Image.some((file: File) => !this.isVideo(file.name));
      const hasVideo = product.Product_Image.some((file: File) => this.isVideo(file.name));
      return hasImage && hasVideo;
    }



  setActiveCategory(category: string, event: Event) {
    this.activeCategory = category;
    let filtered = category ? this.products.filter(product => product.Menu_Name.includes(category)) : this.products;

    // Display 4 products for categories, All Products will show all
    this.filteredProducts = category === '' ? filtered : filtered.slice(0, 4);

    setTimeout(() => {
      this.applyAnimation(); // Apply animation after updating products
    }, 50);

    const links = document.querySelectorAll('.arrivals-nav .nav-link');
    links.forEach(link => link.classList.remove('active'));
    const clickedLink = event.target as HTMLElement;
    clickedLink.classList.add('active');

    event.preventDefault();
  }

  applyAnimation() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card) => {
      const cardElement = card as HTMLElement; // Type casting to HTMLElement
      cardElement.classList.remove('show'); // Reset animation
      void cardElement.offsetWidth; // Trigger reflow to restart animation
      cardElement.classList.add('show'); // Apply animation
    });
  }

  navigateToAllProducts() {
    if (this.activeCategory) {
      this.router.navigate(['/products', this.activeCategory]); // ✅ Use navigate method
    }
  }

  goToProductDetails(product: any) {
    this.router.navigate(['/product', product.Product_Code_Id], { state: { productData: product } });
  }

  handleProductClick(product: any): void {
    this.goToProductDetails(product); // Navigate if in stock
  }
  truncateProductName(name: string): string {
    if (!name) return ''; // Handle empty cases
    const words = name.trim().split(/\s+/); // Split by spaces, avoiding extra spaces
    return words.length > 2 ? `${words[0]} ${words[1]}...` : name;
  }

  isVideo(fileName: string): boolean {
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return videoExtensions.includes(ext);
  }
  
  
  
}