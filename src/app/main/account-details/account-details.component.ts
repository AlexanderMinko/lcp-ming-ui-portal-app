import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import Keycloak from 'keycloak-js';
import { filter, switchMap } from 'rxjs/operators';
import { Account, OrderResponseDto } from '../../model/models';
import { OrderService } from '../../service/order.service';
import { forkJoin } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
})
export class AccountDetailsComponent implements OnInit {
  isLogged = false;
  userProfile: Keycloak.KeycloakProfile;
  account: Account;
  photoUrl: string;
  orders: OrderResponseDto[] = [];
  updateAccountFormGroup: FormGroup;

  constructor(private authService: AuthService, private orderService: OrderService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loadFullAccountInfo();
    this.updateAccountFormGroup = this.formBuilder.group({
      image: new FormControl(''),
    });
  }

  loadFullAccountInfo(): void {
    this.authService
      .loadUserProfile()
      .pipe(
        switchMap((profile) => {
          this.userProfile = profile;
          return forkJoin([
            this.orderService.getOrdersByAccountId(profile.id),
            this.authService.getAccount(profile.id),
            this.authService.getAccountPhotoUrl(profile.id),
          ]);
        })
      )
      .subscribe(([orders, account, photoResponse]) => {
        this.orders = orders;
        this.account = account;
        this.photoUrl = photoResponse.photo;
        console.log(this.photoUrl);
      });
  }

  get image(): AbstractControl | null {
    return this.updateAccountFormGroup.get('image');
  }

  onSubmit(): void {
    this.authService.updateAccountPhoto(this.userProfile.id, this.image?.value).subscribe();
  }

  onFileChanged(event): void {
    const input = event.target.files[0];
    this.updateAccountFormGroup.patchValue({
      image: input,
    });
  }
}
