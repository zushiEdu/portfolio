let projectCounter = 0;
let rowCounter = 0;
let projectPageIndex = 1;
const pageLength = 6;
let masterProjects;
let pageAmount = 0;
let photosContainer1Height = 0;
let photosContainer2Height = 0;

let contentContainer = document.getElementsByClassName('content')[0];
let projectsContainer = document.getElementById('projects');
let photosContainer1 = document.getElementById('photoCol1');
let photosContainer2 = document.getElementById('photoCol2');

const urlParams = new URLSearchParams(window.location.search);
const pageParam = urlParams.get('page');
projectPageIndex = pageParam;

fetch('/Data/photos.json')
    .then(response => response.json())
    .then(images => {
        images.forEach((image) => {
            let img = document.createElement('img');
            img.src = image.url;
            if (photosContainer1Height >= photosContainer2Height) {
                photosContainer2Height += 1;
                photosContainer2.appendChild(img);
            } else {
                photosContainer1Height += 1;
                photosContainer1.appendChild(img);
            }
        })
    });

fetch('/Data/projects.json')
    .then(response => response.json())
    .then(projects => {
        projects = projects.sort(
            (p1, p2) => (p1.date < p2.date) ? 1 : (p1.date > p2.date) ? -1 : 0);
        projects.forEach((project) => {
            if (project.display) {
                projectCounter++;
                let cell = document.createElement('td');
                let section = document.createElement('section');
                cell.id = project.title.replaceAll(" ", "_") + "_cell";

                if (project.thumb != null) {
                    let image = document.createElement('img');
                    image.setAttribute("class", "contentThumb");
                    image.src = project.thumb;
                    section.appendChild(image);
                }

                let innerList = document.createElement('ul');

                let title;
                if (project.title != null) {
                    title = document.createElement('h3');
                    title.textContent = project.title;
                    title.setAttribute("class", "miniTitle");

                }

                let tldr;
                if (project.tldr != null) {
                    tldr = document.createElement('p');
                    tldr.setAttribute("class", "tldr");
                    tldr.textContent = project.tldr;
                }

                let tileLi = document.createElement('li');
                tileLi.appendChild(title);
                tileLi.appendChild(tldr);
                innerList.appendChild(tileLi);

                if (project.paragraph != null) {
                    let more = document.createElement('a');
                    let tileTag = project.title.replaceAll(" ", "_");
                    more.href = "#" + tileTag;
                    more.setAttribute("class", "underlined");
                    more.textContent = "More";
                    more.id = project.title.replaceAll(" ", "_") + "_link";
                    let morePage = document.createElement('div');

                    more.addEventListener("click", function (event) {
                        morePage.setAttribute("style", "display:block");
                    })

                    let li = document.createElement('li');
                    li.appendChild(more);
                    innerList.appendChild(li);

                    morePage.setAttribute("class", "page");
                    let description = document.createElement('p');
                    let back = document.createElement('a');
                    back.href = "#projects";
                    back.setAttribute("class", "underlined");
                    back.textContent = "Back";

                    back.addEventListener("click", function (event) {
                        morePage.setAttribute("style", "display:none");
                    })

                    morePage.appendChild(back);

                    let title = document.createElement('h2');
                    title.innerText = project.title;
                    morePage.appendChild(title);

                    let header = document.createElement('img');
                    header.src = project.header;
                    header.setAttribute("class", "moreInfoHeader");
                    morePage.appendChild(header);

                    let date = document.createElement('p');
                    date.innerText = project.date;
                    date.setAttribute("style", "display:inline");
                    morePage.appendChild(date);


                    if (project.links != null) {
                        const urls = project.links;
                        for (let j = 0; j < urls.length; j++) {
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
                    morePage.setAttribute("id", tileTag + "_page");
                    contentContainer.appendChild(morePage);
                }

                section.appendChild(innerList);

                cell.appendChild(section);

                let row = Math.round(projectCounter / 2);
                if (document.getElementById(row)) {
                    tr = document.getElementById(row);
                    projectsContainer.appendChild(tr);
                    tr.appendChild(cell);
                } else {
                    let newRow = document.createElement('tr');
                    newRow.id = Math.round(projectCounter / 2);
                    newRow.appendChild(cell);
                    rowCounter++;
                    projectsContainer.appendChild(newRow);
                }
            }
        });

        let projectsNav = document.createElement('ul');
        projectsNav.id = 'projectsNav';

        pageAmount = Math.ceil(projects.length) / pageLength;

        for (let k = 0; k < pageAmount; k++) {
            let listItem = document.createElement('li');
            let link = document.createElement('a');
            link.innerText = k + 1;
            link.setAttribute('onclick', 'loadPage(' + (k + 1) + ')');
            // link.setAttribute('href', '#projects');
            link.setAttribute('class', 'projectPagesNavText');
            link.setAttribute('id', 'page' + (k + 1) + 'Text');
            listItem.setAttribute('id', 'page' + (k + 1) + 'Link');
            listItem.appendChild(link);
            projectsNav.appendChild(listItem);
        }

        projectsContainer.appendChild(projectsNav);

        loadPage(projectPageIndex);

        if ((window.location.hash == '')) {
            console.log("Landed on no content page, redirecting to projects.");
            document.getElementById('projectsButton').click();
        } else if (!(window.location.hash == '#projects' || window.location.hash == '#photography' || window.location.hash == '#awards' || window.location.hash == '#about-me')) {
            console.log("Someone tried directing to a specific page, directing to page.");
            document.getElementById('projectsButton').click();
            document.getElementById(window.location.hash.replace("#", '') + "_link").click();
        }

    });

function loadPage(page) {
    projectPageIndex = page;

    const url = new URL(window.location);
    url.searchParams.set("page", projectPageIndex);
    history.pushState(null, '', url);

    for (let i = 1; i < pageAmount + 1; i++) {
        if (i == projectPageIndex) {
            document.getElementById('page' + i + 'Text').style.textDecoration = 'underline';
        } else {
            document.getElementById('page' + i + 'Text').style.textDecoration = 'none';
        }
    }

    for (let i = 1; i <= rowCounter; i++) {
        document.getElementById(i).style.display = 'none';
    }

    for (let i = (page * 3) - 2; i <= page * 3; i++) {
        if (document.getElementById(i) != undefined) {
            document.getElementById(i).style.display = 'table-row';
        }
    }
}