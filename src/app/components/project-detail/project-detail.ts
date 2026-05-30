import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import type { Project } from '../../models/project.interface';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  templateUrl: './project-detail.html',
  styles: ``,
})
export class ProjectDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  project = signal<Project | undefined>(undefined);
  formattedParagraph = computed(() => {
    const p = this.project();
    return p ? DataService.formatParagraph(p.paragraph) : '';
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const titleSlug = params['title'];
      this.dataService.getProjects().subscribe((projects) => {
        this.project.set(
          this.dataService.getProjectByTitle(projects, titleSlug)
        );
      });
    });
  }

  getIcon(tech: string): string {
    return this.dataService.getIconPath(tech);
  }
}
