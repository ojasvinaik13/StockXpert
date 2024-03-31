import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, interval, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { IWL, Urls } from '../models';


@Injectable({
    providedIn: 'root'
})

export class WatchlistService{
    iwl: IWL;
    constructor(private _http: HttpClient) { }

    isonWatchlist(ticker:string){
        return this._http.get<IWL>(Urls.iswlUrl + ticker).pipe(concatMap(res=>{
            this.iwl = new IWL();
            this.iwl = res;
            return of(this.iwl.flag)
        }));
    }
    deleteFromWatchlist(ticker:string){
        return this._http.delete(Urls.delwlUrl+ticker);

    }
    addToWatchlist(ticker:string){
        let data ={"ticker":ticker};
        return this._http.post(Urls.addwlUrl,data).pipe()

    }

    getAll(){
        return this._http.get<IWL>(Urls.getwlUrl).pipe(concatMap(res=>{
            this.iwl = new IWL();
            this.iwl = res;
            return of(this.iwl.flag)
        }));
    }
}