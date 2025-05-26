import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarousalSliderComponent } from './carousal-slider.component';

describe('CarousalSliderComponent', () => {
  let component: CarousalSliderComponent;
  let fixture: ComponentFixture<CarousalSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarousalSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarousalSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
