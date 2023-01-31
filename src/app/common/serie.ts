export interface Serie {
  _id: string;
  images: string[];
  title: string;
  categories: string[];
  episodes: number;
  year: number;
  plot: string;
  user_score: [{
    email: string;
    score: number;
  }]
}
