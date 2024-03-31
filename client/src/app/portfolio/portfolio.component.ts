import { Component } from '@angular/core';
import { PortfolioModel } from '../models';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  portfolioFlag:boolean;
  portfolioModel: PortfolioModel;
  walletBalance: number;
  portfolioModels:PortfolioModel[] = [{companyName: "Apple",
    ticker: "AAPL",
    quantity: 3.0,
    avgCostPerShare: 184.22,
    totalCost: 552.22,
    change:-0.8,
    currentPrice:184.33,
    marketValue: 552.78},{companyName: "Apple",
    ticker: "AAPL",
    quantity: 3.0,
    avgCostPerShare: 184.22,
    totalCost: 552.22,
    change:-0.8,
    currentPrice:184.33,
    marketValue: 552.78}];

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

    constructor(private modalService: NgbModal,  private router: Router) { }
  ngOnInit(): void {
    this.portfolioFlag=true;
    this.walletBalance=25000;
  }
}
