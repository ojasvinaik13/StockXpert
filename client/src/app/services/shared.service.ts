import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sharedData: string = "";

  constructor() { }

  setData(data: any): void {
    this.sharedData = data;
  }

  getData(): string {
    return this.sharedData;
  }
}
