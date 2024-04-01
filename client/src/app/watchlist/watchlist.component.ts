import { Component, OnInit } from '@angular/core';
import { StockQuoteModel, WL, WatchlistModel } from '../models';
import { WatchlistService } from '../services/watchlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit{
  watchlistFlag:boolean;
  watchlistModels:WatchlistModel[]=[];
  items:WL[];  
  ret:StockQuoteModel;

    constructor(private watchlistService: WatchlistService,
      private router: Router) { }

  ngOnInit(): void {
    this.watchlistFlag=true;
    this.getWatchlistItems();
    // console.log(Date.now());
  }
  goToDetailsPage(ticker:string){
    this.router.navigateByUrl('/search/' + ticker);
  }
  delete(e, ticker) {
    this.watchlistService.deleteFromWatchlist(ticker).subscribe();
    document.getElementById(ticker).remove();
    e.stopPropagation();
 }
 getWatchlistItems(){
  this.watchlistService.getAll().subscribe(res=>{
    this.items = res;
    for(let i=0;i<this.items.length;i++){
      let t = this.items[i].ticker;
      let c = this.items[i].companyName;
      this.watchlistService.fetchStockquote(t).subscribe(res=>{
        this.watchlistModels.push({
          "companyName": c,
          "ticker":t,
          "lastPrice":res["c"],
          "change":res["d"],
          "changePercentage":res["dp"]
        });
      });
    }
  });
 }
}
