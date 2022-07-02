import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {Category, CreateCategoryParam, CreateProductParam, Producer} from '../../../model/models';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  createProductGroup: FormGroup;
  createCategoryGroup: FormGroup;
  categories: Category[] = [];
  producers: Producer[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
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
    this.createCategoryGroup = this.formBuilder.group({
      name: new FormControl(''),
      displayName: new FormControl(''),
      description: new FormControl(''),
    });
    this.productService.getCategories().subscribe((categories) => {
      this.categories.push(...categories);
    });
    this.productService.getProducers().subscribe((producers) => {
      this.producers.push(...producers);
    });
  }

  onSubmitProduct(): void {
    const createProductParam = {
      name: this.productName,
      description: this.productDescription,
      price: this.productPrice,
      category: this.productCategory,
      producer: this.productProducer,
    } as CreateProductParam;
    this.productService.createProduct(createProductParam, this.image)
      .subscribe(response => {
        this.createCategoryGroup.reset();
        console.log('rested');
      });
  }

  get image(): File {
    return this.createProductGroup.get('image')?.value;
  }

  get productName(): string {
    return this.createProductGroup.get('name')?.value;
  }

  get productDescription(): string {
    return this.createProductGroup.get('description')?.value;
  }

  get productPrice(): string {
    return this.createProductGroup.get('price')?.value;
  }

  get productCategory(): string {
    return this.createProductGroup.get('category')?.value;
  }

  get productProducer(): string {
    return this.createProductGroup.get('producer')?.value;
  }

  onFileChanged(event): void {
    const input = event.target.files[0];
    this.createProductGroup.patchValue({
      image: input,
    });
  }

  onSubmitCategory(): void {
    const createCategoryParam = {
      name: this.categoryName,
      displayName: this.categoryDisplayName,
      description: this.categoryDescription
    } as CreateCategoryParam;
    console.log(createCategoryParam);
    this.productService.createCategory(createCategoryParam)
      .subscribe({
        next: () => this.createCategoryGroup.reset()
      });
  }

  get categoryName(): string {
    return this.createCategoryGroup.get('name')?.value;
  }

  get categoryDisplayName(): string {
    return this.createCategoryGroup.get('displayName')?.value;
  }

  get categoryDescription(): string {
    return this.createCategoryGroup.get('description')?.value;
  }
}
