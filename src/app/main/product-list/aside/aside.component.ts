import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Router } from '@angular/router';
import { Category, Producer, Product } from '../../../model/models';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
})
export class AsideComponent implements OnInit {
  categories: Category[] = [];
  producers: Producer[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
    this.getProducers();
    this.productService.categoryAddedSubject.subscribe(() => {
      this.getCategories();
    });
    this.productService.producerAddedSubject.subscribe(() => {
      this.getProducers();
    });
  }

  private getProducers(): void {
    this.productService.getProducers().subscribe((producers) => {
      this.producers = producers;
    });
  }

  private getCategories(): void {
    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  doSearch(value: string): void {
    this.router.navigateByUrl(`search/${value.trim()}`);
  }

  onChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.router.navigateByUrl(`sort/${target.value}`);
  }
}
