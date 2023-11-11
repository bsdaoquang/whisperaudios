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
}

export interface Chapter {
  title: string;
  source: string;
  time?: string;
  audio?: string;
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
  time: number;
  position: number;
  chap: number;
  audioId: string;
  uid: string;
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
