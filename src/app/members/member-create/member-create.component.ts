import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Params, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Member } from "../member.model";
import { MembersService } from "../members.service";
import {Subscription} from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";
import { ImageService } from "../../shared/image.service";


@Component({
  selector: "app-member-create",
  templateUrl: "./member-create.component.html",
  styleUrls: ["./member-create.component.css"]
})
export class MemberCreateComponent implements OnInit, OnDestroy {
  isLoading = false;
  editMode = false;
  memberId = null;
  memberIdNo = "";
  breakpoint: number;
  form: FormGroup;
  imagePreview = "";
  radioButtonGenderVal = "Male";
  selectedMaritalStatus = "Married";
  selectedFinancialStatus = "Low Income";
  radioButtonOwnHouseVal = "No";
  checkBox_negativeBool = false;
  checkBox_isPoorHealth = false;
  oldImgSource = "";
  isNewImageAdded = false;
  secretCode = "";
  oldSecretCode="";
  member: any;
  private imageSub: Subscription;
 private authStatusSub: Subscription;
  userIsAuthenticated = false;
userRole:boolean = false;
  constructor(
    private membersService: MembersService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private imageService: ImageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.breakpoint = 1;
    this.breakpoint = window.innerWidth <= 1200 ? 1 : 4;
this.authStatusSub=this.authService
                          .getAuthStatusListener()
                          .subscribe(authStatus=>{
                            this.isLoading=false;
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
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("memberId")) {
        this.editMode = true;
        this.memberId = paramMap.get("memberId");
      } else {
        this.editMode = false;
        this.memberId = null;
      }
    });
    this.formInit();
  }

  formInit() {
    let adharNo = "";
    let memberName = "";
    let parentName = "";
    let education = "";
    let occupation = "";
    let dateOfBirthDate = "";
    let address = "";
    let gender = this.radioButtonGenderVal;
    let maritalStatus = this.selectedMaritalStatus;
    let ownHouse = this.radioButtonOwnHouseVal;
    let financialStatus = this.selectedFinancialStatus;
    let phoneNo = "";
    let negativeComments = "";
    let poorHealthComments = "";
    let isNegative = false;
    let isPoorHealth = false;
    let children = new FormArray([]);
    this.secretCode = this.uuid();
    this.form = new FormGroup({
      adharNo: new FormControl(adharNo, {
        validators: [
          Validators.required,
          Validators.pattern("^[0-9]{12}$"),
          Validators.minLength(12),
          Validators.maxLength(12)
        ]
      }),
      memberName: new FormControl(memberName, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      parentName: new FormControl(parentName, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      education: new FormControl(education, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      occupation: new FormControl(occupation, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      dateOfBirthDate: new FormControl(dateOfBirthDate, {
        validators: [Validators.required]
      }),
      gender: new FormControl(gender),
      maritalStatus: new FormControl(maritalStatus),
      address: new FormControl(address, { validators: [Validators.required] }),
      phoneNo: new FormControl(phoneNo, {
        validators: [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      }),
      financialStatus: new FormControl(financialStatus),
      ownHouse: new FormControl(ownHouse),
      isNegative: new FormControl(isNegative),
      negativeComments: new FormControl(negativeComments),
      isPoorHealth: new FormControl(isPoorHealth),
      poorHealthComments: new FormControl(poorHealthComments),
      children: children
    });

    if (this.editMode) {
      this.membersService.getMember(this.memberId).subscribe(memberData => {
        this.isLoading = false;
        // console.log(memberData);
        this.member = memberData;
        this.oldSecretCode = this.member.secretCode;
        // console.log("this.member");
        // console.log(this.member);
        adharNo = this.member.adharNo;
        memberName = this.member.memberName;
        parentName = this.member.parentName;
        education = this.member.education;
        occupation = this.member.occupation;
        dateOfBirthDate = this.member.dateOfBirthDate;
        address = this.member.address;
        gender = this.member.gender;
        maritalStatus = this.member.maritalStatus;
        ownHouse = this.member.ownHouse;
        financialStatus = this.member.financialStatus;
        phoneNo = this.member.phoneNo;
        negativeComments = this.member.negativeComments;
        poorHealthComments = this.member.poorHealthComments;
        this.imagePreview = this.member.imgSource;
        this.oldImgSource = this.member.imgSource;
        // this.isNewImageAdded = this.member.isNewImageAdded;
        this.isNewImageAdded=false;

        this.memberIdNo = this.member.memberIdNo;
        isNegative = this.member.isNegative;
        isPoorHealth = this.member.isPoorHealth;
        if (this.member.negativeComments != "") {
          //  isNegative = true;
          this.checkBox_negativeBool = true;
        }
        if (this.member.poorHealthComments != "") {
          // isPoorHealth=true;
          this.checkBox_isPoorHealth = true;
        }
        if (this.member["children"]) {
          for (let child of this.member.children) {
            children.push(
              new FormGroup({
                childName: new FormControl(
                  child.childName,
                  Validators.required
                ),
                childGender: new FormControl(
                  child.childGender,
                  Validators.required
                ),
                childDOB: new FormControl(child.childDOB, [
                  Validators.required
                ]),
                childRelation: new FormControl(child.childRelation, [
                  Validators.required
                ]),
                childEducation: new FormControl(child.childEducation),
                childOccupation: new FormControl(child.childOccupation)
              })
            );
          }
        }
        this.form = new FormGroup({
          adharNo: new FormControl(adharNo, {
            validators: [
              Validators.required,
              Validators.pattern("^[0-9]{12}$"),
              Validators.minLength(12),
              Validators.maxLength(12)
            ]
          }),
          memberName: new FormControl(memberName, {
            validators: [Validators.required, Validators.minLength(3)]
          }),
          parentName: new FormControl(parentName, {
            validators: [Validators.required, Validators.minLength(3)]
          }),
          education: new FormControl(education, {
            validators: [Validators.required, Validators.minLength(3)]
          }),
          occupation: new FormControl(occupation, {
            validators: [Validators.required, Validators.minLength(3)]
          }),
          dateOfBirthDate: new FormControl(dateOfBirthDate, {
            validators: [Validators.required]
          }),
          gender: new FormControl(gender),
          maritalStatus: new FormControl(maritalStatus),
          address: new FormControl(address, {
            validators: [Validators.required]
          }),
          phoneNo: new FormControl(phoneNo, {
            validators: [
              Validators.required,
              Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
              Validators.minLength(10),
              Validators.maxLength(10)
            ]
          }),
          financialStatus: new FormControl(financialStatus),
          ownHouse: new FormControl(ownHouse),
          isNegative: new FormControl(isNegative),
          negativeComments: new FormControl(negativeComments),
          isPoorHealth: new FormControl(isPoorHealth),
          poorHealthComments: new FormControl(poorHealthComments),
          children: children
        });
      });
    }
  }

  get controls() {
    // a getter!
    return (<FormArray>this.form.get("children")).controls;
  }

  onAddChild() {
    let childName = "";
    let genderInit = "Female";
    let childDOB = "";
    let relationInit = "Wife";
    let education = "";
    let occupation = "";
    (<FormArray>this.form.get("children")).push(
      new FormGroup({
        childName: new FormControl(childName, Validators.required),
        childGender: new FormControl(genderInit, Validators.required),
        childDOB: new FormControl(childDOB, [Validators.required]),
        childRelation: new FormControl(relationInit, [Validators.required]),
        childEducation: new FormControl(education),
        childOccupation: new FormControl(occupation)
      })
    );
  }

  onDeleteChild(index: number) {
    (<FormArray>this.form.get("children")).removeAt(index);
  }

  onResize(event) {
    this.breakpoint = 1;
    if (event.target.innerWidth >= 1200) {
      this.breakpoint = 4;
    }
    // this.breakpoint = event.target.innerWidth >= 650 ? 5 : 1;
    // console.log("event.target.innerWidth");
    // console.log(event.target.innerWidth);
    // console.log("this.breakpoint");
    // console.log(this.breakpoint);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // this.form.patchValue({
    //   image:file
    // });
    // this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // this.oldImgSource = this.imagePreview;
      this.imagePreview = reader.result as string;
    };
    // reader.readAsDataURL(file);
    // console.log("this.secretCode --> Image Picked");
    // console.log(this.secretCode);
    // console.log(this.oldSecretCode);
    this.imageService.addImage(this.secretCode, file);
    this.imageSub = this.imageService
      .getImageUpdateListener()
      .subscribe(fileData => {
        // console.log(fileData.fileName);
        this.imagePreview = "https://peaceful-headland-81111.herokuapp.com/image/" + fileData.fileName;
        this.isNewImageAdded = true;
      });
  }
  getRadioButtonGender(value) {
    this.radioButtonGenderVal = value;

    //console.log(value);
  }
  getMaritalStatus(value) {
    this.selectedMaritalStatus = value;
  }
  getRadioButtonOwnHouse(value) {
    this.radioButtonOwnHouseVal = value;

    //console.log(value);
  }
  getFinancialStatus(value) {
    this.selectedFinancialStatus = value;
  }
  toggleNegative(event) {
    //console.log(event.checked);
    this.checkBox_negativeBool = event.checked;
  }
  togglePoorHealth(event) {
    //console.log(event.checked);
    this.checkBox_isPoorHealth = event.checked;
  }
  uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  onSaveMember() {
    // console.log(this.form.value);
    let childrenData: any[] = [];
    let warnMsg = "";
    if (
      this.form.value.isNegative == false &&
      this.form.value.negativeComments != ""
    ) {
      warnMsg =
        "Negative Comments field is not checked but description is provided. Please confirm to remove Negative comments.";
    }
    if (
      this.form.value.isPoorHealth == false &&
      this.form.value.poorHealthComments != ""
    ) {
      if (warnMsg != "") {
        warnMsg = warnMsg + "\n";
      }
      warnMsg =
        warnMsg +
        "Poor Health Comments field is not checked but description is provided. Please confirm to remove Poor Health Comments.";
    }
    // console.log(warnMsg);

    let data: Member = {
      _id: this.memberId,
      memberIdNo: this.memberIdNo,
      adharNo: this.form.value.adharNo,
      memberName: this.form.value.memberName,
      parentName: this.form.value.parentName,
      education: this.form.value.education,
      occupation: this.form.value.occupation,
      imgSource: this.imagePreview,
      oldImgSource: this.oldImgSource,
      isNewImageAdded: this.isNewImageAdded,
      secretCode: this.oldSecretCode,
      dateOfBirthDate: this.form.value.dateOfBirthDate,
      gender: this.form.value.gender,
      maritalStatus: this.form.value.maritalStatus,
      address: this.form.value.address,
      phoneNo: this.form.value.phoneNo,
      financialStatus: this.form.value.financialStatus,
      ownHouse: this.form.value.ownHouse,
      isNegative: this.form.value.isNegative,
      negativeComments: this.form.value.negativeComments,
      isPoorHealth: this.form.value.isPoorHealth,
      poorHealthComments: this.form.value.poorHealthComments,
      lastUpdatedDate: "",
      creator: "",
      children: this.form.value.children
    };
    if(data.oldImgSource==data.imgSource){
        data.oldImgSource="";
      }
    if(this.isNewImageAdded){
      data.secretCode=this.secretCode;
    }
    // console.log(data);
    if (
      (this.form.value.isNegative == false &&
        this.form.value.negativeComments != "") ||
      (this.form.value.isPoorHealth == false &&
        this.form.value.poorHealthComments != "")
    ) {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Data Loss Warning!!!",
          message: warnMsg
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        // console.log(result);
        if (result === true) {
          if (!this.editMode) {
            this.membersService.addMember(data);
          } else {
            this.membersService.updateMember(data,this.oldSecretCode);
          }
        }
      });
    } else {
      if (!this.editMode) {
        this.membersService.addMember(data);
      } else {
        this.membersService.updateMember(data,this.oldSecretCode);
      }
    }

    
  }
  onCancel() {
    this.router.navigate(["/"]);
    if (this.isNewImageAdded) {
      let fileName_ar = this.imagePreview.split("/");
      this.imageService
        .deleteImage(this.secretCode, fileName_ar[fileName_ar.length - 1])
        .subscribe(responseData => {
          // console.log(responseData);
        });
    }
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    if (this.isNewImageAdded) {
      this.imageSub.unsubscribe();
    }
  }
}
