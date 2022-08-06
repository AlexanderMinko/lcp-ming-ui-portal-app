import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from './product-bar/add-product/add-product.component';
import { AddCategoryComponent } from './product-bar/add-category/add-category.component';
import { AddProducerComponent } from './product-bar/add-producer/add-producer.component';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  isLcpAdmin: boolean = false;
  constructor(private modalService: NgbModal, public authService: AuthService) {}

  ngOnInit(): void {
    this.isLcpAdmin = this.authService.isLcpAdmin();
  }

  onOpenAddProductModal(): void {
    const modalRef = this.modalService.open(AddProductComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
    modalRef.componentInstance.test = { message: 'text' };
  }

  onOpenAddCategoryModal(): void {
    this.modalService.open(AddCategoryComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
  }

  onOpenAddProducerModal(): void {
    this.modalService.open(AddProducerComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
  }

}
