import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewsModel, Urls } from '../models';
import { DetailsModel } from '../models';
import { forkJoin, interval, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class NewsService{
    newsModel: NewsModel;

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
        let today = todayDate.getDate();
        fromDate.setDate(today - 7);
        fromDate.setHours(0);
        fromDate.setMinutes(0);
        fromDate.setSeconds(0);
        return this.getDateString(fromDate)
    }
    fetchDetfromBackend(ticker:string){
        let fromDate = this.getFromDate();
        let today = new Date();        
        let toDate = this.getDateString(today);
        return this._http.get<NewsModel>(Urls.newsUrl + ticker+ "?fromDate="+fromDate+"&toDate="+toDate).pipe(concatMap(res=>{
            this.newsModel = new NewsModel();
            this.newsModel = res;
            // console.log(this.newsModel);
            return of(this.newsModel)
        }));
    }
}