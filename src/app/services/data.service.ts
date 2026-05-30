import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Project, Photo } from '../models/project.interface';

const ICONS: Record<string, string> = {
  onshape: 'onshape.png',
  arduino: 'arduino.png',
  css: 'css.png',
  golang: 'golang.png',
  html: 'html.png',
  java: 'java.png',
  javascript: 'javascript.png',
  mariadb: 'mariadb.png',
  revit: 'revit.png',
  unity: 'unity.png',
  unraid: 'unraid.png',
  sqlite: 'sqlite.png',
  kicad: 'kicad.png',
  stm32: 'stm32.png',
};

const FEATURED_TITLES = [
  'Filedex',
  '2024 Battle Bots',
  'Power Distribution Board',
  'Caved',
  'Business Card',
  'Fan Controller Board',
];

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>('/Data/projects.json')
      .pipe(
        map((projects) =>
          projects
            .filter((p) => p.display)
            .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        ),
        shareReplay(1)
      );
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.getProjects().pipe(
      map((projects) =>
        projects.filter((p) => FEATURED_TITLES.includes(p.title))
      )
    );
  }

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>('/Data/photos.json').pipe(shareReplay(1));
  }

  getIconPath(technology: string): string {
    const icon = ICONS[technology.toLowerCase()];
    return icon ? `/Icons/${icon}` : '';
  }

  getProjectByTitle(projects: Project[], title: string): Project | undefined {
    return projects.find(
      (p) => p.title.replaceAll(' ', '_') === title
    );
  }

  static formatParagraph(text: string): string {
    return text
      .replaceAll('\n', '<br>')
      .replaceAll(/\*\*\* (.+?) \*\*\*/g, '<h3>$1</h3>')
      .replaceAll(/\*\* (.+?) \*\*/g, '<h4>$1</h4>')
      .replaceAll(/\* (.+?) \*/g, '<h5>$1</h5>');
  }
}
