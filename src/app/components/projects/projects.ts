import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ProjectCard } from '../project-card/project-card';
import type { Project } from '../../models/project.interface';

const ROWS_PER_PAGE = 4;

@Component({
  selector: 'app-projects',
  imports: [ProjectCard],
  templateUrl: './projects.html',
  styles: `
    .projects-grid {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }

    .projects-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1em;
    }

    .projects-cell {
      display: flex;
    }
  `,
})
export class Projects implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  projects = signal<Project[]>([]);
  currentPage = signal(1);

  rows = computed(() => {
    const chunks: Project[][] = [];
    const projs = this.projects();
    for (let i = 0; i < projs.length; i += 2) {
      chunks.push(projs.slice(i, i + 2));
    }
    return chunks;
  });

  totalPages = computed(() =>
    Math.ceil(this.rows().length / ROWS_PER_PAGE)
  );

  visibleRows = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * ROWS_PER_PAGE;
    return this.rows().slice(start, start + ROWS_PER_PAGE);
  });

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = Number(params['page']) || 1;
      this.currentPage.set(page);
    });

    this.dataService.getProjects().subscribe((projects) => {
      this.projects.set(projects);
    });
  }

  goToPage(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
    window.scrollTo(0, 0);
  }
}
