export interface Category {
  key?: string;
  description: string;
  title: string;
  titleEnglish: string;
  slug: string;
  type: string;
  bookIds: {
    key?: string;
    bookId: string;
    type: string;
  }[];
  followers: string[];
  image: string;
}
