import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostAveragingComponent } from './cost-averaging.component';

describe('CostAveragingComponent', () => {
  let component: CostAveragingComponent;
  let fixture: ComponentFixture<CostAveragingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostAveragingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostAveragingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
