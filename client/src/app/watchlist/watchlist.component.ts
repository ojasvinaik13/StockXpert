import { Component, OnInit } from '@angular/core';
import { WatchlistModel } from '../models';
import { WatchlistService } from '../services/watchlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit{
  watchlistFlag:boolean;
  watchlistModel: WatchlistModel;
  watchlistModels:[WatchlistModel] = [{companyName: "Apple",
    ticker: "AAPL",
    lastPrice: 184.12,
    change: -102.11,    
    changePercentage: 15.22}];
    constructor(private watchlistService: WatchlistService,
      private router: Router) { }

  ngOnInit(): void {
    this.watchlistFlag=true;
  }
  goToDetailsPage(ticker:string){
    this.router.navigateByUrl('/search/' + ticker);
  }
  delete(e, ticker) {
    this.watchlistService.deleteFromWatchlist(ticker);
    document.getElementById(ticker).remove();
    e.stopPropagation();
}
}
