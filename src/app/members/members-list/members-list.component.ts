import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Member } from "../member.model";
import { FormControl, FormGroup } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MembersService } from "../members.service";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ImageService } from "../../shared/image.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-members-list",
  templateUrl: "./members-list.component.html",
  styleUrls: ["./members-list.component.css"]
})
export class MembersListComponent implements OnInit, OnDestroy {
  members: Member[] = [];
  isLoading = false;
  private memberSub: Subscription;
  form: FormGroup;
  breakpoint = 3;
  totalPosts = 0; //total no of posts
  postsPerPage = 10; //current page
  currentPage = 1;
  pageSizeOptions = [10, 20, 30];
  searchText_Value = "";
  userId: string;

  userIsAuthenticated = false;
  private postSub: Subscription;
  private authStatusSub: Subscription;

  private userSub: Subscription;
  users: any[] = [];

userRole:boolean = false;

  constructor(
    private membersService: MembersService,
    private dialog: MatDialog,
    private router: Router,
    private imageService: ImageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.isLoading=true; //Needs to be uncomment
    this.form = new FormGroup({
      searchText: new FormControl(this.searchText_Value)
    });
    this.breakpoint = 3;
    this.breakpoint = window.innerWidth <= 1200 ? 3 : 6;
    this.membersService.getMembers(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.memberSub = this.membersService
      .getMemberUpdateListener()
      .subscribe((memberData: { members: Member[]; memberCount: number }) => {
        this.isLoading = false;
        this.members = memberData.members;
        this.totalPosts = memberData.memberCount;
        // //console.log(this.members);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.authService
        .getUser(this.authService.getUserId())
        .subscribe(userEmailData => {
          this.userRole = userEmailData.userRole;
          // this.userEmail=this.userEmail.substring(0,this.userEmail.search("@"))
        });
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.authService.getUsers();
    this.userSub = this.authService
      .getUserUpdateListener()
      .subscribe(userData => {
        this.users = userData.users;
        //console.log(this.users);
      });
  }
  getUserEmail(userId: string) {
    let result = "";
    if (userId != "") {
      if (this.users.length > 0) {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i]._id == userId) {
            result = this.users[i].email;
            break;
          }
        }
      }
    }
    return result;
  }
  onAddMember() {
    this.router.navigate(["/members/new"]);
  }
  onSearchItem() {
    let searchText = "";

    this.totalPosts = 0;
    this.postsPerPage = 5; //current page
    this.currentPage = 1;
    if (this.form.value.searchText != null) {
      searchText = this.form.value.searchText;
    }

    this.searchText_Value = searchText;

    this.membersService.getMembersWithFilters(
      this.postsPerPage,
      this.currentPage,
      searchText
    );
    this.memberSub = this.membersService
      .getMemberUpdateListener()
      .subscribe((memberData: { members: Member[]; memberCount: number }) => {
        this.isLoading = false;
        this.members = memberData.members;
        this.totalPosts = memberData.memberCount;
        //console.log(this.members);
      });
  }
  onChangedPage(pageData: PageEvent) {
    //console.log(pageData)
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.membersService.getMembers(this.postsPerPage, this.currentPage);
  }
  OnDelete(
    memberId: string,
    memberName: string,
    secretCode: string,
    imgSource: string
  ) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Confirm Remove Member",
        message: "Are you sure, you want to remove a member: " + memberName
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      console.log(result);
      if (result === true) {
        this.isLoading = true;
        this.membersService.deleteMember(memberId).subscribe(
          () => {
            this.membersService.getMembers(this.postsPerPage, this.currentPage);
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
  getDate(inputDate: string) {
    let result = "";
    if (inputDate != "") {
      let date = new Date(inputDate);
      if (date.toDateString() != "") {
        let dateArray = date
          .toDateString()
          .substring(4)
          .split(" ");
        result =
          dateArray[1].toString() +
          "-" +
          dateArray[0].toString().toUpperCase() +
          "-" +
          dateArray[2].toString();
      }
    }

    return result;
  }
  onResize(event) {
    this.breakpoint = 3;
    if (event.target.innerWidth >= 1200) {
      this.breakpoint = 6;
    }
  }
  ngOnDestroy() {
    this.memberSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
