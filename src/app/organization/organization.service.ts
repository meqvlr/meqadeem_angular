import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Organization } from "./organization.model";
import { ImageService } from "../shared/image.service";
import {environment} from '../../environments/environment';

const ENV_URL=environment.apiUrl;
const BACKEND_URL = ENV_URL + "/organizations";

@Injectable()
export class OrganizationService {
  private organizations: Organization[] = [];
  private organizationsUpdated = new Subject<{ organizations: Organization[]; organizationCount: number }>();
  constructor(private httpClient: HttpClient, private router: Router, private imageService:ImageService) {}

  getOrganizations(postsPerPage: number, currentPage: number) {
    // return [...this.organizations];
    const queryParams = `?pagesize=${postsPerPage}&currentpage=${currentPage}`;
    //console.log(queryParams);
    this.httpClient
      .get<{ message: string; organizations: Organization[]; maxOrganizations: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(organizationData => {
          return {
            organizations: organizationData.organizations,
            maxOrganizations: organizationData.maxOrganizations
          };
        })
      )
      .subscribe(postData => {
        this.organizations = postData.organizations;

        //console.log(postData);
        this.organizationsUpdated.next({
          organizations: [...this.organizations],
          organizationCount: postData.maxOrganizations
        });
      });
  }

  getOrganization(id: string) {
    //console.log(id);

    return this.httpClient.get<{
      organization: Organization;
    }>(BACKEND_URL + "/" + id);
  }

  getOrganizationUpdateListener() {
    return this.organizationsUpdated.asObservable();
  }

  addOrganization(organization: Organization) {
    //const organization: Organization = { _id: null, organizationName: organizationName, organizationSellingPrice: organizationSellingPrice,organizationCostPrice:organizationCostPrice,organizationQuantity:organizationQuantity };
    this.httpClient
      .post<{ message: string; organizationId: string }>(BACKEND_URL, organization)
      .subscribe(responseData => {
        const organization_new: Organization = {
          _id: responseData.organizationId,
          organizationName: organization.organizationName,
          organizationPhoneNo: organization.organizationPhoneNo,
          organizationAddress: organization.organizationAddress,
          organizationEmail:organization.organizationEmail,
          imgSource: organization.imgSource,
          oldImgSource: organization.oldImgSource,
          isNewImageAdded: organization.isNewImageAdded,
          secretCode: organization.secretCode,
          lastUpdatedDate: organization.lastUpdatedDate,
          creator: null
        };
        this.organizations.push(organization_new);

        this.organizationsUpdated.next({
          organizations: [...this.organizations],
          organizationCount: this.organizations.length
        });
        this.router.navigate(["/organizations/all"]);
      });
  }

  updateOrganization(organization: Organization, oldSecretCode:string) {
    const _id = organization._id;
    this.httpClient.put(BACKEND_URL + "/" + _id, organization).subscribe(response => {
      //   const updatedOrganizations = [...this.organizations];
      // const oldOrganizationIndex =  updatedOrganizations.findIndex(p => p._id === _id);
      // const organization_new:Organization=organization;
      // updatedOrganizations[oldOrganizationIndex] = organization_new;
      // this.organizations=updatedOrganizations;
      // // this.postsUpdated.next([...this.posts]);
      // this.organizationsUpdated.next({
      //                               organizations:[...this.organizations],
      //                               organizationCount: updatedOrganizations.length
      //                             });;
      this.router.navigate(["/organizations/all"]);
       const organization_new=organization;
       if(organization_new.isNewImageAdded){
          let fileName_ar=organization_new.imgSource.split('/');
          this.imageService.updateImage(fileName_ar[fileName_ar.length-1]);
          if(organization_new.imgSource!=organization.oldImgSource){
            let fileNameOld_ar=organization_new.oldImgSource.split('/');
            this.imageService.deleteImage(oldSecretCode,fileNameOld_ar[fileNameOld_ar.length-1]).subscribe((responseData)=>{
              console.log(fileNameOld_ar[fileNameOld_ar.length-1]+" -- "+ responseData);
            });
          }
        }
    });
  }

  deleteOrganization(organizationId: string) {
    return this.httpClient.delete(BACKEND_URL + "/" + organizationId);
  }
}
