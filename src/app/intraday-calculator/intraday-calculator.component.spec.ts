import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntradayCalculatorComponent } from './intraday-calculator.component';

describe('IntradayCalculatorComponent', () => {
  let component: IntradayCalculatorComponent;
  let fixture: ComponentFixture<IntradayCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntradayCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntradayCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
