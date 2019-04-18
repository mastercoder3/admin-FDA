import { Component, OnInit, NgZone } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  error: boolean=false;
  errMsg;
  user;

  constructor(private router: Router, private fb: FormBuilder, private auth: AuthService, private toastr: ToastrService, private ngzone: NgZone) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
    if(localStorage.getItem('fid'))
      this.ngzone.run(() => this.router.navigate(['/dashboard/home']).then(res =>{
        location.reload();
      })).then();
  }

  get f() { return this.form.controls; }

  onSubmit(email,password){
    this.auth.login(email,password)
      .then(res => {
        localStorage.setItem('fid',res.user.uid);
        this.ngzone.run(() => this.router.navigate(['/dashboard/home']).then(res =>{
          location.reload();
        })).then();
      }, err =>{ 
        this.toastr.error(err.message, 'Login Error!');
      })
  }

}
