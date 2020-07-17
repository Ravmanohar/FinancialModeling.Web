import { Component, OnInit, Input } from '@angular/core';
import { LookupService } from 'src/app/services';
import { UserDto } from 'src/app/models/user-model';
import { AccountService } from 'src/app/services/account.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

declare var $;
declare var toastr;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @Input() clientId: number = null;
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService) {
    console.log(this.clientId);
  }

  users: any = [];

  isShowLoader: boolean = false;
  ngOnInit() {
    this.getUsersByClientId();
  }

  getUsersByClientId() {
    this.isShowLoader = true;
    let clientId: number = this.clientId;
    this.accountService.getUsersByClientId(clientId)
      .subscribe((users: Array<UserDto>) => {
        this.users = users;
        this.isShowLoader = false;
      });
  }

  showAddUserModal() {
    $("#add-user-modal").modal('show');
  }

  onUserAdded() {
    $("#add-user-modal").modal('hide');
    this.getUsersByClientId();
  }

  editedUser: any = null
  editUser(editedUser: any) {
    console.log("editUser", editedUser);
    this.editedUser = editedUser;
    $("#edit-user-modal").modal('show');
  }

  onUserStatusChange(user: UserDto) {
    this.isShowLoader = true;
    user.isActive = !user.isActive;
    this.accountService.onUserStatusChange(user)
      .subscribe((isDeleted: boolean) => {
        this.isShowLoader = false;
        if (user.isActive)
          toastr.success("User is ACTIVATED.", "Success");
        else
          toastr.success("User is DEACTIVATED.", "Success");
      });
  }

  selectedUserId: string = null;
  onShowResetPasswordModal(user: UserDto) {
    this.selectedUserId = user.userId;
    $("#reset-password-modal").modal('show');
  }

}
