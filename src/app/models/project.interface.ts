export interface ProjectLink {
  displayText: string;
  url: string;
}

export interface Project {
  title: string;
  tldr: string;
  date: string;
  thumb: string;
  header: string;
  paragraph: string;
  links?: ProjectLink[];
  technologies?: string[];
  display: boolean;
}

export interface Photo {
  url: string;
  durl: string;
}
