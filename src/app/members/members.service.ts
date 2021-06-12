import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import {map} from 'rxjs/operators';
import { Member } from "./member.model";
import { ImageService } from "../shared/image.service";
import {environment} from '../../environments/environment';

const ENV_URL=environment.apiUrl;
const BACKEND_URL=ENV_URL+"/members";

@Injectable()
export class MembersService {
  private members: Member[] = [];
  private membersUpdated = new Subject<{members:Member[],memberCount:number}>();

  constructor(private httpClient: HttpClient, private router: Router, private imageService:ImageService) { }

  getMembers(postsPerPage:number, currentPage: number) {
    // return [...this.members];
    const queryParams=`?pagesize=${postsPerPage}&currentpage=${currentPage}`;
    //console.log(queryParams)
    this.httpClient
      .get<{ message: string; members: Member[] ,maxMembers:number}>(
        BACKEND_URL+queryParams
      )
       .pipe(map((memberData)=>{
            return { 
              members: memberData.members,
              maxMembers:memberData.maxMembers
            };
          }))
      .subscribe(postData => {
        this.members = postData.members;
        
        //console.log(postData);
        this.membersUpdated.next({
                                    members:[...this.members],
                                    memberCount: postData.maxMembers
                                  });;
        
      });
  }

 getMember(id: string) {
    //console.log(id);

    return this.httpClient.get<{
      member:Member
    }>(BACKEND_URL+"/" + id);
  }

  getMemberUpdateListener() {
    return this.membersUpdated.asObservable();
  }

getMembersWithFilters(
    postsPerPage: number,
    currentPage: number,
    searchText: string
  ) {
    // return [...this.members];
    let queryParams = `?pagesize=${postsPerPage}&currentpage=${currentPage}&searchtext=${searchText}`;
    if (searchText == "") {
      queryParams = `?pagesize=${postsPerPage}&currentpage=${currentPage}`;
    }
    //console.log(queryParams);
    this.httpClient
      .get<{ message: string; members: Member[]; maxMembers: number }>(
        BACKEND_URL+"/search" + queryParams
      )
      .pipe(
        map(memberData => {
          //console.log(memberData);
          return {
            members: memberData.members,
            maxMembers: memberData.maxMembers
          };
        })
      )
      .subscribe(postData => {
        this.members = postData.members;

        //console.log(postData);
        this.membersUpdated.next({
          members: [...this.members],
          memberCount: postData.maxMembers
        });
      });
  }
   addMember(member:Member) {
    
    //const member: Member = { _id: null, memberName: memberName, memberSellingPrice: memberSellingPrice,memberCostPrice:memberCostPrice,memberQuantity:memberQuantity };
    this.httpClient
      .post<{ message: string; memberId: string }>(
       BACKEND_URL,
        member
      )
      .subscribe(responseData => {
        // const member_new : Member ={	
        //       // _id:responseData.memberId, 	
        //       // memberName:member.memberName, 	
        //       // memberPhoneNo:member.memberPhoneNo,
        //       // memberAddress:member.memberAddress,
        //       // memberEmail:member.memberEmail,
        //       // memberGSTIN:member.memberGSTIN,
        //       // creator:null
        //     }	
        // console.log(responseData);
        const member_new=member;
            this.members.push(member_new);
            	
            this.membersUpdated.next( {members:[...this.members],
                                    memberCount: this.members.length});
        this.router.navigate(["/members"]);
        if(member_new.isNewImageAdded){
          let fileName_ar=member_new.imgSource.split('/');
          this.imageService.updateImage(fileName_ar[fileName_ar.length-1]);
          
        }
      });
  }

  
  updateMember(member:Member, oldSecretCode:string) {
    const _id = member._id;
    this.httpClient
      .put(BACKEND_URL+"/" + _id, member)
      .subscribe(response => {
      //   const updatedMembers = [...this.members];	
      // const oldMemberIndex =  updatedMembers.findIndex(p => p._id === _id);	
      // const member_new:Member=member;
      // updatedMembers[oldMemberIndex] = member_new;	
      // this.members=updatedMembers;	
      // // this.postsUpdated.next([...this.posts]);
      // this.membersUpdated.next({
      //                               members:[...this.members],
      //                               memberCount: updatedMembers.length
      //                             });;
       this.router.navigate(["/members"]);
       const member_new=member;
       if(member_new.isNewImageAdded){
          let fileName_ar=member_new.imgSource.split('/');
          this.imageService.updateImage(fileName_ar[fileName_ar.length-1]);
          if(member_new.imgSource!=member.oldImgSource && member.oldImgSource!=''){
            let fileNameOld_ar=member_new.oldImgSource.split('/');
            this.imageService.deleteImage(oldSecretCode,fileNameOld_ar[fileNameOld_ar.length-1]).subscribe((responseData)=>{
              // console.log(fileNameOld_ar[fileNameOld_ar.length-1]+" -- "+ responseData);
            });
          }
        }
      });
  }
  
  deleteMember(memberId: string) {
    return this.httpClient
      .delete(BACKEND_URL+"/" + memberId);
  }

}