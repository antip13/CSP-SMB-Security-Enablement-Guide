(() => {
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((section, index) => {
      section.style.transitionDelay = `${index * 90}ms`;
      observer.observe(section);
    });
  }

  const viewer = document.querySelector("[data-doc-viewer]");
  if (!viewer) {
    return;
  }

  const allowed = {
    "Sales readiness.md": "Sales readiness",
    "Tech readiness and deplyment guides.md": "Tech readiness and deployment guides",
    "Partner Playbook and Learning materials.md": "Partner Playbook and Learning materials",
    "Avaliable demos.md": "Available demos",
  };

  const params = new URLSearchParams(window.location.search);
  const doc = params.get("doc") || "Sales readiness.md";

  if (!Object.prototype.hasOwnProperty.call(allowed, doc)) {
    viewer.innerHTML = "<p>Requested guide is not available.</p>";
    return;
  }

  const heading = document.querySelector("[data-doc-title]");
  if (heading) {
    heading.textContent = allowed[doc];
  }

  fetch(`docs/${encodeURIComponent(doc)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${doc}`);
      }
      return response.text();
    })
    .then((markdown) => {
      if (!window.marked) {
        viewer.textContent = markdown;
        return;
      }
      viewer.innerHTML = window.marked.parse(markdown);
    })
    .catch(() => {
      viewer.innerHTML = "<p>Unable to load this guide. Check that the docs file exists in the repository.</p>";
    });
})();