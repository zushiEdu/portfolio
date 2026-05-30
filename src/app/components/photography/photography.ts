import { Component, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import type { Photo } from '../../models/project.interface';

@Component({
  selector: 'app-photography',
  imports: [],
  templateUrl: './photography.html',
  styles: ``,
})
export class Photography implements OnInit {
  private dataService = inject(DataService);

  col1 = signal<Photo[]>([]);
  col2 = signal<Photo[]>([]);
  col1Height = 0;
  col2Height = 0;

  ngOnInit(): void {
    this.dataService.getPhotos().subscribe((photos) => {
      const c1: Photo[] = [];
      const c2: Photo[] = [];
      for (const photo of photos) {
        if (this.col1Height >= this.col2Height) {
          this.col2Height++;
          c2.push(photo);
        } else {
          this.col1Height++;
          c1.push(photo);
        }
      }
      this.col1.set(c1);
      this.col2.set(c2);
    });
  }
}
