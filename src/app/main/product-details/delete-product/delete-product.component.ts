import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../model/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../../service/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css'],
})
export class DeleteProductComponent implements OnInit {
  @Input() product: Product;

  constructor(
    public activeModal: NgbActiveModal,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onDeleteProduct(): void {
    this.productService.deleteProduct(this.product.id).subscribe(() => {
      this.activeModal.dismiss('Cross click');
      this.router.navigateByUrl('/products');
      this.toastr.success(`Product successfully removed`);
    });
  }
}
