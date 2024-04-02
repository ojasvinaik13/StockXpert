import { Component } from '@angular/core';
import { PL, PortfolioModel } from '../models';
import { FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { WatchlistService } from '../services/watchlist.service';
import { DetailsService } from '../services/details.service';

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
  portItem:PortfolioModel;
  buyFlag:boolean;
  sellFlag2:boolean;
  totalCostforBuying:number;
  totalCostforSelling:number;
  notenoughmoney:boolean;
  donthavetext:boolean;
  itemBought:string;
  itemSold:string;
  itemBoughtFlag:boolean=false;
  itemSoldFlag:boolean=false; 
  noPortfolio: boolean

    fc = new FormControl();
    fc2 = new FormControl();

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

  constructor(private modalService: NgbModal,  private router: Router, 
    private portfolioService: PortfolioService,private watchlistService: WatchlistService,
    private detailsService: DetailsService,) { }

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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
    } else {
        return `with: ${reason}`;
    }
}
  open(content:any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',size:'md' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}
buystockpopup(portfolioModel:PortfolioModel) {
  this.portItem = portfolioModel;
  this.buyFlag=false;
  this.fc.setValue(0);
  this.totalCostforBuying = 0.00;
  this.fc.valueChanges.subscribe(value => {
    // console.log("Value changed");
    this.totalCostforBuying = parseFloat((value * this.portItem.currentPrice).toFixed(2));
      if (value > 0 && this.totalCostforBuying<this.walletBalance) {
          this.buyFlag = true;
      }
      else if(this.totalCostforBuying>this.walletBalance) {
          this.buyFlag = false;
          this.notenoughmoney=true;
      }
      else{
        this.buyFlag = false;
      }
  });
}
sellstockpopup(portfolioModel:PortfolioModel){
this.portItem = portfolioModel;
this.sellFlag2=false;
this.fc2.setValue(0);
this.totalCostforSelling = 0.00;
this.fc2.valueChanges.subscribe(value => {
  this.totalCostforSelling = parseFloat((value * this.portItem.currentPrice).toFixed(2));
  if (value > 0 && value<=this.portItem.quantity) {
      // console.log(this.quantityofStock)
      this.sellFlag2 = true;
      this.donthavetext = false;
  }
  else if(value==0){
    // console.log(this.quantityofStock)
      this.sellFlag2 = false;
      this.donthavetext = false;
  }
  else{
    this.sellFlag2 = false;
    this.donthavetext = true;
  }
});
}
updateBalance(balance:number){
  this.detailsService.updateWallet(balance).subscribe();
 }
buyStock(ticker:string, companyName:string,price:number,quantity:number){
  this.detailsService.buyStock({"ticker":ticker,"companyName":companyName,
  "timestamp":Date.now(),"price":price,"quantity":quantity}).subscribe(res=>{
    this.walletBalance -= (price*quantity);
    this.updateBalance(this.walletBalance);
    this.getPortfolio();
    this.itemBought = ticker;
    this.itemBoughtFlag = true;
    setTimeout(()=>{
      this.itemBoughtFlag=false;
    },5000);
  });
 }
 sellStock(ticker:string,quantity:number,price:number){
  this.detailsService.sellStock({"ticker":ticker,"quantity":quantity}).subscribe(res=>{
    this.walletBalance += (price*quantity);
    this.walletBalance = parseFloat(this.walletBalance.toFixed(2));
    this.updateBalance(this.walletBalance);
    this.getPortfolio();
    this.itemSold = ticker;
    this.itemSoldFlag = true;
    setTimeout(()=>{
      this.itemSoldFlag=false;
    },5000);
    this.getPortfolio();
  });
}
  getPortfolio(){
    this.portfolioService.getPortfolio().subscribe(res=>{
      this.list = res.results;
      if(this.list.length==0){
        this.portfolioFlag = false;
      }
      this.portfolioModels = [];
      for(let i=0;i<this.list.length;i++){
        let obj = this.list[i];
        let t = obj.ticker;
        this.watchlistService.fetchStockquote(t).subscribe(res=>{
          let cp = parseFloat(res.c.toFixed(2));
          let ind = this.portfolioModels.findIndex(item => item.ticker === t);
        if(ind!==-1){
          if(obj.quantity!=0){
            this.portfolioModels[ind].quantity += obj.quantity;
            this.portfolioModels[ind].totalCost += obj.price*obj.quantity;
            this.portfolioModels[ind].totalCost = parseFloat(this.portfolioModels[ind].totalCost.toFixed(2));
            this.portfolioModels[ind].avgCostPerShare = parseFloat((this.portfolioModels[ind].totalCost/this.portfolioModels[ind].quantity).toFixed(2));
            this.portfolioModels[ind].currentPrice = cp;
            this.portfolioModels[ind].change = parseFloat((this.portfolioModels[ind].avgCostPerShare - cp).toFixed(2));
            this.portfolioModels[ind].marketValue = parseFloat((this.portfolioModels[ind].quantity*cp).toFixed(2));
          }
          // console.log("hello");
          
        }
        else{
          // console.log("hi");
          if(obj.quantity!=0){
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
          
        }
        })   
      }
    });
  }
}
