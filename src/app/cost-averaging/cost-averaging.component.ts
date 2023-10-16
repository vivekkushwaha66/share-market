import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

interface Stock {
  units: number;
  price: number;
  amount: number;
}


@Component({
  selector: 'app-cost-averaging',
  templateUrl: './cost-averaging.component.html',
  styleUrls: ['./cost-averaging.component.scss']
})
export class CostAveragingComponent implements OnInit, AfterViewInit, OnDestroy {
  caForm!: FormGroup;
  averagePrice = 0;
  totalInvestmentAmount = 0;
  priceChangeSub!: Subscription;
  stockChanges: Subscription[] = []

  constructor(private fb: FormBuilder) {
    this.caForm = this.createForm();
    this.addStock(this.caForm.controls['stocks'] as FormArray);
  }


  get stocks() {
    return this.caForm.controls['stocks'] as FormArray;
  }

  ngOnInit(): void {
    this.updateAveragePrice();
  }


  ngAfterViewInit(): void {
  }

  createForm() {
    return this.fb.group({
      stocks: new FormArray([])
    });
  }

  addStock(formArray: FormArray) {
    const stockFormGroup = new FormGroup({
      units: new FormControl(0, [Validators.min(0), Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      amount: new FormControl(0)
    });
    const unitControl = stockFormGroup.get('units');
    const priceControl = stockFormGroup.get('price');
    const amountControl = stockFormGroup.get('amount');
    if (unitControl) {
      this.stockChanges.push(unitControl.valueChanges.subscribe(unit => {
        const price = priceControl?.value;
        if (unit && price) {
          const amount = Number((unit * price).toFixed(2));
          amountControl?.setValue(amount);
        }
      }));
    }
    if (priceControl) {
      this.stockChanges.push(priceControl.valueChanges.subscribe(price => {
        const unit = unitControl?.value;
        if (unit && price) {
          const amount = Number((unit * price).toFixed(2));
          amountControl?.setValue(amount);
        }
      }));
    }
    formArray.push(stockFormGroup);
  }

  updateAveragePrice() {
    this.priceChangeSub = this.stocks.valueChanges.subscribe((stocks: Stock[]) => {
      const sum: number = stocks.reduce((sum, stock) => {
        sum += stock.price * stock.units;
        return sum;
      }, 0);
      const units = stocks.reduce((previous, currentStock) => previous += currentStock.units, 0);
      this.averagePrice = (sum / units);
      this.totalInvestmentAmount = sum;
      if (isNaN(this.averagePrice)) this.averagePrice = 0

    })
  }

  removeStock(index: number) {
    this.stocks.removeAt(index);
  }

  ngOnDestroy() {
    if (this.priceChangeSub) this.priceChangeSub.unsubscribe();
    this.stockChanges.forEach(x => {
      if (x) x.unsubscribe();
    })
  }

}
