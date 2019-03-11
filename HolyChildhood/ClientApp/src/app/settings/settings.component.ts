import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user';
import { SelectItem } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Confirm } from '../shared/models/confirm';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    @ViewChild('confirmationDialog') confirmDialog: ElementRef;
    @ViewChild('userDialog') userDialog: ElementRef;
    modalRef: BsModalRef;
    confirmModel: Confirm;

    users: User[];
    roles: SelectItem[];
    isEdit: boolean;

    userForm: FormGroup;
    get selectedRole() { return this.userForm.get('selectedRole'); }
    get title() { return this.userForm.get('title'); }
    get userName() { return this.userForm.get('userName'); }
    get firstName() { return this.userForm.get('firstName'); }
    get lastName() { return this.userForm.get('lastName'); }
    get email() { return this.userForm.get('email'); }
    get password() { return this.userForm.get('password'); }
    get confirmPassword() { return this.userForm.get('confirmPassword'); }

    constructor(private userService: UserService, private modalService: BsModalService) {
        this.roles = [
            { label: 'Administrator', value: 'Administrator' },
            { label: 'Editor', value: 'Editor' },
            { label: 'Member', value: 'Member' }
        ];
    }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }

    showDialog(dialog) {
        this.modalRef = this.modalService.show(dialog);
    }

    showAddUser() {
        this.userForm = new FormGroup(
            {
                'selectedRole': new FormControl('Member'),
                'title': new FormControl(''),
                'userName': new FormControl('', [Validators.required]),
                'firstName': new FormControl(''),
                'lastName': new FormControl(''),
                'email': new FormControl('', [Validators.required, Validators.email]),
                'password': new FormControl('', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$')]),
                'confirmPassword': new FormControl('', [Validators.required])
            }
        );
        this.isEdit = false;
        this.showDialog(this.userDialog);
    }

    showEditUser(user: User) {
        let role = 'Member';
        if (user.roles.length > 0) {
            role = user.roles[0];
        }
        this.userForm = new FormGroup(
            {
                'selectedRole': new FormControl(role),
                'title': new FormControl(user.title),
                'userName': new FormControl({value: user.userName, disabled: true}, [Validators.required]),
                'firstName': new FormControl(user.firstName),
                'lastName': new FormControl(user.lastName),
                'email': new FormControl(user.email, [Validators.required, Validators.email]),
                'password': new FormControl(''),
                'confirmPassword': new FormControl('')
            }
        );
        this.isEdit = true;
        this.showDialog(this.userDialog);
    }

    saveUser() {
        const user = {
            title: this.title.value,
            userName: this.userName.value,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            email: this.email.value,
            password: this.password.value,
            roles: [this.selectedRole.value]
        } as User;

        if (this.isEdit) {
            this.userService.saveUser(user).subscribe(() => {
                this.loadUsers();
            });
        } else {
            this.userService.createUser(user).subscribe(() => {
                this.loadUsers();
            });
        }
    }

    deleteUser(user) {
        this.confirmModel = {
            title: 'Delete User?',
            message: `Are you sure you want to delete ${user.userName}?`,
            onOk: () => {
                this.userService.deleteUser(user).subscribe(() => {
                    this.loadUsers();
                });
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }

}
