import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ProductListComponent } from './main/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductDetailsComponent } from './main/product-details/product-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderDetailsComponent } from './main/order-details/order-details.component';
import { CartDetailsComponent } from './main/cart-details/cart-details.component';
import { AsideComponent } from './main/product-list/aside/aside.component';
import { FooterComponent } from './footer/footer/footer.component';
import { HeaderComponent } from './header/header/header.component';
import { CartStatusComponent } from './header/cart-status/cart-status.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './app.init';
import { AccountDetailsComponent } from './main/account-details/account-details.component';
import { LoginComponent } from './header/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessengerComponent } from './main/messenger/messenger.component';
import { AdminPanelComponent } from './main/admin-panel/admin-panel.component';
import { ProductManagementComponent } from './main/admin-panel/product-management/product-management.component';
import { AccountManagementComponent } from './main/admin-panel/account-management/account-management.component';
import { AddProducerComponent } from './main/product-list/product-bar/add-producer/add-producer.component';
import { AddCategoryComponent } from './main/product-list/product-bar/add-category/add-category.component';
import { AddProductComponent } from './main/product-list/product-bar/add-product/add-product.component';
import { EditProductComponent } from './main/product-details/edit-product/edit-product.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailsComponent,
    OrderDetailsComponent,
    CartDetailsComponent,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    CartStatusComponent,
    AccountDetailsComponent,
    LoginComponent,
    MessengerComponent,
    AdminPanelComponent,
    ProductManagementComponent,
    AccountManagementComponent,
    AddProducerComponent,
    AddCategoryComponent,
    AddProductComponent,
    EditProductComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    NgbModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
