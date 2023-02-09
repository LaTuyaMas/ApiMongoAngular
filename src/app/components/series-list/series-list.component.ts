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

  // DECLARACIÓN DE VARIABLES [
  series: Serie[] = [];

  formSerie: FormGroup = this.formBuilder.group({
    _id: [''],
    images: this.formBuilder.array([]),
    title: [''],
    categories: [''],
    episodes: [0],
    year: [0],
    plot: [''],
    user_score: this.formBuilder.array([])
  });

  newCategorie: FormGroup = this.formBuilder.group( {
    _id: [''],
    name: [''],
    icon: ['']
  });

  categories: string[] = [];
  categories2: Categorie[] = [];

  editar = false;
  // ] DECLARACIÓN DE VARIABLES

  constructor(private serieService: SerieService,
              private categorieService: CategorieService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.listSeries();
  }

  // GETTERS Y FUNCIONES DE ARRAYS [

  get images() : FormArray {
    return this.formSerie.controls["images"] as FormArray;
  }

  addImage() {
    this.images.push(new FormControl(''));
  }

  get user_scores() : FormArray {
    return this.formSerie.get("user_score") as FormArray;
  }

  // ] GETTERS Y FUNCIONES DE ARRAYS
  // FUNCIONES [

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
      console.log(serie);
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
    this.newCategorie.reset();
    this.images.clear();
    this.user_scores.clear();
    this.editar = true;
    console.log(serie);

    for (let i = 0; i < serie.images.length; i++) {
      this.images.push(new FormControl(''));
    }

    for (let i = 0; i < serie.user_score!.length; i++) {
      this.user_scores.push(
        this.formBuilder.group({
          email: serie.user_score![i].email,
          score: serie.user_score![i].score
        })
      );
    }

    this.formSerie.setValue(serie);
    console.log(this.formSerie);
  }

  newSerie() {
    this.formSerie.reset();
    this.newCategorie.reset();
    this.images.clear();
    this.editar = false;

    for (let i = 0; i < 3; i++) {
      this.images.push(new FormControl(''));
    }
  }

  addNewCategorie(/*newCategorieName: string, newCategorieIcon: string*/) {
    if (this.newCategorie.get('name')?.getRawValue() != '' || this.newCategorie.get('icon')?.getRawValue() != ''){
      const categorie: Categorie = this.newCategorie.getRawValue();
      console.log(categorie);
      let newCategories;

      newCategories = this.formSerie.getRawValue().categories;
      newCategories.push(categorie.name);

      this.categorieService.createCategorie(categorie).subscribe(
        (data:any) => {
          console.log(data);
        }
      );

      this.formSerie.setControl(
        'categories',
        new FormControl(newCategories)
      );


      this.newCategorie.reset();
    }
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
  // ] FUNCIONES
}
