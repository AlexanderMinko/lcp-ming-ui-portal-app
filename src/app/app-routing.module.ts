import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductListComponent } from './main/product-list/product-list.component';
import { ProductDetailsComponent } from './main/product-details/product-details.component';
import { CartDetailsComponent } from './main/cart-details/cart-details.component';
import { OrderDetailsComponent } from './main/order-details/order-details.component';
import { AccountDetailsComponent } from './main/account-details/account-details.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'products',
    component: ProductListComponent,
  },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'products/:id', component: ProductListComponent },
  { path: 'search/:name', component: ProductListComponent },
  { path: 'sort/:type/:name/:id', component: ProductListComponent },
  { path: 'sort/:type/:name', component: ProductListComponent },
  { path: 'sort/:type', component: ProductListComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  {
    path: 'order-details/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account-details',
    component: AccountDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
