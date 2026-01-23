import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { TextFormatDirective } from '../../directives/text-format.directive';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, TextFormatDirective],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  public filterText: string = '';

  @Output() name = new EventEmitter<string>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.filterText = params['q'];
        this.name.emit(this.filterText);
      }
    });
  }

  sendFilter() { 
    const value = this.filterText?.toLowerCase();
    this.router.navigate(['/blog'], { 
      queryParams: { q: value } 
    }); 
    this.name.emit(this.filterText); 
  }
}