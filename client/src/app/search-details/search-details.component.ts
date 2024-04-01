import { Component, OnInit } from '@angular/core';
import { timestamp } from 'rxjs';
import * as Highcharts from 'highcharts/highstock';
import { ActivatedRoute } from '@angular/router';
import { WatchlistService } from '../services/watchlist.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NewsDetails } from './NewsDetails';
import vbp from 'highcharts/indicators/volume-by-price';
import more from 'highcharts/highcharts-more';
import IndicatorsCore from 'highcharts/indicators/indicators';
import HC_stock from 'highcharts/modules/stock';
import { DetailsService } from '../services/details.service';
import { NewsService } from '../services/news.service';
import { ChartsInsightsModel, CompanyDetailsModel, DetailsModel, EarningsModel, HistoricalModel, InsiderModel, NewsItem, NewsModel, PeersModel, RecommendationTrendsModel, StockQuoteModel } from '../models';
import { ChartsInsightsService } from '../services/chartsInsighs.service';
more(Highcharts);
IndicatorsCore(Highcharts);
vbp(Highcharts);
HC_stock(Highcharts);

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrl: './search-details.component.css'
})
export class SearchDetailsComponent implements OnInit{
  showSpinner: boolean = false;
  closeResult = '';
  ticker: string;
  newsItem: NewsDetails;
  newNewsData : any = [];
  details: DetailsModel;
  chartsInsights: ChartsInsightsModel;
  news: NewsModel;
  marketStatus: boolean;
  marketShutTime: string;
  isfavorite;
  alreadyBought: boolean;
  currentTimestamp: string;
//   details = {
//     ticker: "AAPL",
//     companyName: "Apple Inc",
//     
//     stExCode: "NASDAQ NMS - GLOBAL MARKET",
//     alreadyBought: false,
//     lastPrice: 184.11,
//     change: 1.79,
//     changePercent: 0.98,
//     currentTimestamp: "2024-2-22 10:53:25",
//     marketStatus: true,
//     marketshutTime: "2024-2-16 13:00:00",
//     imgurl: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.png",
//     highPrice: 184.29,
//     lowPrice: 184.29,
//     openPrice: 184.29,
//     prevClose: 184.29,
//     cstartDate: "1980-12-12",
//     industry: "Technology",
//     webpage: "https://www.apple.com/",
//     companyPeers: [{ct:"AAPL",siteurl:"https://www.apple.com/"},{ct:"DELL",siteurl:"https://www.apple.com/"},
//     {ct:"HPO",siteurl:"https://www.apple.com/"},{ct:"ABC",siteurl:"https://www.apple.com/"}]
//   };
  tmspr = 0;
  pmspr = 0;
  nmspr = 0;
  tc = 0;
  pc = 0;
  nc = 0;

recTrendsData = [];
  
epsData = [];

  Highcharts: typeof Highcharts = Highcharts;
  DailyHighcharts: typeof Highcharts = Highcharts;
  RecHighcharts: typeof Highcharts = Highcharts;
  EpsHighcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options; 
  dailyChartOptions: Highcharts.Options;
  recChartOptions: Highcharts.Options;
  epsChartOptions: Highcharts.Options;
  updateFlag: boolean = false;
  chartConstructor: string = 'stockChart';
  twitterContent: string = "";
  fbContent: string = "";
  histResults: [];
  newsItems: NewsItem[];
  histResults2: [];
  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private detailsService: DetailsService,
    private newsService: NewsService,
    private chartsInsightsService: ChartsInsightsService,
    private watchlistService: WatchlistService) { 

    }
    ngOnInit(): void {
    this.details = new DetailsModel();
    this.details.companyDetailsModel = new CompanyDetailsModel();
    this.details.stockQuoteModel = new StockQuoteModel();
    this.details.peersModel = new PeersModel();
    this.details.historicalModel = new HistoricalModel();
    this.news = new NewsModel();
    this.chartsInsights = new ChartsInsightsModel(); 
    this.chartsInsights.historicalModel = new HistoricalModel();
    this.chartsInsights.recommendationTrendsModel = new RecommendationTrendsModel();
    this.chartsInsights.insiderModel = new InsiderModel();
    this.chartsInsights.earningsModel = new EarningsModel();
    // this.isfavorite = this.watchlistService.isonWatchlist(this.ticker);  
      // this.showSpinner = true;
    //   this.ticker = this.route.snapshot.paramMap.get('ticker');
      this.activatedRoute.paramMap.subscribe(paramMap => {
      this.ticker = paramMap.get('ticker').toUpperCase();
      this.isOnWatchlist();
      this.fetchDetails(true);
      this.fetchNews();
      this.fetchChartsandInsights();


    //   this.fetchHistoricalChartData();
      });
    //   this.tmspr = parseFloat(this.tmspr.toFixed(2));
    //   this.pmspr = parseFloat(this.pmspr.toFixed(2));
    //   this.nmspr = parseFloat(this.nmspr.toFixed(2));
    //   this.plotEpsChart();
    }
    getDateString(date) {
        var d = new Date(parseInt(date, 10)*1000);
        // console.log(d);
        var month = "" + (d.getMonth() + 1);
        var day = "" + d.getDate();
        var year = "" + d.getFullYear();
    
        if (month.length < 2) 
            month = "0" + month;
        if (day.length < 2) 
            day = "0" + day;
        
        return year+"-"+month+"-"+day
    }
    getFtime(date){
        var d = new Date(parseInt(date, 10)*1000);
        var hour = ""+d.getHours();
        var min = ""+d.getMinutes();
        var sec = ""+d.getSeconds();

        return hour+":"+min+":"+sec
    }
    addToWatchlist(){
      if (this.isfavorite){
        this.isfavorite=false;
        this.watchlistService.deleteFromWatchlist(this.ticker).subscribe();
      }
      else{
        this.isfavorite=true;
        this.watchlistService.addToWatchlist({"ticker":this.ticker,"companyName":this.details.companyDetailsModel.name}).subscribe();
      }
    }
    fetchDetails(firstFlag:boolean){
        this.detailsService.fetchDetfromBackend(this.ticker, firstFlag).subscribe(res=>{
        this.details = res;
        let now = new Date();
        if ((now.getTime() - (new Date(this.details.stockQuoteModel.t).getTime())) > 300000) {
            this.marketStatus = false;
            this.marketShutTime = this.getDateString(this.details.stockQuoteModel.t) + " " +this.getFtime(this.details.stockQuoteModel.t);
        }
        else {
            this.marketStatus = true;
        } 
        this.currentTimestamp = this.getDateString(this.details.stockQuoteModel.t) + " " +this.getFtime(this.details.stockQuoteModel.t);
        this.details.stockQuoteModel.d = parseFloat(this.details.stockQuoteModel.d.toFixed(2));
        this.details.stockQuoteModel.dp = parseFloat(this.details.stockQuoteModel.dp.toFixed(2));
        this.histResults = this.details.historicalModel.results;        
        let s="";
        for (let i=0;i<this.details.peersModel.results.length;i++){
             s = this.details.peersModel.results[i];
            if(s.includes(".")){
                this.details.peersModel.results.splice(i,1)
            }
        } 
        this.plotDailyHighChart();  
        });
    }

    fetchNews(){
        this.newsService.fetchDetfromBackend(this.ticker).subscribe(res=>{
            this.news = res;
            this.newsItems = this.news.results;
            this.newNewsData = this.getNewNewsData().slice(0,20);
            if(this.newNewsData.length%2!==0){
                this.newNewsData = this.newNewsData.slice(0, this.newNewsData.length-1);
                // console.log(this.newNewsData.length);
            }
        });
    }
    isOnWatchlist(){
      this.watchlistService.isonWatchlist(this.ticker).subscribe(res=>{
          this.isfavorite = res;
      });
  }

    fetchChartsandInsights(){
        this.chartsInsightsService.fetchDetfromBackend(this.ticker).subscribe(res=>{
            this.chartsInsights = res;
            this.histResults2 = this.chartsInsights.historicalModel.results;
            this.plotHistoricalHighChart();
            this.calcInsights();
            this.recTrendsData = this.chartsInsights.recommendationTrendsModel.results;
            this.plotRecChart(); 
            this.epsData = this.chartsInsights.earningsModel.results;
            this.plotEpsChart();
        });
    }

  getNewNewsData(){
    let var1 = [];
    // console.log(this.newsItems);
    let ind = 0;
    for (let i=0;i<this.newsItems.length;i++){
      if(this.newsItems[i].datetime!=null && this.newsItems[i].source!="" && this.newsItems[i].headline!="" && this.newsItems[i].url!="" && this.newsItems[i].image!="" && this.newsItems[i].summary!=""){
      let s =  String(this.newsItems[i].datetime)
      var1[ind] = new NewsDetails(this.newsItems[i].source,
        s,
        this.newsItems[i].headline,
        this.newsItems[i].url,
        this.newsItems[i].image,
        this.newsItems[i].summary);
        ind+=1;
      }}
      return var1;
    }
   
 
  plotDailyHighChart() {
    // console.log(this.histResults);
    let info = this.histResults;
    let linecolor = this.details.stockQuoteModel.d>0 ? "#198754" : "#dc3545";
    let dailyData = [];
    // console.log(info);
    for (let i = 0;i < info.length;++i) {
        dailyData.push([info[i]["t"], info[i]["c"]]);
    }
    // console.log(dailyData);
    this.dailyChartOptions = {
      chart:{backgroundColor:'rgba(0,0,0,0.03)',height: 300,},
        accessibility:{
            enabled:false
        },
        navigator: {
            enabled: false,
            adaptToUpdatedData: true
        },
        rangeSelector:{
          enabled:false,
        },

        title: {
            text: this.ticker + " Hourly Price Variation",
            style: {
              color: 'rgba(0,0,0,0.4)',
              fontSize:'0.8em'
            }            
        },

        xAxis: {
            type: 'datetime'
        },
        series: [{
            type: 'line',
            name: this.ticker,
            data: dailyData,
            tooltip: {
                valueDecimals: 2
            },
            color: linecolor
             
        }]
    };
    // console.log(this.dailyChartOptions);
    };

    open(content:any) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',size:'md' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
    
  openmodal(newsItem:NewsDetails) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    this.newsItem = newsItem;
    this.twitterContent = "https://twitter.com/intent/tweet?text=" + encodeURI(this.newsItem.headline + this.newsItem.newsUrl);
    this.fbContent = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURI(this.newsItem.newsUrl);
    let prevDate = this.newsItem.date
    let d = new Date(parseInt(this.newsItem.date) * 1000);
    console.log(d);
    if (!!d.valueOf()) {
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        this.newsItem.date = monthNames[month] + " " + day + ", " + year;
        
    }
    else {
        this.newsItem.date = prevDate;
    }
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
plotHistoricalHighChart() {
  // if (stockInfoModel.parsing === false) {
  //     console.log("Received parsing = false for historical data from backend");
  //     return;
  // }
 
  let info = this.histResults2;

  let ohlc = [];
  let volume = [];
  let dataLength = info.length;
  for (let i = 0;i < dataLength;i++) {
      ohlc.push([
          info[i]["t"],
          info[i]["o"],
          info[i]["h"],
          info[i]["l"],
          info[i]["c"]
      ]);

      volume.push([
          info[i]["t"],
          info[i]["v"]
      ]);
  }
  // create the chart
  this.chartOptions = {
    chart:{
      backgroundColor:'rgba(0,0,0,0.03)'
    },

      rangeSelector: {
          enabled: true,
          allButtonsEnabled: true,
          selected: 2
      },

      navigator: {
          enabled: true,
          adaptToUpdatedData: true
      },

      title: {
          text: this.ticker + ' Historical'
      },

      subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
      },

      xAxis: {
          type: 'datetime'
      },

      yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          }
      }, {
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
      }],

      tooltip: {
          split: true
      },

      plotOptions: {
          series: {
              dataGrouping: {
                  units: [[
                      'week',
                      [1]
                  ], [
                      'month',
                      [1, 2, 3, 4, 6]
                  ]]
              }
          }
      },

      series: [{
          type: 'candlestick',
          name: this.ticker,
          id: this.ticker,
          zIndex: 2,
          data: ohlc
      }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
      }, {
          type: 'vbp',
          linkedTo: this.ticker,
          params: {
              volumeSeriesID: 'volume'
          },
          dataLabels: {
              enabled: false
          },
          zoneLines: {
              enabled: false
          }
      }, {
          type: 'sma',
          linkedTo: this.ticker,
          zIndex: 1,
          marker: {
              enabled: false
          }
      }]
  };
}

plotRecChart(){
  let categoriesarr = ["hi"];
  let sbuy = [];
  let ssell = [];
  let buy = [];
  let sell = []; 
  let hold = [];
  for(let i=0;i<this.recTrendsData.length;i++){
    categoriesarr[i]=this.recTrendsData[i].period.slice(0,7).toString();
    buy[i]=this.recTrendsData[i].buy;
    sell[i]=this.recTrendsData[i].sell;
    hold[i]=this.recTrendsData[i].hold;
    ssell[i]=this.recTrendsData[i].strongSell;
    sbuy[i]=this.recTrendsData[i].strongBuy;
  }
  // console.log(categoriesarr); 
  this.recChartOptions = {
    rangeSelector:{
      enabled:false
    },
    scrollbar:{
      enabled:false
    },
    navigator:{
      enabled:false
    },
    chart: {
      type: 'column',
      backgroundColor:'rgba(0,0,0,0.03)' 
    },
    title: {
      text: 'Recommendation Trends'
    },
    xAxis: {
      type:'category',
      labels: {
        formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
          return categoriesarr[this.value as any];
      }
    }  
    },
    yAxis: {
      min: 0,
      title: {
        text: '#Analysis'
      },
      opposite:false
    },
    legend: {
      enabled:true
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels:{
          enabled:true
        }        
      }
    },
    series: [{
      name: 'Strong Buy',
      data: sbuy,
      type:'column',
      color:"#1a6334"
    }, {
      name: 'Buy',
      data: buy,
      type:'column',
      color:"#24af51"
    }, {
      name: 'Hold',
      data: hold,
      type:'column',
      color:"#b07e28"
    },
    {
      name: 'Sell',
      data: sell,
      type:'column',
      color:"#f15053"
    },
    {
      name: 'Strong Sell',
      data: ssell,
      type:'column',
      color:"#752b2c"
    }]
  };

}
plotEpsChart(){
  let actual = [];
  let estimate = [];
  let surprise: string[] = [];
  let dates: string[] = [];
  for(let i=0;i<this.epsData.length;i++){
    actual[i]=this.epsData[i].actual;
    estimate[i]=this.epsData[i].estimate;
    surprise[i]=String(this.epsData[i].surprise);
    dates[i]=this.epsData[i].period
  }
  this.epsChartOptions = {
    rangeSelector:{
      enabled:false
    },
    scrollbar:{
      enabled:false
    },
    navigator:{
      enabled:false
    },
    title: {
      text: 'Historical EPS Surprises'
    },
    legend: {
      enabled:true
    },
    yAxis:{
      opposite:false,
      title:{
        text:"Quarterly EPS"
      }
    },
    xAxis: {
      labels:{
        formatter: function() {
            const index:number = Number(this.value); 
            const primaryLabel = dates[index]; 
            const secondaryLabel = surprise[index]; 
            return primaryLabel + '<br> Surprise:' + secondaryLabel; 
        }
    }
    },
    chart:{type:"spline",
  backgroundColor:'rgba(0,0,0,0.03)'},
    plotOptions: {
      series: {
          label: {
              connectorAllowed: false
          },
          marker:{
            enabled:true,
            radius:4
          }
      }
  },
  series:[{
    name:"Actual",
    data: actual,
    type:"spline"
  },{
    name:"Estimate",
    data: estimate,
    type:"spline"
  }],
  }
}
calcInsights(){

this.tmspr = 0;
this.pmspr = 0;
this.nmspr = 0;
this.tc = 0;
this.pc = 0;
this.nc = 0;
let d = this.chartsInsights.insiderModel.data;

for (let i=0;i<d.length;i++){
  if (d[i].mspr>=0){
    this.tmspr += d[i].mspr
    this.pmspr += d[i].mspr
  }
  else if (d[i].mspr<0){
    this.tmspr += d[i].mspr
    this.nmspr += d[i].mspr
  }
  if (d[i].change>=0){
    this.tc += d[i].change
    this.pc += d[i].change
  }
  else if (d[i].change<0){
    this.tc += d[i].change
    this.nc += d[i].change
  }
}
this.tmspr = parseFloat(this.tmspr.toFixed(2));
this.pmspr = parseFloat(this.pmspr.toFixed(2));
this.nmspr = parseFloat(this.nmspr.toFixed(2));
}
}
