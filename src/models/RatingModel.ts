export interface RatingModel {
  key?: string;
  star: number;
  review: string;
  by: string;
  target?: string; // rating cho cái gì
  bookId: string; // id của cái gì
  time: number;
}