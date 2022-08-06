import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Account } from '../../../model/models';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {
  accounts: Account[] = [];
  freeText: string;
  page = 0;
  size = 5;
  totalElements = 0;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this.authService.getAccounts(this.page - 1, this.size, this.freeText)
      .subscribe((accountResponse) => {
        this.accounts = accountResponse.content;
        this.totalElements = accountResponse.totalElements;
        console.log(this.accounts);
      });
  }

  doSearch(freeText: string): void {
    this.freeText = freeText;
    this.getAccounts();
  }
}
