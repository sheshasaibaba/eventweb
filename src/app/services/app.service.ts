import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public url = 'https://bcfevents.in:3000/';
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  public AuthUserId = new BehaviorSubject('');
  AuthUser = this.AuthUserId.asObservable();
  public AuthUserName = new BehaviorSubject('');
  AuthUserNameval = this.AuthUserName.asObservable();
  public userLocation = new BehaviorSubject('');
  userLocationValue = this.userLocation.asObservable();
  public selectedCategory = new BehaviorSubject('');
  selectedCategoryValue = this.selectedCategory.asObservable();

  ChangeAuthSource(userid: any, username: any) {
    this.AuthUserId.next(userid);
    this.AuthUserName.next(username);
  }
  changeLocation(loc: any) {
    this.userLocation.next(loc);
  }
   changeCategory(cat: any) {
    this.selectedCategory.next(cat);
  }
  constructor(private http: HttpClient) {
  }

  AuthCtrl(call): Observable<any> {
    return this.http.post(this.url + 'auth' + '/' + call.action, call, this.httpOptions);
  }

  MasterCtrl(call): Observable<any> {
    return this.http.post(this.url + 'masters' + '/' + call.action, call, this.httpOptions);
  }

  EventCtrl(call): Observable<any> {
    return this.http.post(this.url + 'events' + '/' + call.action, call, this.httpOptions);
  }

  CustomerCtrl(call): Observable<any> {
    return this.http.post(this.url + 'customers' + '/' + call.action, call, this.httpOptions);
  }

  OrderCtrl(call): Observable<any> {
    return this.http.get(this.url + 'customers' + '/' + call.action, call);
  }
}
