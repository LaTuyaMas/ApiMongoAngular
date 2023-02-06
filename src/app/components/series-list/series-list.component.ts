import {Component, OnInit} from '@angular/core';
import {Serie} from "../../common/serie";
import {SerieService} from "../../services/serie.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CategorieService} from "../../services/categorie.service";
import {Categorie} from "../../common/categorie";

@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.css']
})
export class SeriesListComponent implements OnInit{
  series: Serie[] = [];

  formSerie: FormGroup = this.formBuilder.group({
    _id: [''],
    images: this.formBuilder.array([
      //new FormControl(''),
      //new FormControl(''),
      //new FormControl('')
    ]),
    title: [''],
    categories: [''],
    episodes: [0],
    year: [0],
    plot: [''],
    user_score: []
    //user_score: this.formBuilder.array([])
    //user_score: this.formBuilder.group({
    //  email: [''],
    //  score: [0]
    //})
  });

  mynewCategorie = new FormGroup({
    newCategorie: new FormControl('')
  });

  get newCategorie(): any {
    return this.mynewCategorie.get('newCategorie')?.value;
  }

  categories: string[] = [];
  categories2: Categorie[] = [];

  auxImages: string[] = [];

  editar = false;

  constructor(private serieService: SerieService,
              private categorieService: CategorieService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.listSeries();
  }

  showImages() {
    console.log(this.images.value);
  }

  get images() : FormArray {
    return this.formSerie.controls["images"] as FormArray;
  }

  addImage(/*images: string[]*/) {
    //console.log(this.formSerie.get('images')?.value);
    //this.auxImages.push('');
    //this.auxImages.length = this.auxImages.length+1;
    this.images.push(new FormControl(''));
  }

  listSeries(): void {
    this.serieService.getSerieList().subscribe(
      (data: any) => {
        this.series = data;
        console.log(data);
      }
    );

    this.serieService.getCategories().subscribe(
      (data:any) => {
        this.categories = data;
      }
    );

    this.categorieService.getCategorieList().subscribe(
      (data:any) => {
        this.categories2 = data;
      }
    );
  }

  puntuacionMedia2(serie: Serie): number{
    let total = 0;
    serie.user_score!.forEach((user) => {
      total += user.score;
    });
    let media = total / serie.user_score!.length;
    return Math.round(media * 10) / 10;
  }

  onSubmit() {
    if (this.editar) {
      const id = this.formSerie.getRawValue()._id;
      this.serieService.updateSerie(id,
        this.formSerie.getRawValue()).subscribe(
        (data:any) => {
          this.listSeries();
        }
      );
    }
    else {
      const serie: Serie = this.formSerie.getRawValue();
      delete serie.user_score;
      this.serieService.createSerie(serie).subscribe(
        (data:any) => {
          console.log(data);
          this.listSeries();
        }
      );
    }
  }

  loadSerie(serie: Serie) {
    this.formSerie.reset();
    this.images.clear();
    this.editar = true;
    console.log(serie);

    for (let i = 0; i < serie.images.length; i++) {
      this.images.push(new FormControl(''));
    }

    this.formSerie.setValue(serie);
    this.auxImages = this.formSerie.get('images')?.value;
    console.log(this.formSerie);
  }

  newSerie() {
    this.formSerie.reset();
    this.auxImages = ['', '', ''];
    this.editar = false;
  }

  addNewCategorie(newCategorie: string) {
    let newCategories;

    if (!this.editar) {
      this.categories.push(newCategorie);
    }
    else {
      newCategories = this.formSerie.getRawValue().categories;
      newCategories.push(newCategorie);
      this.formSerie.setControl(
        'categories',
        new FormControl(newCategories)
      );
    }

    this.mynewCategorie.reset();
  }

  removeSerie(serie: Serie) {
    if (confirm('¿Desea borrar '+serie.title+'?')) {
      this.serieService.removeSerie(serie._id).subscribe(
        data => {
          console.log(data);
          this.listSeries();
        }
      );
    }
  }
}
