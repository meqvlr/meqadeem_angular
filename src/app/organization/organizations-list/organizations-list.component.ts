import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { OrganizationService } from "../organization.service";
import { Organization } from "../organization.model";
import { AuthService } from "../../auth/auth.service";
import { ImageService } from "../../shared/image.service";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.css']
})
export class OrganizationsListComponent implements OnInit, OnDestroy {
 
  userId: string;
  isLoading = false;
  organizations = [];
  totalPosts = 0; //total no of posts
  postsPerPage = 1; //current page
  currentPage = 1;
  pageSizeOptions = [1, 5, 10];
  organizationAddress = [];
  organizationConditions = [];
  private organizationSub: Subscription;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
private userSub: Subscription;
users:any[]=[];

  constructor(
    private organizationService: OrganizationService,
    private imageService:ImageService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
   

    // this.isLoading = true;
    this.organizationService.getOrganizations(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.organizationSub = this.organizationService
      .getOrganizationUpdateListener()
      .subscribe((organizationData: { organizations: Organization[]; organizationCount: number }) => {
        this.isLoading = false;
        if (organizationData.organizations.length > 0) {
          this.organizations = [organizationData.organizations[0]];
          this.organizationAddress = organizationData.organizations[0].organizationAddress.split("\n");
          let ar = [];
          for (let i = 0; i < this.organizationAddress.length; i++) {
            if (i == this.organizationAddress.length - 1) {
              this.organizationAddress[i] = this.organizationAddress[i].trim() + ".";
            } else {
              this.organizationAddress[i] = this.organizationAddress[i].trim() + ",";
            }
          }
          
        } else {
          this.organizations = organizationData.organizations;
        }

        this.totalPosts = organizationData.organizationCount;
        // //console.log(this.organizations);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
this.authService.getUsers();
this.userSub = this.authService.getUserUpdateListener()
.subscribe((userData) => {
  this.users = userData.users;
  //console.log(this.users);
});

  }
  getUserEmail(userId:string){
	let result="";
	if(userId!=""){
    if(this.users.length>0){
      for(let i=0;i<this.users.length;i++){
        if(this.users[i]._id==userId){
          result=this.users[i].email;
          break;
        }
      }
    }
	}
  return result;
}

  onChangedPage(pageData: PageEvent) {
    //console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.organizationService.getOrganizations(this.postsPerPage, this.currentPage);
  }

  OnDelete(organizationId: string, secretCode:string, imgSource:string) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Confirm Remove Member",
        message: "Are you sure, you want to remove a member: " 
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      // console.log(result);
      if (result === true) {
        this.isLoading = true;
    this.organizationService.deleteOrganization(organizationId).subscribe(
      () => {
        this.organizationService.getOrganizations(this.postsPerPage, this.currentPage);
        let ar_imgSource = imgSource.split("/");
            this.imageService
              .deleteImage(secretCode, ar_imgSource[ar_imgSource.length - 1])
              .subscribe(() => {});
      },
      () => {
        this.isLoading = false;
      }
    );
		}
	});
    
  }

  ngOnDestroy() {
    this.organizationSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
