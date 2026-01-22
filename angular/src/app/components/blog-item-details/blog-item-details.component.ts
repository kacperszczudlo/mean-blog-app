import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-blog-item-details',
  standalone: true,
  imports: [RouterLink],
  providers: [DataService],
  templateUrl: './blog-item-details.component.html',
  styleUrl: './blog-item-details.component.scss' 
})
export class BlogItemDetailsComponent implements OnInit {
  public image: string = '';
  public text: string = '';
  public title: string = '';

  constructor(private service: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      this.service.getById(id).subscribe((res: any) => {
        this.image = res.image;
        this.text = res.text;
        this.title = res.title;
      });
    });
  }
}