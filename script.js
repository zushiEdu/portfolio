// JavaScript code to load projects dynamically
fetch('projects.json')
    .then(response => response.json())
    .then(projects => {
        const projectsContainer = document.getElementById('projects-container');
        projects = projects.sort(
            (p1, p2) => (p1.date < p2.date) ? 1 : (p1.date > p2.date) ? -1 : 0);
        projects.forEach(project => {
            // Create a new section for each project
            const section = document.createElement('section');

            // Add project content to the section
            const title = document.createElement('h2');
            title.textContent = project.title;
            section.appendChild(title);

            // Content
            const content = document.createElement('p');
            content.textContent = project.content;
            content.style = 'margin-bottom:1rem';
            section.appendChild(content);

            // Information Div
            const informationDiv = document.createElement('div');
            informationDiv.style = 'margin-top:1rem, display:flex';

            // Date
            const date = document.createElement('p');
            date.textContent = project.date + " | ";
            date.style = 'display:inline';
            informationDiv.appendChild(date);

            // Url
            const link = document.createElement('a');
            link.textContent = project.repoUrl;
            link.href = project.repoUrl;
            link.style = 'display:inline';
            link.target = '_blank';
            informationDiv.appendChild(link);

            section.appendChild(informationDiv);

            // Append the section to the container
            projectsContainer.appendChild(section);
        });
    });