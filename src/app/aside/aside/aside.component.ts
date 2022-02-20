import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { Router } from '@angular/router';
import { Category } from '../../model/models';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
})
export class AsideComponent implements OnInit {
  categories: Category[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  doSearch(value: string): void {
    this.router.navigateByUrl(`search/${value.trim()}`);
  }

  onChange(income: any): void {
    const target  = income as HTMLTextAreaElement;
    this.router.navigateByUrl(`sort/${target.value}`);
  }
}
