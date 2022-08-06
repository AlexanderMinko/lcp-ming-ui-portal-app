import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../../service/product.service';
import { Category, Producer, Product, UpdateProductParam } from '../../../model/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  @Input() product: Product;
  updateProductGroup: FormGroup;
  categories: Category[] = [];
  producers: Producer[] = [];
  url: string | ArrayBuffer | null | undefined;

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
    this.url = this.product.imageUrl;
  }

  private initUpdateProductGroup(): void {
    this.updateProductGroup = this.formBuilder.group({
      name: new FormControl(this.product.name),
      description: new FormControl(this.product.description),
      price: new FormControl(this.product.price),
      category: new FormControl(this.product.category.id),
      producer: new FormControl(this.product.producer.id),
      image: new FormControl(),
    });
  }

  onSubmit(): void {
    const updateProductGroup = {
      id: this.product.id,
      name: this.productName,
      description: this.productDescription,
      price: this.productPrice,
      category: this.productCategory,
      producer: this.productProducer,
    } as UpdateProductParam;
    this.productService.updateProduct(updateProductGroup, this.image).subscribe((updatedProduct) => {
      this.activeModal.dismiss('Cross click');
      this.productService.productEditedSubject.next(updatedProduct);
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

  onFileChanged(event: Event): void {
    const files: FileList = (event.target as HTMLInputElement).files as FileList;
    this.updateProductGroup.patchValue({
      image: files[0],
    });
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (readerEvent) => {
      this.url = readerEvent?.target?.result;
    };
  }
}
