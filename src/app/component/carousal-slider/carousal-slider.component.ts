import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
declare var bootstrap: any; // Bootstrap TypeScript declaration

@Component({
  selector: 'app-carousal-slider',
  imports: [CommonModule],
  templateUrl: './carousal-slider.component.html',
  styleUrl: './carousal-slider.component.css'
})
export class CarousalSliderComponent implements AfterViewInit{
  sliderImages: any[] = [];
  defaultUrl: string = 'https://ppriyafashion.com/business_guru_admin/Product_Image/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSliderImages();
  }

  fetchSliderImages(): void {
    const requestUrl = 'https://ppriyafashion.com/business_guru_admin/Image_Gallery_Operations.php';
    const payload = [{ "Operation": "Display_Operation" }];
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    this.http.post<any[]>(requestUrl, formData).subscribe(
      (response) => {
        this.sliderImages = response;
        console.log('Slider Images:', this.sliderImages);
      },
      (error) => {
        console.error('Error fetching slider images', error);
      }
    );
  }

  isImage(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extension!);
  }

  ngAfterViewInit(): void {
    const carouselElement = document.querySelector("#carouselExample");
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 3000, // Set the desired speed (3 seconds)
        ride: "carousel", // Automatic slide
        pause: false, // No pause on hover
        wrap: true // Infinite loop
      });
    }
  }
  sliderTexts: string[] = [
    'Get 5% OFF on Prepaid Orders',
  ];
}
