import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MeteorObservable } from "meteor-rxjs";
import { Session } from 'meteor/session';
import {Observable} from 'rxjs/Observable';
import {MdSort} from '@angular/material';
import {MdPaginator} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk';


import { Users } from '../../../../both/collections/users.collection';
import { Products } from '../../../../both/collections/products.collection';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import { DialogComponent } from '../dialog/dialog.component';
import template from './system-lookup.component.html';
import style from './system-lookup.component.scss';

import template1 from './template1.html';
import Dependency = Tracker.Dependency;

@Component({
  selector: 'system-lookup',
  template,
  styles: [ style ]
})

export class SystemLookupComponent implements OnInit, OnChanges, OnDestroy {
  @Input() lookupName: string;
  @Input() updateDocumentId: any;
  @Input() data: any;
  @Output() onSelected = new EventEmitter<string>();
  // @ViewChild('statusDropboxTmpl') statusDropboxTmpl: TemplateRef<any>;  // used to update status of group permissions, (unconfigured, enabled, disabled)
  // @ViewChild('lookupTmpl') lookupTmpl: TemplateRef<any>; // used to pop out the window to change the tenants groups
  // @ViewChild('removeTmpl') removeTmpl: TemplateRef<any>; // used to remove the user
  // @ViewChild('actionsTmpl') actionsTmpl: TemplateRef<any>; // used to remove the user
  // @ViewChild('softRemoveActionsTmpl') softRemoveActionsTmpl: TemplateRef<any>; // used to remove the user

  displayedColumns = ['userId', 'userName', 'progress', 'color'];
  exampleDatabase = new ExampleDatabase();
  liveDatabase = new LiveDatabase();
  dataSource: ExampleDataSource | null;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(public dialog: MdDialog) {}

  ngOnInit() {

    var i = 0;

    this.dataSource = new ExampleDataSource(this.exampleDatabase);
    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //   .debounceTime(150)
    //   .distinctUntilChanged()
    //   .subscribe(() => {
    //     if (!this.dataSource) { return; }
    //
    //     this.dataSource.filter = this.filter.nativeElement.value;
    //   });

  }

  ngOnChanges() {

  }

  onEnter(value) {
    console.log('asdf');
    this.dataSource = null;
    // this.dataSource = new ExampleDataSource(this.exampleDatabase);
  }

  sortData(event) {
  }


  ngOnDestroy() {
  }
}

function parseAll(args, objLocal) {
  return args.map((arg) => {
    arg = parseDollar(arg);
    arg = parseDot(arg);
    arg = parseParams(arg, objLocal);
    return arg.value;
  });
}

function parseDollar(obj:any) {
  obj = JSON.stringify(obj);
  obj = obj.replace(/_\$/g, '$');
  obj = JSON.parse(obj);
  return obj;
}

function parseDot(obj:any) {
  obj = JSON.stringify(obj);
  obj = obj.replace(/_DOT_/g, '.');
  obj = JSON.parse(obj);
  return obj;
}

function parseParams(obj:any, objLocal:any={}) {
  let copiedObj = Object.assign({}, obj);
  obj = JSON.stringify(obj);

  if ('params' in copiedObj) {
    copiedObj.params.forEach((param, index) => {

      if(param.indexOf('.') !== -1) {
        let arrParam = param.split('.');
        let copiedObjLocal = Object.assign({}, objLocal);
        arrParam.forEach((param, i) => {
          copiedObjLocal = copiedObjLocal[param];
          if (i == arrParam.length-1) {
            if (typeof copiedObjLocal != 'string') {
              copiedObjLocal = JSON.stringify(copiedObjLocal);
              obj = obj.replace(new RegExp('"_VAR_' + index + '"', 'g'), copiedObjLocal);
            } else {
              obj = obj.replace(new RegExp('_VAR_' + index, 'g'), copiedObjLocal);
            }
          }
        })
      } else {
        if (['boolean', 'number'].indexOf(typeof objLocal[param]) >= 0) {
          // if it is a boolean or number
          obj = obj.replace(new RegExp('"_VAR_' + index + '"', 'g'), objLocal[param]);
        } else {
          obj = obj.replace(new RegExp('_VAR_' + index, 'g'), objLocal[param]);
        }
      }
    });
  }
  obj = JSON.parse(obj);
  return obj;
}

function generateRegex(fields: Object, keywords) {
  let obj = {
    $or: []
  };
  Object.keys(fields).forEach((key, index) => {
    obj.$or.push({
      [key]: {$regex: new RegExp(keywords, 'i')}
    })
  });
  return obj;
}


@Component({
  selector: 'dialog-Select',
  template: template1
})

export class DialogSelect {
  constructor(public dialogRef: MdDialogRef<DialogSelect>) {}
}




/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}


export class LiveDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() {
    MeteorObservable.subscribe('products', {}, {}, '').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        Products.find().forEach(user => {
          this.addUser(user);
        })
        // Products.collection.find().fetch().forEach(user => {
        //   this.addUser(user);
        // });
      })
    });
  }

  addUser(user:any) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewUser(user));
    this.dataChange.next(copiedData);
  }

  private createNewUser(user:any) {
    const name = user.username;

    return {
      id: (this.data.length + 1).toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }
}



/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 100; i++) { this.addUser(); }
  }

  /** Adds a new user to the database. */
  addUser() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewUser());
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser() {
    const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: (this.data.length + 1).toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }
}


/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */

export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _exampleDatabase: any) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect() {

    const displayDataChanges = [
      this._exampleDatabase.dataChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data =  this._exampleDatabase.data;
      return data;
    });
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  // getSortedData(data): UserData[] {
  //   // const data = this._exampleDatabase.data.slice();
  //   if (!this._sort.active || this._sort.direction === '') { return data; }
  //
  //   return data.sort((a, b) => {
  //     let propertyA: number|string = '';
  //     let propertyB: number|string = '';
  //
  //     switch (this._sort.active) {
  //       case 'userId': [propertyA, propertyB] = [a.id, b.id]; break;
  //       case 'userName': [propertyA, propertyB] = [a.name, b.name]; break;
  //       case 'progress': [propertyA, propertyB] = [a.progress, b.progress]; break;
  //       case 'color': [propertyA, propertyB] = [a.color, b.color]; break;
  //     }
  //
  //     const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
  //     const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
  //
  //     return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
  //   });
  // }
}