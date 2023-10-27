export interface Chaps {
  chap: number;
  position: number;
  date: number;
}

export interface Chapter {
  bookId: string;
  chaps: Chap[];
  key: string;
  updateAt: number;
}

export interface Chap {
  audio: string;
  buyUrl: string;
  cover: string;
  downloadFilename: string;
  downloadUrl: string;
  lyrics: string;
  subtitle: string;
  title: string;
}
