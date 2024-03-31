import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartsInsightsModel, EarningsModel, HistoricalModel, InsiderModel, NewsModel, RecommendationTrendsModel, Urls } from '../models';
import { DetailsModel } from '../models';
import { forkJoin, interval, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class ChartsInsightsService{
    chartsInsightsModel: ChartsInsightsModel;

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
        let fromDate = new Date(todayDate.getFullYear() - 2, todayDate.getMonth(), todayDate.getDate());        
        return this.getDateString(fromDate)
    }
    fetchDetfromBackend(ticker:string){
        let fromDate = this.getFromDate();
        let today = new Date();        
        let toDate = this.getDateString(today);
        return forkJoin({
            historicalModel: this._http.get<HistoricalModel>(Urls.histUrl + ticker + "?fromDate="+fromDate+"&toDate="+toDate+"&timespan=day"),
            recommendationTrendsModel: this._http.get<RecommendationTrendsModel>(Urls.recsUrl + ticker),
            insiderModel: this._http.get<InsiderModel>(Urls.insUrl + ticker),
            earningsModel: this._http.get<EarningsModel>(Urls.earnUrl + ticker)
        }).pipe(
            concatMap(res=>{
                this.chartsInsightsModel = new ChartsInsightsModel();
                this.chartsInsightsModel.historicalModel = res.historicalModel;
                // console.log(this.chartsInsightsModel.historicalModel);
                this.chartsInsightsModel.recommendationTrendsModel = res.recommendationTrendsModel;
                this.chartsInsightsModel.insiderModel = res.insiderModel;
                this.chartsInsightsModel.earningsModel = res.earningsModel;
                return of(this.chartsInsightsModel);
            })
        );
    }
}