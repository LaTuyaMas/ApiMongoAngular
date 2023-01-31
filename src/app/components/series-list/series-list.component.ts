import {Component, OnInit} from '@angular/core';
import {Serie} from "../../common/serie";
import {SerieService} from "../../services/serie.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.css']
})
export class SeriesListComponent implements OnInit{

  series: Serie[] = [];

  formMovie: FormGroup = this.formBuilder.group({
    _id: [''],
    __v: [0],
    images: [''],
    title: [''],
    categories: [''],
    episodes: [0],
    year: [0],
    plot: [''],
    user_score: this.formBuilder.group({
      email: [''],
      votes: [0]
    })

  });

  mynewCategorie = new FormGroup({
    newCategorie: new FormControl('')
  });

  genres: string[] = [];

  editar = false;

  constructor(private serieService: SerieService, private formBuilder: FormBuilder) {}

  // GETTERS

  // GETTERS

  ngOnInit() {
    this.listSeries();
  }

  listSeries(): void {
    this.serieService.getSerieList().subscribe(
      (data: any) => {
        this.series = data;
      }
    );
  }

  puntuacionMedia2(serie: Serie): number{
    let total = 0;
    serie.user_score.forEach((user) => {
      total += user.score;
    });
    let media = total / serie.user_score.length;
    return Math.round(media * 10) / 10;
  }
}
