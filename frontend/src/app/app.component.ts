import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SearchComponent, FooterComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(public appService: AppService) { }
  ngOnInit(): void {
    this.refreshUser();
  }
  private refreshUser() {
    const jwt = this.appService.getJWT();
    if(jwt){
      this.appService.refreshUser(jwt).subscribe({
        next: _ => {},
        error: _ => {
          this.appService.logout();
        }
      });
    }else{
      this.appService.refreshUser(null).subscribe();
    }
  }

  
}
