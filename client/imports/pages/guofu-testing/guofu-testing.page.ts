import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NotificationsService, SimpleNotificationsComponent, PushNotificationsService} from 'angular2-notifications';


import template from './guofu-testing.page.html';
import { Users } from '../../../../both/collections/users.collection';
import { UserGroups } from '../../../../both/collections/userGroups.collection';
import { UserPermissions } from '../../../../both/collections/userPermissions.collection';

@Component({
  selector: 'guofu-testing',
  template
    // `
    //     <simple-notifications [options]="options"></simple-notifications>
    //     <button (click)="getPermission()">Get push permission</button>
    //
    // `
})

export class GuofuTestingPage implements OnInit{
  fromCollection: any; // collection that is used to retrieve the data
  updateCollection: any; // collection that is used to update
  updateDocumentId: string; // document Id that will be updated

  fromCollection1: any; // collection that is used to retrieve the data
  updateCollection1: any; // collection that is used to update
  updatedDocumentId1: string; // document Id that will be updated
  lookupName1: string; // system lookup name

  fromCollection2: any; // collection that is used to retrieve the data
  updateCollection2: any; // collection that is used to update
  updatedDocumentId2: string; // document Id that will be updated
  lookupName2: string; // system lookup name

  constructor(
    private router: Router,
    private _service: NotificationsService,
    private _push: PushNotificationsService

  ) {}



  public lookupName: string = "updateUserTenants";



  public title: string = 'just a title';
  public content: string = 'just content';
  public type: string = 'success';

  public deleteId: string;

  public temp: boolean[] = [true, false];

  public options = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: 'visible',
    rtl: false,
    animate: 'scale',
    position: ['right', 'bottom']
  };

  private html = `<p>Test</p><p>A nother test</p>`;


  ngOnInit() {







    this.lookupName = 'updateUserTenants';
    // this.lookupName = 'updateUserGroups1';
    this.fromCollection = Users;
    this.updateCollection = Users;
    this.updateDocumentId = "64gEseGzacxnnsee8";

    this.lookupName1 = 'updateUserGroups';
    this.fromCollection1 = UserGroups;
    this.updateCollection1 = Users;
    this.updatedDocumentId1 = "64gEseGzacxnnsee8";

    this.lookupName2 = 'updateGroupPermissions';
    this.fromCollection2 = UserPermissions;
    this.updateCollection2 = UserGroups;
    this.updatedDocumentId2 = "wmQgkMnOYymQKH5fl";
  }

  startCron() {
    Meteor.call('startCron');
  }

  stopCron() {
    Meteor.call('stopCron');

  }

  getPermission() {

    console.log('caonimasdf');
    this._service.success(

      'Some Title',
      'Some Content',
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    )

    // this._push.requestPermission();
    // this._push.create('Test', { body: 'something'}).subscribe(
    //   res => console.log(res),
    //   err => console.log('what', err)
    // )
  }

}
