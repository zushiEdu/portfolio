import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Project } from '../../models/project.interface';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink],
  templateUrl: './project-card.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    section {
      flex: 1;
      min-height: 0;
    }
  `,
})
export class ProjectCard {
  @Input({ required: true }) project!: Project;
}
