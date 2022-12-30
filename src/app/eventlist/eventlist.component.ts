import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Event {
  EventId: string;
  EventName: string;
}

@Component({
  selector: '[app-eventlist], [select-multiple-example]',
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.css']
})
export class EventlistComponent implements OnInit {
  @ViewChild('myEventItems') MyEvent: ElementRef;
  public panelOpenState = true;
  events = new FormControl();
  selectedValue: string[] = [];
  selectedTags: string[] = [];
  public eventslist: any = [];
  finalEventList = [];
  public references = [];
  public CategoryList = [];
  selectedMonth = '';
  selectedYear = '';
  selectedWeek = '';
  showWeeks = false;
  monthsList = [];
  public eventCategoryId;
  public CategoryName;
  isNoEvent = false;
  selectedWeekIndex: number;
  locationName = '';
  userLoc: any;
  eventListCtrl = new FormControl();
  FilteredEventslist: any = [];
  selectedLocation: any;
  selectedCategory: any;
  pageRoute: any = [];
  constructor(
    private eventinfo: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }


  ngOnInit() {
    this.eventinfo.userLocationValue.subscribe(d => {
      this.selectedLocation = d;
      this.locationName = this.selectedLocation.LocationName;
      this.EventList();
      setTimeout(() => {
        this.MyEvent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    });
    this.userLoc = JSON.parse(localStorage.getItem('location'));
    this.locationName = this.userLoc.LocationName;
    this.selectedCategory = JSON.parse(localStorage.getItem('category'));
    this.eventinfo.selectedCategoryValue.subscribe(data => {
      this.selectedCategory = data;
    });
    this.CategoriesList();
    this.TagsList();
    this.pageRoute = this.router.url.split('/');

  }

  somethingChanged() {
    const value = this.eventListCtrl.value;
    if (value) {
      this.FilteredEventslist = this.eventslist.filter(evnt => evnt.EventName.toLowerCase().indexOf(value) === 0);
      if (this.FilteredEventslist.length > 0) {
        this.isNoEvent = false;
      } else {
        this.isNoEvent = true;
      }
    } else {
      this.isNoEvent = false;
      this.FilteredEventslist = this.eventslist;
    }
  }
  filterCategory(categoryList) {
    const selectedCategory = categoryList.filter(item => this.pageRoute[2] === item.NAME);
    return selectedCategory[0];
  }
  CategoriesList() {
    const call = { action: 'categories' };
    this.eventinfo.MasterCtrl(call)
      .subscribe(
        (res) => {
          if (res.status === 'SUCCESS') {
            this.CategoryList = res.data;
            for (let i = 0; i < this.CategoryList.length; i++) {
              if (this.eventCategoryId === res.data[i].ID) {
                this.selectedCategory = res.data[i];
                this.CategoryName = res.data[i].NAME;
                this.eventCategoryId = res.data[i].ID;
                 this.GetCategoryData(this.selectedCategory);
              } else {
                this.selectedCategory = this.filterCategory(this.CategoryList);
                if (this.selectedCategory) {
                  this.GetCategoryData(this.selectedCategory);
                }
              }
            }
          } else {
            this.CategoryList = [];
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  TagsList() {
    const call = { action: 'tags' };
    this.eventinfo.MasterCtrl(call)
      .subscribe(
        (res) => {
          console.log(res);
          if (res.status === 'SUCCESS') {
            this.references = res.data;
          } else {
            this.references = [];
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  EventList() {
    this.isNoEvent = false;
    this.showWeeks = false;
    this.monthsList = [];
    let locId = '';
    if (this.selectedLocation) {
      locId = this.selectedLocation.LocationId;
    } else if (this.userLoc) {
      locId = this.userLoc.LocationId;
    }
    if (this.selectedCategory) {
      this.eventCategoryId = this.selectedCategory.ID;
    }
    const call = {
      action: 'eventlist', category: this.eventCategoryId,
      locationid: locId, Status: 1
    };
    this.eventinfo.EventCtrl(call)
      .subscribe(
        (res) => {
          if (res.status === 'SUCCESS') {
            this.eventslist = res.data;
            this.FilteredEventslist = this.eventslist;
            if (this.eventslist.length === 0) {
              this.isNoEvent = true;
            }
            this.eventslist = this.sortByDate(this.eventslist);
            this.finalEventList = res.data;
            this.eventslist.forEach(element => {
              const date = new Date(element.EventDate);
              let data = {
                name: '',
                year: 0,
                number: 0,
                count: 0,
                active: false
              };
              if (this.monthsList.length === 0) {
                data = {
                  name: date.toLocaleString('default', { month: 'long' }),
                  year: date.getFullYear(),
                  number: date.getMonth(),
                  count: this.getCount(date.getMonth()),
                  active: false
                };
                this.monthsList.push(data);
              } else {
                const d = this.monthsList.filter(a => a.name === date.toLocaleString('default', { month: 'long' }));
                if (d.length === 0) {
                  data = {
                    name: date.toLocaleString('default', { month: 'long' }),
                    year: date.getFullYear(),
                    number: date.getMonth(),
                    count: this.getCount(date.getMonth()),
                    active: false
                  };
                  this.monthsList.push(data);
                }
              }
              if (this.monthsList.length > 0) {
                this.monthsList[0].active = true;
              }
            });
            this.somethingChanged();
          } else {
            this.eventslist = [];
            this.isNoEvent = true;
          }

        },
        err => {
          console.log(err);
        }
      );
  }

  getCount(month) {
    return this.finalEventList.filter(a => new Date(a.EventDate).getMonth() === month).length;
  }

  sortByDate(arr) {
    arr.sort((a, b) => {
      return Number(new Date(a.EventDate)) - Number(new Date(b.EventDate));
    });

    return arr;
  }

  filterMonth(month, no, year) {
    this.isNoEvent = false;
    if (month !== '') {
      this.selectedMonth = no;
      this.selectedYear = year;
      this.showWeeks = true;
      const filter = [];
      this.finalEventList.forEach(element => {
        const date = new Date(element.EventDate);
        const m = date.toLocaleString('default', { month: 'long' });
        if (m === month) {
          filter.push(element);
        }
      });
      this.FilteredEventslist = filter;
      if (this.FilteredEventslist.length === 0) {
        this.isNoEvent = true;
      }
    } else {
      this.showWeeks = false;
      this.FilteredEventslist = this.finalEventList;
      this.selectedWeekIndex = -1;
    }
  }

  filterWeek(start, end, month, index) {
    this.selectedWeekIndex = index;
    this.isNoEvent = false;
    const filter = [];
    this.finalEventList.forEach(element => {
      const date = new Date(element.EventDate);
      const d = date.getDate();
      const m = date.getMonth();
      if (d >= start && d <= end && month === m) {
        filter.push(element);
      }
    });
    this.FilteredEventslist = filter;
    if (this.FilteredEventslist.length === 0) {
      this.isNoEvent = true;
    } else {
      this.isNoEvent = false;
    }
  }

  getWeeksInMonth(year: number, month: number) {
    const weeks = [];
    const firstDay: Date = new Date(year, month, 1);
    const lastDay: Date = new Date(year, month + 1, 0);
    const daysInMonth: number = lastDay.getDate();
    let dayOfWeek: number = firstDay.getDay();
    let start: number;
    let end: number;
    let active: boolean;

    for (let i = 1; i < daysInMonth + 1; i++) {
      if (dayOfWeek === 0 || i === 1) {
        start = i;
      }
      if (dayOfWeek === 6 || i === daysInMonth) {
        end = i;
        active = false;
        if (start !== end) {
          weeks.push({
            start,
            end,
            active
          });
        }
      }
      dayOfWeek = new Date(year, month, i).getDay();
    }
    return weeks;
  }

  GetCategoryData(cat: any): any {
    this.eventinfo.changeCategory(cat);
    cat.NAME = cat.NAME.replace(/\s/g, '');
    this.CategoryName = cat.NAME;
    this.eventCategoryId = cat.ID;
    this.EventList();
    setTimeout(() => {
      this.MyEvent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }
  SelectiveTags() {
    console.log('log created');
    console.log(this.selectedValue);
  }
  gotoEvent(event: any) {
    localStorage.setItem('event', JSON.stringify(event));
    const eventName = event.EventName.replace(/\s/g, '');
    const eventIdName = event.EventId + '_' + eventName;
    this.router.navigate(['/' + this.locationName + '/' + this.CategoryName + '/' + eventIdName]);
  }
  goToevents(category: any) {
    localStorage.setItem('category', JSON.stringify(category));
    this.router.navigate(['/' + this.locationName + '/' + category.NAME]);
  }
}
