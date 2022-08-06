import { Component, OnInit } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Account, Order } from '../../../model/models';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { OrderService } from '../../../service/order.service';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
})
export class AccountInfoComponent implements OnInit {
  userProfile: Keycloak.KeycloakProfile;
  account: Account;
  photoUrl: string;
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
          return forkJoin([this.authService.getAccount(profile.id), this.authService.getAccountPhotoUrl(profile.id)]);
        })
      )
      .subscribe(([account, photoResponse]) => {
        this.account = account;
        this.photoUrl = photoResponse.photo;
      });
  }

  get image(): AbstractControl | null {
    return this.updateAccountFormGroup.get('image');
  }

  onSubmit(): void {
    this.authService.updateAccountPhoto(this.userProfile.id, this.image?.value).subscribe();
  }

  onFileChanged(event: Event): void {
    const files: FileList = (event.target as HTMLInputElement).files as FileList;
    this.updateAccountFormGroup.patchValue({
      image: files,
    });
  }
}
