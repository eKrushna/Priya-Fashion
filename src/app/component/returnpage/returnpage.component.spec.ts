import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnpageComponent } from './returnpage.component';

describe('ReturnpageComponent', () => {
  let component: ReturnpageComponent;
  let fixture: ComponentFixture<ReturnpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnpageComponent]
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
