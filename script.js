let projectCounter = 0;
let rowCounter = 0;
let projectPageIndex = 1;
const rowAmount = 4;
let pageAmount = 0;
let photosContainer1Height = 0;
let photosContainer2Height = 0;

let featuredRow = null;
let featuredCellCount = 0;

let contentContainer = document.getElementsByClassName('content')[0];
let morePageContainer = document.getElementById('morePageContainer');
let projectsContainer = document.getElementById('projects');
let featuredContainer = document.getElementById('featured');
let photosContainer1 = document.getElementById('photoCol1');
let photosContainer2 = document.getElementById('photoCol2');

const featured = ["Filedex", "2024 Battle Bots", "Power Distribution Board", "Caved"]

const urlParams = new URLSearchParams(window.location.search);
const pageParam = urlParams.get('page');
projectPageIndex = pageParam;

var currentSection = "home";

const icons = new Map([
    ["onshape", "onshape.png"],
    ["arduino", "arduino.png"],
    ["css", "css.png"],
    ["golang", "golang.png"],
    ["html", "html.png"],
    ["java", "java.png"],
    ["javascript", "javascript.png"],
    ["mariadb", "mariadb.png"],
    ["revit", "revit.png"],
    ["unity", "unity.png"],
    ["unraid", "unraid.png"],
    ["sqlite", "sqlite.png"],
    ["kicad", "kicad.png"]
]);

fetch('/Data/photos.json')
    .then(response => response.json())
    .then(images => {
        images.forEach((image) => {
            let a = document.createElement('a');
            a.download = "image-" + Date.now();
            a.href = image.durl;

            let img = document.createElement('img');
            img.src = image.url;
            img.loading = "lazy";

            a.appendChild(img)
            if (photosContainer1Height >= photosContainer2Height) {
                photosContainer2Height += 1;
                photosContainer2.appendChild(a);
            } else {
                photosContainer1Height += 1;
                photosContainer1.appendChild(a);
            }
        })
    });

fetch('/Data/projects.json')
    .then(response => response.json())
    .then(projects => {
        projects = projects.sort(
            (p1, p2) => (p1.date < p2.date) ? 1 : (p1.date > p2.date) ? -1 : 0);
        projects.forEach((project) => {
            // Check if the project is set to be displayed
            if (project.display) {
                // Increment the project counter and create a cell for each project
                projectCounter++;
                let cell = document.createElement('td');
                let section = document.createElement('section');
                cell.id = project.title.replaceAll(" ", "_") + "_cell";

                // Retrieve the thumbnail path from data and look for it in the files then add to tile
                if (project.thumb != null) {
                    let image = document.createElement('img');
                    image.setAttribute("class", "contentThumb");
                    image.setAttribute("loading", "lazy");
                    image.setAttribute("fetchpriority", "high");
                    image.src = project.thumb;
                    section.appendChild(image);
                }

                // Retrieve title from data and add element to tile
                let innerList = document.createElement('ul');

                let title;
                if (project.title != null) {
                    title = document.createElement('h3');
                    title.textContent = project.title;
                    title.setAttribute("class", "miniTitle");

                }

                // Retrieve tldr from data and add element to tile
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

                // Generate more data page for the tile if it exists
                if (project.paragraph != null) {
                    // Set attributes of more info page
                    let more = document.createElement('a');
                    let tileTag = project.title.replaceAll(" ", "_");
                    more.href = "#" + tileTag;
                    more.setAttribute("class", "underlined");
                    more.textContent = "More";
                    more.id = project.title.replaceAll(" ", "_") + "_link";
                    let morePage = document.createElement('div');

                    // Create button to lead to more info page
                    more.addEventListener("click", function (event) {
                        for (let i = 0; i < morePageContainer.children.length; i++) {
                            morePageContainer.children[i].style.display = "none";
                        }
                        morePage.style.display = "block";
                        morePageContainer.style.display = 'block';
                    })

                    let li = document.createElement('li');
                    li.appendChild(more);
                    innerList.appendChild(li);

                    // Create and set attributes for the back button
                    morePage.setAttribute("class", "page");
                    let description = document.createElement('p');

                    let back = document.createElement('a');
                    back.href = "#";
                    back.setAttribute("class", "underlined");
                    back.textContent = "Back";

                    back.addEventListener("click", function (event) {
                        event.preventDefault();
                        window.location.hash = currentSection;
                        morePage.style.display = "none";
                    })

                    morePage.appendChild(back);

                    // Create and set attributes for the information on the more page
                    let title = document.createElement('h2');
                    title.innerText = project.title;
                    morePage.appendChild(title);

                    if (project.header != "") {
                        let header = document.createElement('img');
                        header.src = project.header;
                        header.setAttribute("class", "moreInfoHeader");
                        morePage.appendChild(header);
                    }

                    let date = document.createElement('p');
                    date.innerText = project.date;
                    date.setAttribute("style", "display:inline");
                    morePage.appendChild(date);

                    // Create and add the links based on what is listed in the data file
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

                    if (project.technologies != null) {
                        const seperator = document.createElement('a')
                        seperator.textContent = " | ";
                        morePage.appendChild(seperator)

                        for (let i = 0; i < project.technologies.length; i++) {
                            let icon = document.createElement('img')
                            icon.src = "/Icons/" + icons.get(project.technologies[i]);
                            icon.className = "techIcon"
                            morePage.appendChild(icon);
                        }
                    }

                    // Create main body text and set attributes
                    paragraphText = project.paragraph;
                    description.innerHTML = paragraphText.replaceAll("\n", "<br>").replaceAll(/\*\*\* (.+?) \*\*\*/g, '<h3>$1</h3>')
                        .replaceAll(/\*\* (.+?) \*\*/g, '<h4>$1</h4>')
                        .replaceAll(/\* (.+?) \*/g, '<h5>$1</h5>');
                    morePage.appendChild(description);
                    morePage.setAttribute("id", tileTag + "_page");
                    morePageContainer.appendChild(morePage);
                }

                // Add more info page to inner page list
                section.appendChild(innerList);

                // Add cell to content section
                cell.appendChild(section);

                // Place cell based on current project counter index
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

                if (featured.includes(project.title)) {
                    let dupCell = cell.cloneNode(true)
                    const moreLink = dupCell.querySelector('a.underlined');

                    if (moreLink && project.paragraph != null) {
                        moreLink.addEventListener("click", function (event) {
                            for (let i = 0; i < morePageContainer.children.length; i++) {
                                morePageContainer.children[i].style.display = "none";
                            }

                            const morePage = document.getElementById(project.title.replaceAll(" ", "_") + "_page");
                            if (morePage) {
                                morePage.style.display = "block";
                                morePageContainer.style.display = 'block';
                            }
                        })
                    }

                    if (featuredCellCount % 2 === 0) {
                        // Start new row every 2 cells
                        featuredRow = document.createElement('tr');
                        featuredContainer.appendChild(featuredRow);
                    }

                    featuredRow.appendChild(dupCell);
                    featuredCellCount++;

                    featuredContainer.appendChild(featuredRow);
                }
            }
        });

        // Add button that leads to the more section on each tile
        let projectsNav = document.createElement('ul');
        projectsNav.id = 'projectsNav';

        pageAmount = Math.ceil(projectCounter / (rowAmount * 2));

        for (let k = 0; k < pageAmount; k++) {
            let listItem = document.createElement('li');
            let link = document.createElement('a');
            link.innerText = k + 1;
            link.setAttribute('onclick', 'loadPage(' + (k + 1) + ')');
            link.setAttribute('class', 'projectPagesNavText');
            link.setAttribute('id', 'page' + (k + 1) + 'Text');
            listItem.setAttribute('id', 'page' + (k + 1) + 'Link');
            listItem.appendChild(link);
            projectsNav.appendChild(listItem);
        }

        // Add entire section to project container
        projectsContainer.appendChild(projectsNav);

        // Show/hide tiles based on current page
        loadPage(projectPageIndex);

        // Check if a specific more info page was pointed to and redirect to there automatically
        if ((window.location.hash == '')) {
            console.log("Landed on no content page, redirecting to projects.");
            // document.getElementById('projectsButton').click();
            document.getElementById('homeButton').click();
        } else if (!(window.location.hash == '#projects' || window.location.hash == '#photography' || window.location.hash == '#awards' || window.location.hash == '#about-me' || window.location.hash == '#home' || window.location.hash == '#resume')) {
            // console.log("Someone tried directing to a specific page, directing to that page.");
            document.getElementById('projectsButton').click();
            document.getElementById(window.location.hash.replace("#", '') + "_link").click();
        }

    });

// function to edit what rows/tiles are displayed based on url
function loadPage(page) {
    projectPageIndex = page;

    // check for url
    const url = new URL(window.location);
    url.searchParams.set("page", projectPageIndex);
    history.pushState(null, '', url);

    window.scrollTo(0, 0);

    // Iterate through pages to set visibility
    for (let i = 1; i < pageAmount + 1; i++) {
        if (i == projectPageIndex) {
            document.getElementById('page' + i + 'Text').style.textDecoration = 'underline';
        } else {
            document.getElementById('page' + i + 'Text').style.textDecoration = 'none';
        }
    }

    // Iterate through rows that should not be visible and set none to display
    for (let i = 1; i <= rowCounter; i++) {
        document.getElementById(i).style.display = 'none';
    }

    // Iterate through rows that should be visible and set to display
    for (let i = (page * rowAmount) - (rowAmount - 1); i <= page * rowAmount; i++) {
        if (document.getElementById(i) != undefined) {
            document.getElementById(i).style.display = 'table-row';
        }
    }
}


// Check if a hash change has happened and set visibility of the more page container based upon that (is the fix to more page sections lingering after an interaction)
window.addEventListener("hashchange", function (e) {
    if (window.location.hash == '#projects' || window.location.hash == '#photography' || window.location.hash == '#awards' || window.location.hash == '#about-me' || window.location.hash == '#home' || window.location.hash == '#resume') {
        morePageContainer.style.display = 'none';
        currentSection = window.location.hash;
    } else {
        morePageContainer.style.display = 'block';
    }
});