import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../services/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SigninComponent } from '../userprofile/signin/signin.component';

export interface DialogData {
    locationData: [];
}
declare const google: any;

@Component({
    selector: 'app-bcfevents',
    templateUrl: './bcfevents.component.html',
    styleUrls: ['./bcfevents.component.css']
})
export class BcfeventsComponent implements OnInit {

    public CategoryList = [];
    locations = [];
    selectedLocation;
    locationName = '';
    username: string;
    userid: any;
    detectedCity: any;
    userLoc: any;
    constructor(
        private appserv: AppService,
        private router: Router,
        public dialog: MatDialog,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.appserv.AuthUser.subscribe(d => this.userid = d);
        this.appserv.AuthUserNameval.subscribe(d => this.username = d);
        this.appserv.userLocationValue.subscribe(d => {
            this.userLoc = d;
            this.locationName = this.userLoc.LocationName;
        });
        console.log(this.userid);
        console.log(this.username);

        if (!localStorage.getItem('detectedLocation')) {
            this.findMe();
        }

        if (localStorage.getItem('UserName') && localStorage.getItem('UserId')) {
            this.appserv.ChangeAuthSource(localStorage.getItem('UserId'), localStorage.getItem('UserName'));
            this.username = localStorage.getItem('UserName');
            this.userid = localStorage.getItem('UserId');
        } else {
            this.username = '';
            this.userid = '';
        }
        console.log(this.userid);
        console.log(this.username);

        // if (localStorage.getItem('locid') != undefined) {
        //     console.log("location id " + localStorage.getItem('locid'));
        //     this.selectedLocation = +localStorage.getItem('locid');
        // }

        this.LocationList();
        this.CategoriesList();
    }

    openDialog(): void {
        const dialogPosition = {
            top: '50px'
        };
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '490px',
            height: '220px',
            data: { locationData: this.locations },
            disableClose: true,
            position: dialogPosition
        });

        dialogRef.afterClosed().subscribe(result => {
            this.LocationList();
        });
    }
    LocationList() {
        const call = { action: 'locations' };
        this.appserv.MasterCtrl(call)
            .subscribe(
                (res) => {
                    // console.log(res);
                    if (res.status == 'SUCCESS') {
                        this.locations = res.data;
                        if (localStorage.getItem('locid') == undefined) {
                            // this.selectedLocation = this.locations[0].LocationId;
                            this.openDialog();
                        } else {
                            this.selectedLocation = +localStorage.getItem('locid');
                        }
                        console.log(this.selectedLocation);
                        if (!this.locationName) {
                            this.locationName = this.getLocationName(this.selectedLocation);
                            console.log(this.locationName);
                        }
                    } else {
                        this.locations = [];
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    getLocationName(id) {
        console.log(id);
        const loc = this.locations.filter(a => a.LocationId == +id);
        console.log(loc);
        if (loc.length > 0) {
            this.appserv.changeLocation(loc[0]);
            localStorage.setItem('location', JSON.stringify(loc[0]));
            return loc.length > 0 ? loc[0].LocationName : '';
        }
    }


    CategoriesList() {
        const call = { action: 'categories' };
        this.appserv.MasterCtrl(call)
            .subscribe(
                (res) => {
                    console.log(res);
                    if (res.status == 'SUCCESS') {
                        this.CategoryList = res.data;
                    }
                    else {
                        this.CategoryList = [];
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    SelectiveLocation(loc) {
        console.log('Select Locations ' + loc);
        this.selectedLocation = loc;
        localStorage.setItem('locid', loc);
        this.locationName = this.getLocationName(this.selectedLocation);
    }

    Logout() {
        localStorage.clear();
        this.userid = this.username = '';
        this.appserv.ChangeAuthSource('', '');
        this.router.navigate(['bcfevents']);
        window.location.reload();
    }

    goToevents(category: any) {
        this.appserv.changeCategory(category);
        localStorage.setItem('eventTypeId', JSON.stringify(category.ID));
        category.NAME = category.NAME.replace(/\s/g, '');
        this.router.navigate(['/' + this.locationName + '/' + category.NAME]);
    }
    findMe() {
        let lat: number;
        let long: number;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                // this.showPosition(position);
                lat = position.coords.latitude;
                long = position.coords.longitude;
                const geocoder = new google.maps.Geocoder();
                const latlng = new google.maps.LatLng(lat, long);
                const request = {
                    latLng: latlng
                };
                geocoder.geocode(request, (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0] != null) {
                            console.log(results[0]);
                            results[0].address_components.forEach(element => {
                                element.types.forEach(type => {
                                    // console.log(type);
                                    if (type === 'locality') {
                                        console.log(element);
                                        const city = element.short_name;
                                        console.log(city);
                                        localStorage.setItem('detectedLocation', city);
                                    }
                                });
                            });
                        } else {
                            alert('No address available');
                        }
                    }
                });
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }

    }
    gotoSignin() {
        const dialogRef = this.dialog.open(SigninComponent, {
            width: '35vw',
            minWidth: '350px',
            disableClose: true,
            hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) { }
        });
        // this.router.navigate(['/home/user/signin']);
    }
}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog.html',
})
export class DialogOverviewExampleDialog {

    constructor(private appserv: AppService,
        public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        console.log(data.locationData);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    SelectiveLocation(event) {
        console.log(event);
        const location: any = this.data.locationData[event.target.selectedIndex - 1];
        console.log(location);
        localStorage.setItem('location', JSON.stringify(location));
        localStorage.setItem('locid', location.LocationId);
        console.log(location);
        this.appserv.changeLocation(location);
        // console.log(loc)
        // localStorage.setItem('locid', loc);
        this.dialogRef.close();
    }
}
