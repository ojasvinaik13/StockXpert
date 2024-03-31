export class NewsDetails {
    source: string = "";
    date: string = "";
    headline: string = "";
    newsUrl: string = "";
    imageUrl: string = "";
    summary: string = "";

    constructor(source: string, date: string, headline:string, newsUrl:string, imageUrl:string, summary:string) {
        this.source = source;
        this.date = date;
        this.headline = headline;
        this.newsUrl = newsUrl;
        this.imageUrl = imageUrl;
        this.summary = summary;
    }
}