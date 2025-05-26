import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacerequestComponent } from './replacerequest.component';

describe('ReplacerequestComponent', () => {
  let component: ReplacerequestComponent;
  let fixture: ComponentFixture<ReplacerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacerequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplacerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
