import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ProjectCard } from '../project-card/project-card';
import type { Project } from '../../models/project.interface';

@Component({
  selector: 'app-home',
  imports: [ProjectCard],
  templateUrl: './home.html',
  styles: `
    .featured-grid {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }

    .featured-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1em;
    }

    .featured-cell {
      display: flex;
    }
  `,
})
export class Home implements OnInit {
  private dataService = inject(DataService);
  featured = signal<Project[]>([]);

  featuredChunks = computed(() => {
    const chunks: Project[][] = [];
    const projs = this.featured();
    for (let i = 0; i < projs.length; i += 2) {
      chunks.push(projs.slice(i, i + 2));
    }
    return chunks;
  });

  ngOnInit(): void {
    this.dataService.getFeaturedProjects().subscribe((projects) => {
      this.featured.set(projects);
    });
  }
}
