export interface Organization {
  _id: string;
  organizationName: string;
  organizationPhoneNo: string;
  organizationAddress: string;
  organizationEmail:string;
  imgSource: string;
  oldImgSource: string;
  isNewImageAdded: boolean;
  secretCode: string;
  lastUpdatedDate: string;
  creator: string;
}
