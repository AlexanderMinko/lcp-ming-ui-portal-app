import { Component, OnInit } from '@angular/core';
import { OrderItemResponseDto } from '../../model/models';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  orderItems: OrderItemResponseDto[];
  orderId: number;
  totalCost = 0;
  totalCount = 0;

  imageBaseUrl = 'http://localhost:9000/ming';

  constructor(private orderService: OrderService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      this.orderId = this.activatedRoute.snapshot.params.id;
      this.orderService.getOrderItemByOrderId(this.orderId).subscribe((data: OrderItemResponseDto[]) => {
        this.orderItems = data;
        this.getTotalCost();
        this.getTotalQuantity();
      });
    });
  }

  getTotalCost(): void {
    let totalCost = 0;
    this.orderItems.forEach((el) => {
      totalCost += el.price * el.count;
    });
    this.totalCost = totalCost;
  }

  getTotalQuantity(): void {
    let totalCount = 0;
    this.orderItems.forEach((orderItem) => {
      totalCount += +orderItem.count;
    });
    this.totalCount = totalCount;
  }
}
