import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MemberCreateComponent } from "./members/member-create/member-create.component";
import { MemberViewComponent } from "./members/member-view/member-view.component";
import { MembersListComponent } from "./members/members-list/members-list.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { ResetComponent } from "./auth/reset/reset.component";
import { AuthGuard } from "./auth/auth.guard";
import { OrganizationsListComponent } from "./organization/organizations-list/organizations-list.component";
import { OrganizationCreateComponent } from "./organization/organization-create/organization-create.component";

const routes: Routes = [
  { path: "", redirectTo: "/members", pathMatch: "full" }, //only redirect if full path is empty
  {
    path: "members",
    children: [
      { path: "", component: MembersListComponent, canActivate: [AuthGuard] },
      {
        path: "new",
        component: MemberCreateComponent,
        canActivate: [AuthGuard]
      }, //after id (new) will be affected
      {
        path: "edit/:memberId",
        component: MemberCreateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "view/:memberId",
        component: MemberViewComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
path: "organizations",
children: [
  { path: "all", component: OrganizationsListComponent, canActivate: [AuthGuard] },
  { path: "new", component: OrganizationCreateComponent, canActivate: [AuthGuard] }, //after id (new) will be affected
  { path: "edit/:organizationId", component: OrganizationCreateComponent, canActivate: [AuthGuard] }
	]
},
  { path: "login", component: LoginComponent },
  { path: "regin/shafmoin1520/signup", component: SignupComponent },
  { path: "reset", component: ResetComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
