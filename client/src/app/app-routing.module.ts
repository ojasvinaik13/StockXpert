import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { SearchDetailsComponent } from './search-details/search-details.component';

const routes: Routes = [
  {path:'', redirectTo:'search/home', pathMatch:'full'},
  {path:'search/home', component:SearchBarComponent},
  {path:'portfolio', component:PortfolioComponent},
  {path:'watchlist', component:WatchlistComponent},
  {path:'search/:ticker', component:SearchDetailsComponent},
  {path:'**', redirectTo:'/search/home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
