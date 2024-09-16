var projectCounter = 0;

// JavaScript code to load projects dynamically
fetch('projects.json')
    .then(response => response.json())
    .then(projects => {
        const projectsContainer = document.getElementById('projects-container');
        projects = projects.sort(
            (p1, p2) => (p1.date < p2.date) ? 1 : (p1.date > p2.date) ? -1 : 0);
        projects.forEach(project => {
            if (project.display) {
                projectCounter++;
                const cell = document.createElement('td');
                // Create a new section for each project
                const section = document.createElement('section');
                section.id = project.title.replaceAll(" ", "_");

                if (project.img != null) {
                    const image = document.createElement('img');
                    image.src = project.img;
                    section.appendChild(image);
                }

                // Add project content to the section
                const title = document.createElement('h2');
                title.textContent = project.title;
                cell.appendChild(title);

                // Content
                const content = document.createElement('p');
                content.textContent = project.content;
                section.appendChild(content);

                // Date
                const br = document.createElement('br');
                br.style = "display: block; margin-bottom: 0.5rem;";
                section.appendChild(br);
                const date = document.createElement('p');
                date.textContent = project.date;
                date.style = 'display:inline';
                section.appendChild(date);

                const urls = project.urls;
                for (var i = 0; i < urls.length; i++) {
                    const seperator = document.createElement('a')
                    seperator.textContent = " | ";
                    const devpost = document.createElement('a');
                    devpost.textContent = urls[i].displayText;
                    devpost.href = urls[i].url;
                    devpost.style = 'display:inline';
                    devpost.target = '_blank';
                    section.appendChild(seperator);
                    section.appendChild(devpost);
                }

                cell.appendChild(section);

                var row = Math.round(projectCounter / 2);
                if (document.getElementById(row)) {
                    tr = document.getElementById(row);
                    projectsContainer.appendChild(tr);
                    tr.appendChild(cell);
                } else {
                    const newRow = document.createElement('tr');
                    newRow.id = Math.round(projectCounter / 2);
                    newRow.appendChild(cell);
                    projectsContainer.appendChild(newRow);
                }
            }
        });
    });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('type') == "adhd") {
    const bonusContent = document.getElementById("bonus-content");
    const video = document.createElement("iframe");
    video.src = "https://youtube.com/embed/ChBg4aowzX8?t=200&autoplay=1&mute=1&showinfo=0&controls=0&autohide=1&modestbranding";
    video.frameBorder = "0";
    video.width = "100%";
    video.height = "100%";
    video.allow = 'autoplay';
    bonusContent.appendChild(video);
}