import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from '../models';
import { DetailsModel } from '../models';
import { CompanyDetailsModel } from '../models';
import { HistoricalModel } from '../models';
import { PeersModel } from '../models';
import { StockQuoteModel } from '../models';
import { forkJoin, interval, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class DetailsService{
    detailsModel: DetailsModel;

    constructor(private _http: HttpClient) { }

    getDateString(date) {
        var d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = "" + d.getFullYear();
    
        if (month.length < 2) 
            month = "0" + month;
        if (day.length < 2) 
            day = "0" + day;
    
        return year+"-"+month+"-"+day
    }
    getFromDate(){
        let todayDate = new Date();
        let fromDate = new Date();
        let todayd = todayDate.getDate();
        let today = todayDate.getDay();
        let x = 0;
        if(today==0){
            x = 3; 
        }
        else if(today==6){
            x = 2;
        }
        else{
            x = 1;
        }
        fromDate.setDate(todayd - x);
        fromDate.setHours(0);
        fromDate.setMinutes(0);
        fromDate.setSeconds(0);
        return this.getDateString(fromDate)
    }

    fetchDetfromBackend(ticker:string, firstFlag:boolean){
        let fromDate = this.getFromDate();
        // console.log(fromDate);
        let today = new Date();        
        let toDate = this.getDateString(today);
        // console.log(toDate);
        if(firstFlag){
            return forkJoin({
                companyDetailsModel: this._http.get<CompanyDetailsModel>(Urls.companyUrl + ticker),
                stockQuoteModel: this._http.get<StockQuoteModel>(Urls.quoteUrl + ticker),
                historicalModel: this._http.get<HistoricalModel>(Urls.histUrl + ticker + "?fromDate="+fromDate+"&toDate="+toDate+"&timespan=hour"),
                peersModel: this._http.get<PeersModel>(Urls.peersUrl + ticker)
            }).pipe(
                concatMap(res=>{
                    this.detailsModel = new DetailsModel();
                    this.detailsModel.companyDetailsModel = res.companyDetailsModel;
                    this.detailsModel.stockQuoteModel = res.stockQuoteModel;
                    this.detailsModel.historicalModel = res.historicalModel;
                    this.detailsModel.peersModel = res.peersModel;
                    return of(this.detailsModel);
                })
            );
        }
        else{
            return forkJoin({
                stockQuoteModel: this._http.get<StockQuoteModel>(Urls.quoteUrl + ticker),
                historicalModel: this._http.get<HistoricalModel>(Urls.histUrl + ticker + "?fromDate="+fromDate+"&toDate="+toDate+"&timespan=hour"),
            }).pipe(
                concatMap(res=>{
                    this.detailsModel = new DetailsModel();
                    this.detailsModel.stockQuoteModel = res.stockQuoteModel;
                    this.detailsModel.historicalModel = res.historicalModel;
                    return of(this.detailsModel);
                })
            ); 
        }
    }
}