import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, interval, Observable, of } from 'rxjs';
import { concatMap, timestamp } from 'rxjs/operators';
import { Bal, PortfolioList, Urls} from '../models';


@Injectable({
    providedIn: 'root'
})

export class PortfolioService{
    

    constructor(private _http: HttpClient) { }

    getBalance(){
        return this._http.get<Bal>(Urls.getBalUrl);
    }
    getPortfolio(){
        return this._http.get<PortfolioList>(Urls.getPorUrl);
    }
}
