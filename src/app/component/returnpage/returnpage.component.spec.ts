import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnpageComponent } from './returnpage.component';
import { MyOrderComponent } from '../my-order/my-order.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyAccountComponent } from '../my-account/my-account.component';


describe('ReturnpageComponent', () => {
  let component: ReturnpageComponent;
  let fixture: ComponentFixture<ReturnpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnpageComponent, CommonModule, FormsModule, MyOrderComponent, MyAccountComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
