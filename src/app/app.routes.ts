import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Projects } from './components/projects/projects';
import { ProjectDetail } from './components/project-detail/project-detail';
import { Photography } from './components/photography/photography';
import { AboutMe } from './components/about-me/about-me';
import { Resume } from './components/resume/resume';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'projects', component: Projects },
  { path: 'projects/:title', component: ProjectDetail },
  { path: 'photography', component: Photography },
  { path: 'about-me', component: AboutMe },
  { path: 'resume', component: Resume },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
