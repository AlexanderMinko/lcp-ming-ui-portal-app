import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category, CreateCategoryParam } from '../../../../../model/models';
import { ProductService } from '../../../../../service/product.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent implements OnInit {
  createCategoryGroup: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.createCategoryGroup = this.formBuilder.group({
      name: new FormControl(''),
      displayName: new FormControl(''),
      description: new FormControl(''),
    });
  }

  onSubmitCategory(): void {
    const createCategoryParam = {
      name: this.categoryName,
      displayName: this.categoryDisplayName,
      description: this.categoryDescription,
    } as CreateCategoryParam;
    this.productService
      .createCategory(createCategoryParam)
      .subscribe((addedCategory: Category) => {
        this.activeModal.dismiss('Cross click');
        this.productService.categoryAddedSubject.next(addedCategory);
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
