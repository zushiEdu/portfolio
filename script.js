var projectCounter = 0;
var rowCounter = 0;
var projectPageIndex = 1;
const pageLength = 6;
var masterProjects;

var contentContainer = document.getElementsByClassName('content')[0];
var projectsContainer = document.getElementById('projects');

fetch('/Data/projects.json')
    .then(response => response.json())
    .then(projects => {
        projects = projects.sort(
            (p1, p2) => (p1.date < p2.date) ? 1 : (p1.date > p2.date) ? -1 : 0);
        projects.forEach((project) => {
            if (project.display) {
                projectCounter++;
                var cell = document.createElement('td');
                var section = document.createElement('section');
                cell.id = project.title.replaceAll(" ", "_");

                if (project.thumb != null) {
                    var image = document.createElement('img');
                    image.setAttribute("class", "contentThumb");
                    image.src = project.thumb;
                    section.appendChild(image);
                }

                var innerList = document.createElement('ul');

                var title;
                if (project.title != null) {
                    title = document.createElement('h3');
                    title.textContent = project.title;
                    title.setAttribute("class", "miniTitle");

                }

                var tldr;
                if (project.tldr != null) {
                    tldr = document.createElement('p');
                    tldr.setAttribute("class", "tldr");
                    tldr.textContent = project.tldr;
                }

                var tileLi = document.createElement('li');
                tileLi.appendChild(title);
                tileLi.appendChild(tldr);
                innerList.appendChild(tileLi);

                if (project.paragraph != null) {
                    var more = document.createElement('a');
                    var tileTag = project.title.replaceAll(" ", "_");
                    more.href = "#" + tileTag;
                    more.setAttribute("class", "underlined");
                    more.textContent = "More";
                    var morePage = document.createElement('div');

                    more.addEventListener("click", function (event) {
                        morePage.setAttribute("style", "display:block");
                    })

                    var li = document.createElement('li');
                    li.appendChild(more);
                    innerList.appendChild(li);

                    morePage.setAttribute("class", "page");
                    var description = document.createElement('p');
                    var back = document.createElement('a');
                    back.href = "#projects";
                    back.setAttribute("class", "underlined");
                    back.textContent = "Back";

                    back.addEventListener("click", function (event) {
                        morePage.setAttribute("style", "display:none");
                    })

                    morePage.appendChild(back);

                    var title = document.createElement('h2');
                    title.innerText = project.title;
                    morePage.appendChild(title);

                    var header = document.createElement('img');
                    header.src = project.header;
                    header.setAttribute("class", "moreInfoHeader");
                    morePage.appendChild(header);

                    var date = document.createElement('p');
                    date.innerText = project.date;
                    date.setAttribute("style", "display:inline");
                    morePage.appendChild(date);


                    if (project.links != null) {
                        const urls = project.links;
                        for (var j = 0; j < urls.length; j++) {
                            const seperator = document.createElement('a')
                            seperator.textContent = " | ";
                            const link = document.createElement('a');
                            link.textContent = urls[j].displayText;
                            link.href = urls[j].url;
                            link.setAttribute("style", "display:inline; text-decoration:underline");
                            link.target = '_blank';
                            morePage.appendChild(seperator);
                            morePage.appendChild(link);
                        }
                    }

                    description.innerText = project.paragraph;
                    morePage.appendChild(description);
                    morePage.setAttribute("id", tileTag);
                    contentContainer.appendChild(morePage);
                }

                section.appendChild(innerList);

                cell.appendChild(section);

                var row = Math.round(projectCounter / 2);
                if (document.getElementById(row)) {
                    tr = document.getElementById(row);
                    projectsContainer.appendChild(tr);
                    tr.appendChild(cell);
                } else {
                    var newRow = document.createElement('tr');
                    newRow.id = Math.round(projectCounter / 2);
                    newRow.appendChild(cell);
                    rowCounter++;
                    projectsContainer.appendChild(newRow);
                }
            }
        });

        var projectsNav = document.createElement('ul');
        projectsNav.id = 'projectsNav';

        for (let k = 0; k < Math.ceil(projects.length) / pageLength; k++) {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.innerText = k + 1;
            link.setAttribute('onclick', 'loadPage(' + (k + 1) + ')');
            link.setAttribute('href', '#projects');
            listItem.setAttribute('id', 'page' + (k + 1) + 'Link');
            listItem.appendChild(link);
            projectsNav.appendChild(listItem);
        }

        projectsContainer.appendChild(projectsNav);

        loadPage(projectPageIndex);
        // document.getElementById(window.location.hash.replace('#', '')).setAttribute("style", "display:block");

    });

function loadPage(page) {
    projectPageIndex = page;
    for (var i = 1; i <= rowCounter; i++) {
        document.getElementById(i).style.display = 'none';
    }

    for (var i = (page * 3) - 2; i <= page * 3; i++) {
        if (document.getElementById(i) != undefined) {
            document.getElementById(i).style.display = 'table-row';
        }
    }
}


// if (document.getElementById(window.location.hash).style.display == '') {

// }