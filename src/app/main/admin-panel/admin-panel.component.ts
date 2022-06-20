import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import {Category, CreateProductParam, Producer} from '../../model/models';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  createProductGroup: FormGroup;
  categories: Category[] = [];
  producers: Producer[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.createProductGroup = this.formBuilder.group({
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      category: new FormControl(''),
      producer: new FormControl(''),
      image: new FormControl(''),
    });
    this.productService
      .getCategories()
      .subscribe((categories) => {
      this.categories.push(...categories);
    });
    this.productService
      .getProducers()
      .subscribe((producers) => {
        this.producers.push(...producers);
      });
  }

  onSubmit(): void {
    console.log(this.createProductGroup.value);
    const createProductParam = {
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      producer: this.producer,
    } as CreateProductParam;
    console.log(this.image);
    // this.productService.createProduct(createProductParam, this.image).subscribe();
  }

  get image(): any {
    return this.createProductGroup.get('image')?.value;
  }

  get name(): string {
    return this.createProductGroup.get('name')?.value;
  }

  get description(): string {
    return this.createProductGroup.get('description')?.value;
  }

  get price(): string {
    return this.createProductGroup.get('price')?.value;
  }

  get category(): string {
    return this.createProductGroup.get('category')?.value;
  }

  get producer(): string {
    return this.createProductGroup.get('producer')?.value;
  }

  onFileChanged(event): void {
    const input = event.target.files[0];
    this.createProductGroup.patchValue({
      image: input,
    });
  }
}
