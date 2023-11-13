import {HtmlHTMLAttributes} from 'react';

export interface Book {
  key?: string;
  title: string;
  slug: string;
  authorId: string;
  chapsId: string;
  description: string;
  image: string;
  createdAt: number;
  updatedAt: number;
  liked: string[];
  listens: number;
  download: number;
  categories: string[];
  rate?: number;
  type: string;
  status?: string;
  totalChaps?: number;
  recordBy: string;
  uploadBy: string;
  followers: string[];
}

export interface Chapter {
  audio: string;
  buyUrl: string;
  cover: string;
  downloadFilename: string;
  downloadUrl: string;
  lyrics: string;
  subtitle: string;
  title: string;
}

export interface ChapterStory {
  contentId: string;
  title: string;
}

export interface BookSearch {
  key: string;
  title: string;
  image: string;
  author: string;
  like: number;
  listens: number;
  chap: number;
  update: number;
}

export interface ReadingBook {
  key: string;
  chaps: number[];
  chap: number;
  date: number;
  title: string;
}

export interface ListeningBook {
  key: string;
  val: Listening;
}

export interface Listening {
  key: string;
  chaps: number[];
  date: number;
  position: number;
  chap: number;
  audioId: string;
  uid: string;
  slug: string;
}

export enum Fillter {
  'latest',
  'oldest',
  'listens',
  'liked',
  'chap',
}

export enum CatType {
  'book' = 'Sách nói',
  'story' = 'Truyện audio',
  'read' = 'Truyện đọc',
}
