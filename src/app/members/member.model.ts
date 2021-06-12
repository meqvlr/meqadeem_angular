import { MemberChild } from "./member-child.model";

export interface Member {
  _id: string;
  memberIdNo: string;
  adharNo: string;
  memberName: string;
  parentName: string;
  education: string;
  occupation: string;
  imgSource: string;
  oldImgSource:string;
  isNewImageAdded:boolean;
  secretCode:string;
  dateOfBirthDate: string;
  gender: string;
  maritalStatus: string;
  address: string;
  phoneNo: string;
  financialStatus: string;
  ownHouse:string;
  isNegative: boolean;
  negativeComments: string;
  isPoorHealth: boolean;
  poorHealthComments: string;
  lastUpdatedDate: string;
  creator: string;
  children: MemberChild[];
}
