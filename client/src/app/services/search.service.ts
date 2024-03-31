import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchAC } from '../models';
import { Urls } from '../models';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SearchTerm } from '../models';

@Injectable({
    providedIn: 'root'
})

export class SearchService {
    constructor(private _http: HttpClient) { }
    parseSearch(serverResp) {
        // console.log("HIIIII")
        serverResp = serverResp.result;
        // console.log(serverResp);
        let requiredResponse = {}
        if (Array.isArray(serverResp)) {
            // console.log("Hello I am here");
            requiredResponse['parsing'] = true;
            requiredResponse['data'] = [];
            for (let i = 0; i < serverResp.length; i++) {
                if (serverResp[i].displaySymbol != null && serverResp[i].description != null) {
                    let suggestion = {};
                    suggestion['ticker'] = serverResp[i].displaySymbol;
                    suggestion['name'] = serverResp[i].description;
                    // console.log(suggestion);
                    requiredResponse['data'].push(suggestion);
                }
            }
        } else { 
            requiredResponse['parsing'] = false
        }
        // console.log(requiredResponse);
        return requiredResponse
    }
    getSearchAC(query: string): Observable<SearchTerm[]> {
        // console.log(query)
        if (!(/^[a-zA-Z]+$/.test(query))) {
            return of([]);
        }
        return this._http.get<SearchAC>(Urls.searchUrl + query)
            .pipe(
                concatMap(st => {
                    // console.log(st);
                        let newst = st.result;
                        // console.log("Hello");
                        let stList: SearchTerm[] = [];
                        for (let i = 0; i < newst.length; i++) {
                            if (newst[i]["displaySymbol"] != null && newst[i]["description"] != null) {
                                let suggestion = new SearchTerm();
                                suggestion['ticker'] = newst[i]["displaySymbol"];
                                suggestion['name'] = newst[i]["description"];
                                // console.log(suggestion);
                                stList.push(suggestion);
                            }
                        }
                        
                        // console.log(stList);
                        return of(stList);
                    
                    // else {
                    //     // console.log("Hello");
                    //     return of([]);
                    // }
                }),
                catchError(this.handleError<SearchTerm[]>('getSearchAC', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            console.error(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}