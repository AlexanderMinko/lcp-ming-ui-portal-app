import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../../../service/product.service';
import { CreateCategoryParam, CreateProducerParam, Producer } from '../../../../model/models';

@Component({
  selector: 'app-add-producer',
  templateUrl: './add-producer.component.html',
  styleUrls: ['./add-producer.component.css'],
})
export class AddProducerComponent implements OnInit {
  createProducerGroup: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.createProducerGroup = this.formBuilder.group({
      name: new FormControl(''),
      displayName: new FormControl(''),
      description: new FormControl(''),
    });
  }

  onSubmitProducer(): void {
    const createProducerParam = {
      name: this.producerName,
      displayName: this.producerDisplayName,
      description: this.producerDescription,
    } as CreateProducerParam;
    this.productService.createProducer(createProducerParam).subscribe((addedProducer: Producer) => {
      this.activeModal.dismiss('Cross click');
      this.productService.producerAddedSubject.next(addedProducer);
    });
  }

  get producerName(): string {
    return this.createProducerGroup.get('name')?.value;
  }

  get producerDisplayName(): string {
    return this.createProducerGroup.get('displayName')?.value;
  }

  get producerDescription(): string {
    return this.createProducerGroup.get('description')?.value;
  }
}
