import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { AngularMaterialModule } from "./angular-material.module";

import { HeaderComponent } from "./header/header.component";
import { MembersListComponent } from "./members/members-list/members-list.component";
import { MemberCreateComponent } from "./members/member-create/member-create.component";
import { MembersService } from "./members/members.service";
import { MemberViewComponent } from "./members/member-view/member-view.component";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";

import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { ResetComponent } from "./auth/reset/reset.component";

import { ImageService } from "./shared/image.service";
import { QRCodeModule } from "angularx-qrcode";

import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { OrganizationCreateComponent } from "./organization/organization-create/organization-create.component";
import { OrganizationsListComponent } from "./organization/organizations-list/organizations-list.component";
import { OrganizationService } from "./organization/organization.service";
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    QRCodeModule,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    MembersListComponent,
    MemberCreateComponent,
    MemberViewComponent,
    ConfirmDialogComponent,
    ErrorComponent,
    LoginComponent,
    SignupComponent,
    ResetComponent,
    OrganizationCreateComponent,
    OrganizationsListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  providers: [
    MembersService,
    ImageService,
    OrganizationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [ErrorComponent, ConfirmDialogComponent]
})
export class AppModule {}
