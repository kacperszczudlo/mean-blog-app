import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router'; // Import Routera
import { TextFormatDirective } from '../../directives/text-format.directive'; // Import Dyrektywy

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, TextFormatDirective], // Dodajemy dyrektywę do imports
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  public filterText: string = '';

  @Output() name = new EventEmitter<string>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Sprawdzamy, czy w URL jest parametr 'name' (np. ?name=test)
    this.route.queryParams.subscribe(params => {
      if (params['name']) {
        this.filterText = params['name'];
        this.name.emit(this.filterText);
      }
    });
  }

  sendFilter() { 
    const value = this.filterText?.toLowerCase();
    this.router.navigate(['/blog'], { 
      queryParams: { name: value, title: value } 
    }); 
    this.name.emit(this.filterText); 
  }
}