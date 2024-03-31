import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SearchTerm } from '../models';
import {Router} from '@angular/router';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit{
  myControl = new FormControl();
  // filteredOptions!: Observable<any[]>;

  // options = [
  //   { ticker: 'AAPL', name: 'Apple' },
  //   { ticker: 'CF', name: 'Cheesecake Factory' }
  //   // Add more options as needed
  // ];
  options: SearchTerm[] = [];
  
  constructor(private router: Router, private searchService: SearchService) { }

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
  ngOnInit() {
    this.myControl.valueChanges.pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap(value => this.searchService.getSearchAC(value))
            ).subscribe(result => this.options = result);
  }

  // private _filter(value: string): Observable<any[]> {
  //   const filterValue = value.toLowerCase();
  //   return of(this.options).pipe(
  //     map(options => options.filter(option =>
  //       option.ticker.toLowerCase().includes(filterValue) || option.name.toLowerCase().includes(filterValue)
  //     ))
  //   );
  // }
  // options: SearchItem[] = [];

  // constructor(private router: Router, private searchService: SearchService) { }

  // displayFn(searchItem: SearchItem): string {
  //     return searchItem && searchItem.ticker ? searchItem.ticker : '';
  // }

  // ngOnInit() {
  //     this.myControl.valueChanges
  //         .pipe(
  //             debounceTime(500),
  //             distinctUntilChanged(),
  //             switchMap(value => this.searchService.getSearchRecommendation(value))
  //         )
  //         .subscribe(result => this.options = result);
  // }

  // tickerDetails() {
  //     if (this.myControl.value && this.myControl.value.ticker) {
  //         this.router.navigateByUrl('/details/' + this.myControl.value.ticker);
  //     }
  // }

}
