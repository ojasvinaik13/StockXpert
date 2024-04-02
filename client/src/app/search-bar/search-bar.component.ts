import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { SearchTerm } from '../models';
import {Router} from '@angular/router';
import { SearchService } from '../services/search.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit{
  myControl = new FormControl();
  options: SearchTerm[] = [];
  showSpinner:boolean;
  t:string 
  constructor(private router: Router, private searchService: SearchService, private sharedService: SharedService) { }
  @Input() searchValue: string;

  callDisplay(searchTerm: SearchTerm): string {
    return searchTerm && searchTerm.ticker ? searchTerm.ticker : '';
  }
  getDetails() {
    if (this.myControl.value && this.myControl.value.ticker) {
        this.router.navigateByUrl('/search/' + this.myControl.value.ticker);
    }
    else{
      this.router.navigateByUrl('/search/' + this.myControl.value);
  }
}
clearInput(){
  this.myControl.reset('');
}
  ngOnInit() {
    this.t=this.sharedService.getData();

    if(this.t!=""){
      this.router.navigateByUrl('/search/' + this.t)
    }
    this.myControl.valueChanges.pipe(
                distinctUntilChanged(),
                tap((a) => {
                  this.showSpinner = true
              }),
                switchMap(value => this.searchService.getSearchAC(value))
            ).subscribe(result => {this.options = result;this.showSpinner = false});
  }
}
