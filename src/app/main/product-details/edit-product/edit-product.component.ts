import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../../service/product.service';
import { Category, CreateProductParam, Producer } from '../../../model/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  updateProductGroup: FormGroup;
  categories: Category[] = [];
  producers: Producer[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initUpdateProductGroup();
    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.productService.getProducers().subscribe((producers) => {
      this.producers = producers;
    });
  }

  private initUpdateProductGroup(): void {
    this.updateProductGroup = this.formBuilder.group({
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      category: new FormControl(''),
      producer: new FormControl(''),
      image: new FormControl(''),
    });
  }

  onSubmitProduct(): void {
    const updateProductGroup = {
      name: this.productName,
      description: this.productDescription,
      price: this.productPrice,
      category: this.productCategory,
      producer: this.productProducer,
    } as CreateProductParam;
    this.productService.createProduct(updateProductGroup, this.image).subscribe((updatedProduct) => {
      this.activeModal.dismiss('Cross click');
      this.productService.productAddedSubject.next(updatedProduct);
    });
  }

  get image(): File {
    return this.updateProductGroup.get('image')?.value;
  }

  get productName(): string {
    return this.updateProductGroup.get('name')?.value;
  }

  get productDescription(): string {
    return this.updateProductGroup.get('description')?.value;
  }

  get productPrice(): string {
    return this.updateProductGroup.get('price')?.value;
  }

  get productCategory(): string {
    return this.updateProductGroup.get('category')?.value;
  }

  get productProducer(): string {
    return this.updateProductGroup.get('producer')?.value;
  }
}
