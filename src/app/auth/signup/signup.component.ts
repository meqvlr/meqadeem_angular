import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  hide=true;
  isLoading=false;
  checkBox_adminBool=false
  private authStatusSub:Subscription;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(
      authStatus =>{
        this.isLoading=false;
      }
    );
  }
toggleAdmin(event) {
    //console.log(event.checked);
    this.checkBox_adminBool = event.checked;
  }
  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    //console.log(form.value)
    //console.log(this.checkBox_adminBool)
    this.isLoading=true;
    this.authService.createUser(form.value.email,this.checkBox_adminBool, form.value.password);
    // form.resetForm();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}