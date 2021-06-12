import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Observable } from "rxjs";
import { OrganizationService } from "../organization.service";
import { Organization } from "../organization.model";
import { AuthService } from "../../auth/auth.service";
import { ImageService } from "../../shared/image.service";

@Component({
  selector: "app-organization-create",
  templateUrl: "./organization-create.component.html",
  styleUrls: ["./organization-create.component.css"]
})
export class OrganizationCreateComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  isLoading = false;
  organization: Organization;
  organizationName = "";
  organizationPhoneNo = "";
  editMode = false;
  form: FormGroup;
  phoneNoError = false;
  private organizationId: string = "";
  imagePreview = "";
  oldImgSource = "";
  isNewImageAdded = false;
  secretCode = "";
  oldSecretCode = "";
  private imageSub: Subscription;

  constructor(
    private organizationService: OrganizationService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private authService: AuthService
  ) {}
  onCancel() {
    ////console.log("cancelled");
    this.router.navigate(["/organizations/all"]);
    // this.orderForm.reset();
    if (this.isNewImageAdded) {
      let fileName_ar = this.imagePreview.split("/");
      this.imageService
        .deleteImage(this.secretCode, fileName_ar[fileName_ar.length - 1])
        .subscribe(responseData => {
          // console.log(responseData);
        });
    }
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.secretCode = this.uuid();
    this.form = new FormGroup({
      organizationName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      organizationPhoneNo: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      }),
      organizationAddress: new FormControl(null, { validators: [] }),
      organizationEmail: new FormControl(null, {
        validators: [
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ]
      })
    });
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("organizationId")) {
        this.editMode = true;
        this.organizationId = paramMap.get("organizationId");
        this.isLoading = true;
        this.organizationService
          .getOrganization(this.organizationId)
          .subscribe(organizationData => {
            this.isLoading = false;
            //console.log(organizationData);
            const transformedOrganizationData: any = organizationData;
            this.organization = transformedOrganizationData;
            this.oldSecretCode = this.organization.secretCode;
            this.imagePreview = this.organization.imgSource;
            this.oldImgSource = this.organization.imgSource;
            // this.isNewImageAdded = this.member.isNewImageAdded;
            this.isNewImageAdded = false;
            this.form.setValue({
              organizationName: this.organization.organizationName,
              organizationPhoneNo: this.organization.organizationPhoneNo,
              organizationAddress: this.organization.organizationAddress,
              organizationEmail: this.organization.organizationEmail
            });
            //console.log(this.organization);
          });
      } else {
        this.editMode = false;
        this.organizationId = null;
      }
    });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

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
  uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  onSaveOrganization() {
    //console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const organization: Organization = {
      _id: this.organizationId,
      organizationName: this.form.value.organizationName,
      organizationPhoneNo: this.form.value.organizationPhoneNo,
      organizationAddress: this.form.value.organizationAddress,
      organizationEmail: this.form.value.organizationEmail,
      imgSource: this.imagePreview,
      oldImgSource: this.oldImgSource,
      isNewImageAdded: this.isNewImageAdded,
      secretCode: this.oldSecretCode,
      lastUpdatedDate: "",
      creator: ""
    };
    if (organization.oldImgSource == organization.imgSource) {
      organization.oldImgSource = "";
    }
    if (this.isNewImageAdded) {
      organization.secretCode = this.secretCode;
    }
    if (!this.editMode) {
      this.organizationService.addOrganization(organization);
    } else {
      this.organizationService.updateOrganization(
        organization,
        this.oldSecretCode
      );
    }
    //console.log(this.form.value);
    //this.form.reset();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    if (this.isNewImageAdded) {
      this.imageSub.unsubscribe();
    }
  }
}
