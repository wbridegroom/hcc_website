import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { MessageService } from 'primeng/api';

import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    @ViewChild('userDialog') userDialog: ElementRef;
    @ViewChild('changePasswordDialog') changePasswordDialog: ElementRef;
    modalRef: BsModalRef;

    user: User;
    userForm: FormGroup;
    passwordForm: FormGroup;
    get title() { return this.userForm.get('title'); }
    get userName() { return this.userForm.get('userName'); }
    get firstName() { return this.userForm.get('firstName'); }
    get lastName() { return this.userForm.get('lastName'); }
    get email() { return this.userForm.get('email'); }
    get currentPassword() { return this.passwordForm.get('currentPassword'); }
    get newPassword() { return this.passwordForm.get('newPassword'); }
    get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

    constructor(private authService: AuthService,
                private userService: UserService,
                private modalService: BsModalService,
                private messageService: MessageService) { }

    ngOnInit() {
        this.loadUser();
    }

    loadUser() {
        const auth = this.authService.getAuth();
        this.userService.getUser(auth.userName).subscribe(user => {
            this.user = user;
        });
    }

    showDialog(dialog) {
        this.modalRef = this.modalService.show(dialog);
    }

    showEditProfile() {
        this.userForm = new FormGroup(
            {
                'title': new FormControl(this.user.title),
                'userName': new FormControl({value: this.user.userName, disabled: true}, [Validators.required]),
                'firstName': new FormControl(this.user.firstName),
                'lastName': new FormControl(this.user.lastName),
                'email': new FormControl(this.user.email, [Validators.required, Validators.email]),
            }
        );
        this.showDialog(this.userDialog);
    }

    saveProfile() {
        const user = {
            title: this.title.value,
            userName: this.userName.value,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            email: this.email.value,
            roles: this.user.roles
        } as User;

        this.userService.saveUser(user).subscribe(() => {
            this.loadUser();
        });
    }

    showChangePassword() {
        this.passwordForm = new FormGroup(
            {
                'currentPassword': new FormControl('', [Validators.required]),
                'newPassword': new FormControl('', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$')]),
                'confirmPassword': new FormControl('', [Validators.required])
            }
        );
        this.showDialog(this.changePasswordDialog);
    }

    changePassword() {
        const passwordModel = {
            currentPassword: this.currentPassword.value,
            newPassword: this.newPassword.value
        };
        this.userService.changePassword(this.user.userName, passwordModel).subscribe(() =>
            this.messageService.add({severity: 'success', summary: 'Password Changed', detail: 'Password Changed Successfully'})
        );
    }

}
