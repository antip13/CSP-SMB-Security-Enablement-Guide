const docs = [
  {
    title: "Overview",
    path: "docs/00-overview.md",
    subtitle: "Program goals, outcomes, and team roles"
  },
  {
    title: "Sales Readiness",
    path: "docs/sales-readinss.md",
    subtitle: "Qualification, messaging, and deal readiness"
  },
  {
    title: "Scenario Playbook",
    path: "docs/scenario.md",
    subtitle: "Offer packaging and execution stage gates"
  },
  {
    title: "Tech Readiness",
    path: "docs/tech-readiness.md",
    subtitle: "Architecture and implementation priorities"
  },
  {
    title: "Learning",
    path: "docs/Learning.md",
    subtitle: "Learning and enablement resources"
  }
];

const docList = document.getElementById("doc-list");
const docTitle = document.getElementById("doc-title");
const docSubtitle = document.getElementById("doc-subtitle");
const docPreview = document.getElementById("doc-preview");
const openDoc = document.getElementById("open-doc");

function setActiveButton(path) {
  const buttons = docList.querySelectorAll("button");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.path === path);
  });
}

async function renderDoc(doc) {
  docTitle.textContent = doc.title;
  docSubtitle.textContent = doc.subtitle;
  openDoc.href = doc.path;
  openDoc.hidden = false;
  openDoc.textContent = "Open " + doc.path;
  setActiveButton(doc.path);

  docPreview.innerHTML = "<p>Loading markdown preview...</p>";

  try {
    const response = await fetch(doc.path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load document: " + response.status);
    }

    const markdown = await response.text();
    const rendered = marked.parse(markdown, { mangle: false, headerIds: true });
    docPreview.innerHTML = DOMPurify.sanitize(rendered);
  } catch (error) {
    docPreview.innerHTML =
      "<p>Preview unavailable in this context. Open the file directly instead.</p>" +
      '<p><a href="' + doc.path + '" target="_blank" rel="noopener noreferrer">Open document file</a></p>';
    console.error(error);
  }
}

function buildNav() {
  docs.forEach((doc) => {
    const button = document.createElement("button");
    button.className = "doc-btn";
    button.type = "button";
    button.dataset.path = doc.path;
    button.innerHTML =
      '<span class="title">' + doc.title + "</span>" +
      '<span class="path">' + doc.path + "</span>";

    button.addEventListener("click", () => {
      renderDoc(doc);
    });

    docList.appendChild(button);
  });
}

buildNav();
renderDoc(docs[0]);
