// import { StockDetailsModel } from '../models';

export class DetailsModel {
    companyDetailsModel: CompanyDetailsModel;
    stockQuoteModel: StockQuoteModel;
    peersModel: PeersModel;
    historicalModel: HistoricalModel;
}
export class ChartsInsightsModel {
    historicalModel: HistoricalModel;
    recommendationTrendsModel: RecommendationTrendsModel;
    insiderModel: InsiderModel;
    earningsModel: EarningsModel
}
export class SearchTerm {
    ticker: string;
    name: string;
}
export interface SearchAC {
    count: number;
    result: [];
}
export class CompanyDetailsModel {
    exchange: string;
    finnhubIndustry: string;
    ipo: string;
    logo: string;
    name: string;
    ticker: string;
    weburl: string;  
}
export class StockQuoteModel {
    c:number;
    d:number;
    dp:number;
    h:number;
    l:number;
    o:number;
    pc:number;
    t:number;
}
export class HistoricalModel{
    results:[]
}
export class NewsModel{
    results:NewsItem[]
}
export class NewsItem{
    category:string;
    datetime:Date;
    headline:string;
    id:number;
    image:string;
    related:string;
    source:string;
    summary:string;
    url:string;
}
export class RecommendationTrendsModel{
    results:RecTrend[]
}
export class RecTrend{
    buy:number;
    hold:number;
    period:string;
    sell:number;
    strongBuy:number;
    strongSell: number;
    symbol: string;
}
export class InsiderModel{
    data:Insider[];
    symbol:string;
}
export class Insider{
    symbol: string;
    year: number;
    month: number;
    change: number;
    mspr: number;
}
export class PeersModel{
    results:[]
}
export class EarningsModel{
    results:Earn[]
}
export class Earn{
    actual: number;
    estimate: number;
    period: string;
    quarter: number;
    surprise: number;
    surprisePercent: number;
    symbol: string;
    year: number;
}
export class WatchlistModel{
    companyName: string;
    ticker: string;
    lastPrice: number;
    change: number;    
    changePercentage: number;    
}
export class PortfolioModel{
    companyName: string;
    ticker: string;
    quantity: number;
    avgCostPerShare: number;    
    totalCost: number;    
    change: number;
    currentPrice: number;
    marketValue: number;
}
export class IWL{
    flag:boolean
}
export class WatchlistItems{
    results:[]
}
export class WL{
    ticker:string
}
export class Urls {
    public static searchUrl: string = 'http://localhost:3000/autocomplete?searchInput=';
    public static companyUrl: string = 'http://localhost:3000/search/company/';
    public static quoteUrl: string = 'http://localhost:3000/search/stockquote/';
    public static histUrl: string = 'http://localhost:3000/search/historical/';
    public static peersUrl: string = 'http://localhost:3000/search/company-peers/';
    public static newsUrl: string = 'http://localhost:3000/search/company-news/';
    public static recsUrl: string = 'http://localhost:3000/search/recommendation-trends/';
    public static insUrl: string = 'http://localhost:3000/search/insider-sentiment/';
    public static earnUrl: string = 'http://localhost:3000/search/company-earnings/';
    public static iswlUrl: string = 'http://localhost:3000/isonwatchlist/';
    public static delwlUrl: string = 'http://localhost:3000/delfromwatchlist/';
    public static addwlUrl: string = 'http://localhost:3000/addtowatchlist/';
    public static getwlUrl: string = 'http://localhost:3000/getwatchlist/'; 

}
