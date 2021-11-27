import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

interface Stock {
  units: number;
  price: number;
}


@Component({
  selector: 'app-cost-averaging',
  templateUrl: './cost-averaging.component.html',
  styleUrls: ['./cost-averaging.component.scss']
})
export class CostAveragingComponent implements OnInit, OnDestroy {
  caForm!: FormGroup;
  averagePrice = 0;
  priceChangeSub!: Subscription;

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

  createForm() {
    return this.fb.group({
      stocks: new FormArray([])
    });
  }

  addStock(formArray: FormArray) {
    const stockFormGroup = new FormGroup({
      units: new FormControl(0, [Validators.min(0), Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)])
    })
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

    })
  }

  removeStock(index: number) {
    this.stocks.removeAt(index);
  }

  ngOnDestroy() {
    if (this.priceChangeSub) this.priceChangeSub.unsubscribe()
  }

}
