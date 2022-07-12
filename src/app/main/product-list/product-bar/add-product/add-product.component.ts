import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Category, CreateProductParam, Producer } from '../../../../model/models';
import { ProductService } from '../../../../service/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {

  @Input() public test;

  createProductGroup: FormGroup;
  categories: Category[] = [];
  producers: Producer[] = [];
  url: string | ArrayBuffer | null | undefined;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log(this.test);
    this.initCreateProductGroup();
    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.productService.getProducers().subscribe((producers) => {
      this.producers = producers;
    });
  }

  private initCreateProductGroup(): void {
    this.createProductGroup = this.formBuilder.group({
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      category: new FormControl(''),
      producer: new FormControl(''),
      image: new FormControl(''),
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
    this.productService.createProduct(createProductParam, this.image).subscribe((addedProduct) => {
      this.activeModal.dismiss('Cross click');
      this.productService.productAddedSubject.next(addedProduct);
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
    this.url = event.target.result;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (readerEvent) => {
      this.url = readerEvent?.target?.result;
    };
  }
}
