import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnrequestComponent } from './returnrequest.component';

describe('ReturnrequestComponent', () => {
  let component: ReturnrequestComponent;
  let fixture: ComponentFixture<ReturnrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnrequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
