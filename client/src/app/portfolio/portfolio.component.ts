import { Component } from '@angular/core';
import { PL, PortfolioModel } from '../models';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { WatchlistService } from '../services/watchlist.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  portfolioFlag:boolean;
  portfolioModel: PortfolioModel;
  walletBalance: number;
  list: PL[];
  portfolioModels: PortfolioModel[] =[];

    // portfolioStorage: PortfolioStorageModel[]
    noPortfolio: boolean
    // portfolioModels: PortfolioModel[];

    buyControl = new FormControl();
    sellControl = new FormControl();

    stockbuyable = false;
    stockSellable = false;

    buyStockTicker: string;
    buyStockCurrentPrice: number;
    buyStockCurrentPriceStr: string;
    buyStockQuantity: number;
    buyTotal = 0;
    buyTotalStr = "0";
    buyCompanyName: string;

    sellStockTicker: string;
    sellStockCurrentPrice: number;
    sellStockCurrentPriceStr: string;
    sellStockQuantity: number;
    sellTotal = 0;
    sellTotalStr = "0";
    sellCompanyName: string;

    showSpinner = false;

    closeResult = '';

  constructor(private modalService: NgbModal,  private router: Router, private portfolioService: PortfolioService,private watchlistService: WatchlistService,) { }

  ngOnInit(): void {
    this.portfolioFlag=true;
    this.getBalance();
    this.getPortfolio();
  }

  getBalance(){
    this.portfolioService.getBalance().subscribe(res=>{
      this.walletBalance = res.wallet;
    });
  }
  getPortfolio(){
    this.portfolioService.getPortfolio().subscribe(res=>{
      this.list = res.results;
      for(let i=0;i<this.list.length;i++){
        let obj = this.list[i];
        let t = obj.ticker;
        this.watchlistService.fetchStockquote(t).subscribe(res=>{
          let cp = parseFloat(res.c.toFixed(2));
          let ind = this.portfolioModels.findIndex(item => item.ticker === t);
        if(ind!==-1){
          // console.log("hello");
          this.portfolioModels[ind].quantity += obj.quantity;
          this.portfolioModels[ind].totalCost += obj.price*obj.quantity;
          this.portfolioModels[ind].totalCost = parseFloat(this.portfolioModels[ind].totalCost.toFixed(2));
          this.portfolioModels[ind].avgCostPerShare = parseFloat((this.portfolioModels[ind].totalCost/this.portfolioModels[ind].quantity).toFixed(2));
          this.portfolioModels[ind].currentPrice = cp;
          this.portfolioModels[ind].change = parseFloat((this.portfolioModels[ind].avgCostPerShare - cp).toFixed(2));
          this.portfolioModels[ind].marketValue = parseFloat((this.portfolioModels[ind].quantity*cp).toFixed(2));
        }
        else{
          // console.log("hi");
          this.portfolioModels.push({
            "ticker":t,
            "companyName":obj.companyName,
            "quantity":obj.quantity,
            "totalCost":parseFloat((obj.price*obj.quantity).toFixed(2)),
            "avgCostPerShare":parseFloat(obj.price.toFixed(2)),
            "currentPrice":cp,
            "change":parseFloat((obj.price-cp).toFixed(2)),
            "marketValue":parseFloat((obj.quantity*cp).toFixed(2))
          });
        }
        })   
      }
    });
  }

}
