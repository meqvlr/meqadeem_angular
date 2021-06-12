import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { Organization } from "../../organization/organization.model";
import { OrganizationService } from "../../organization/organization.service";
import { Member } from "../member.model";
import { MembersService } from "../members.service";

@Component({
  selector: "app-member-view",
  templateUrl: "./member-view.component.html",
  styleUrls: ["./member-view.component.css"]
})
export class MemberViewComponent implements OnInit, OnDestroy {
  rawData: any;
  data: string = "masjid-e-qadeem";

  member: Member = {
    _id: "",
    memberIdNo: "",
    adharNo: "",
    memberName: "",
    parentName: "",
    education: "",
    occupation: "",
    imgSource: "",
    oldImgSource: "",
    isNewImageAdded: false,
    secretCode: "",
    dateOfBirthDate: "",
    gender: "",
    maritalStatus: "",
    address: "",
    phoneNo: "",
    financialStatus: "",
    ownHouse: "",
    isNegative: false,
    negativeComments: "",
    isPoorHealth: false,
    poorHealthComments: "",
    lastUpdatedDate: "",
    creator: "",
    children: []
  };
  memberId = "";
  memberName = "";
organizations:Organization[];
  organization:Organization= {
  _id: "",
  organizationName: "",
  organizationPhoneNo: "",
  organizationAddress: "",
  organizationEmail:"",
  imgSource: "",
  oldImgSource: "",
  isNewImageAdded: false,
  secretCode: "",
  lastUpdatedDate: "",
  creator: "",
}
postsPerPage=1; //current page
  currentPage=1;
 private organizationSub: Subscription;

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private membersService: MembersService,
    private organizationService:OrganizationService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("memberId")) {
        this.memberId = paramMap.get("memberId");
        this.membersService.getMember(this.memberId).subscribe(memberData => {
          // console.log(memberData);
          const transformedMemberData = memberData;
          this.rawData = transformedMemberData;
          this.member = this.rawData;
          // console.log(this.member.memberName);

          // this.data =
          //   this.member.memberIdNo +
          //   "\n" +
          //   this.member.memberName +
          //   "\n" +
          //   this.member.parentName +
          //   "\n" +
          //   this.member.dateOfBirthDate +
          //   "\n" +
          //   this.member.address +
          //   "\n";
        if(this.member.gender=='Male'){
this.data =
            "memberIdNo: " +
            this.member.memberIdNo +
            ", memberName: " +
            this.member.memberName +
            ", parentName: " +
            this.member.parentName +
            ", dateOfBirthDate :" +
            this.getDate(this.member.dateOfBirthDate) +
            ", address: " +
            this.member.address;
        }else{
          this.data =
            "memberIdNo: " +
            this.member.memberIdNo +
            ", memberName: " +
            this.member.memberName +
            ", husbandName: " +
            this.member.parentName +
            ", dateOfBirthDate :" +
            this.getDate(this.member.dateOfBirthDate) +
            ", address: " +
            this.member.address;
        }
          

          // this.data =
          //   "{\nmemberIdNo: " +
          //   this.member.memberIdNo +
          //   ",\nmemberName: " +
          //   this.member.memberName +
          //   ",\nparentName: " +
          //   this.member.parentName +
          //   ",\ndateOfBirthDate: " +
          //   this.member.dateOfBirthDate +
          //   ",\ngender: " +
          //   this.member.gender +
          //   ",\naddress: " +
          //   this.member.address +
          //   "\n}";
          // console.log(memberData.memberName);
        });
      }
    });
    // this.viewInit();
    this.organizationService.getOrganizations(this.postsPerPage, this.currentPage);
this.organizationSub = this.organizationService
      .getOrganizationUpdateListener()
      .subscribe((organizationData: { organizations: Organization[]; organizationCount: number }) => {
        //console.log(organizationData);
        this.organizations = organizationData.organizations;
        if(organizationData.organizationCount>0){
          this.organization=this.organizations[0];
        }
        // if (organizationData.organizations.length > 0) {
        //   this.organization = organizationData.organizations[0];
        //   } else {
        //   this.organizations = organizationData.organizations;
        // }
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
  onCancel() {
    this.router.navigate(["/"]);
  }
  printPage() {
    window.print();
  }
  ngOnDestroy(){
    this.organizationSub.unsubscribe();
  }
}
