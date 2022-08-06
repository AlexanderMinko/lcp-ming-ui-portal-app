import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductDetailsComponent } from './main/product-details/product-details.component';
import { CartDetailsComponent } from './main/cart-details/cart-details.component';
import { OrderDetailsComponent } from './main/order-details/order-details.component';
import { AccountDetailsComponent } from './main/account-details/account-details.component';
import { AuthGuard } from './guard/auth.guard';
import { MessengerComponent } from './main/messenger/messenger.component';
import { AdminPanelComponent } from './main/admin-panel/admin-panel.component';
import { AccountManagementComponent } from './main/admin-panel/account-management/account-management.component';
import { LCP_ADMIN } from './constants';
import { ProductPageComponent } from './main/product-page/product-page.component';
import { AccountInfoComponent } from './main/account-details/account-info/account-info.component';
import { AccountOrdersComponent } from './main/account-details/account-orders/account-orders.component';
import { NotFoundComponent } from './main/not-found/not-found.component';

const routes: Routes = [
  { path: 'products', component: ProductPageComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'products/:attribute/:id', component: ProductPageComponent },
  { path: 'search/:name', component: ProductPageComponent },
  { path: 'sort/:type/:name/:id', component: ProductPageComponent },
  { path: 'sort/:type/:name', component: ProductPageComponent },
  { path: 'sort/:type', component: ProductPageComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    children: [{ path: 'account-management', component: AccountManagementComponent }],
    canActivate: [AuthGuard],
    data: { roles: [LCP_ADMIN] },
  },
  {
    path: 'order-details/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account-details',
    component: AccountDetailsComponent,
    children: [
      { path: 'account-info', component: AccountInfoComponent },
      { path: 'account-orders', component: AccountOrdersComponent },
    ],
    canActivate: [AuthGuard],
  },
  { path: 'messenger', component: MessengerComponent },
  { path: 'page-not-found', component: NotFoundComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
