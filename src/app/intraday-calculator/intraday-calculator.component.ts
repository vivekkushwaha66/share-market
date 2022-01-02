import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

enum OrderType {
  buy = 0,
  sell = 1
}

interface Order {
  type: OrderType;
  price: number;
  quantity: number;
  stopLoss: number;
  target: number;
  margin: number;
}

@Component({
  selector: 'app-intraday-calculator',
  templateUrl: './intraday-calculator.component.html',
  styleUrls: ['./intraday-calculator.component.scss']
})
export class IntradayCalculatorComponent implements OnInit, OnDestroy {
  profit = 0.00;
  loss = 0.00;
  capital = 0.00;
  orderForm!: FormGroup;
  subs: Subscription[] = [];
  constructor(private fb: FormBuilder) {
    this.orderForm = this.createForm();
  }


  ngOnInit(): void {
    this.updateOrderForm();
  }

  createForm() {
    const orderFormGroup = new FormGroup({
      type: new FormControl('0', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      margin: new FormControl('5', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      stopLoss: new FormControl(0, [Validators.required]),
      target: new FormControl(0, [Validators.required])
    });
    return orderFormGroup;
  }

  updateOrderForm() {
    const type = this.orderForm.get('type');
    const price = this.orderForm.get('price');
    const margin = this.orderForm.get('margin');
    const quantity = this.orderForm.get('quantity');
    const stopLoss = this.orderForm.get('stopLoss');
    const target = this.orderForm.get('target');

    if (type) {
      this.subs.push(type.valueChanges.subscribe(type => {
        const order: Order = this.orderForm.value;
        order.type = type;
        this.calculateProfitAndLoss(order);
        this.calculateCapital(order);
      }));
    }
    if (price) {
      this.subs.push(price.valueChanges.subscribe(price => {
        const order: Order = this.orderForm.value;
        order.price = price;
        this.calculateProfitAndLoss(order);
        this.calculateCapital(order);
      }));
    }
    if (margin) {
      this.subs.push(margin.valueChanges.subscribe(margin => {
        const order: Order = this.orderForm.value;
        order.margin = Number(margin);
        this.calculateProfitAndLoss(order);
        this.calculateCapital(order);
      }));
    }
    if (quantity) {
      this.subs.push(quantity.valueChanges.subscribe(quantity => {
        const order: Order = this.orderForm.value;
        order.quantity = Number(quantity);
        this.calculateProfitAndLoss(order);
        this.calculateCapital(order);
      }));
    }
    if (stopLoss) {
      this.subs.push(stopLoss.valueChanges.subscribe(stopLoss => {
        const order: Order = this.orderForm.value;
        order.stopLoss = Number(stopLoss);
        this.calculateProfitAndLoss(order);
        this.calculateCapital(order);
      }));
    }
    if (target) {
      this.subs.push(target.valueChanges.subscribe(target => {
        const order: Order = this.orderForm.value;
        order.target = Number(target);
        this.calculateProfitAndLoss(order);
        this.calculateCapital(order);
      }));
    }

  }


  calculateProfitAndLoss(order: Order) {
    let { type, price, quantity, stopLoss, target } = order;
    type = Number(type);
    const slDiff = Math.abs(price - stopLoss);
    const profitDiff = Math.abs(price - target);
    this.loss = Number((slDiff * quantity).toFixed(2))
    this.profit = Number((profitDiff * quantity).toFixed(2))
  }


calculateCapital(order: Order) {
  let { price, margin, quantity } = order;
  margin = Number(margin);
  if (price && margin && quantity) {
    const unitPrice = price / margin;
    this.capital = Number(unitPrice) * quantity
  }
}

ngOnDestroy() {
  this.subs.forEach(sub => {
    if (sub) sub.unsubscribe();
  });
}

}
