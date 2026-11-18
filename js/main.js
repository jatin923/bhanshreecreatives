(function () {
  const site = window.SITE || {};
  const projects = window.PROJECTS || [];

  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.setAttribute("aria-controls", "primary-navigation");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", document.body.classList.contains("nav-open") ? "true" : "false");
      navToggle.setAttribute("aria-label", document.body.classList.contains("nav-open") ? "Close menu" : "Open menu");
    });
  }

  const nav = document.querySelector(".nav");
  if (nav) nav.id = "primary-navigation";

  document.querySelectorAll(".nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      }
    });
  });

  const page = document.body.dataset.page;
  document.querySelectorAll('.nav a[data-page="' + page + '"]').forEach(function (link) {
    link.classList.add("is-active");
  });

  if (site.gaId) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + site.gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", site.gaId);
  }

  function waLink(text) {
    const msg = encodeURIComponent(text || "Hello Bhanshree Creatives, I would like to discuss a project.");
    return "https://wa.me/" + site.phone + "?text=" + msg;
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.href = waLink(el.getAttribute("data-whatsapp"));
  });

  const featured = document.querySelector("[data-featured]");
  if (featured) {
    const items = projects.filter(function (p) {
      return p.featured;
    });
    featured.innerHTML = items
      .map(function (p, i) {
        const tall = i === 0 ? " tall" : "";
        return (
          '<a class="work-card' +
          tall +
          '" href="work.html#' +
          p.id +
          '">' +
          '<img class="img-bw" src="' +
          p.image +
          '" alt="' +
          p.title +
          '">' +
          "<figcaption><p>" +
          p.category +
          " · " +
          p.year +
          "</p><h3>" +
          p.title +
          "</h3></figcaption></a>"
        );
      })
      .join("");
  }

  const gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    const filters = document.querySelector("[data-filters]");
    const cats = ["All"].concat(
      projects
        .map(function (p) {
          return p.category;
        })
        .filter(function (c, i, arr) {
          return arr.indexOf(c) === i;
        })
    );

    if (filters) {
      filters.innerHTML = cats
        .map(function (c, i) {
          return '<button type="button" data-cat="' + c + '"' + (i === 0 ? ' class="is-on"' : "") + ">" + c + "</button>";
        })
        .join("");
    }

    function render(cat) {
      const list = cat && cat !== "All" ? projects.filter(function (p) { return p.category === cat; }) : projects;
      gallery.innerHTML = list
        .map(function (p) {
          return (
            '<a class="work-card" href="#' +
            p.id +
            '" data-open="' +
            p.id +
            '">' +
            '<img class="img-bw" src="' +
            p.image +
            '" alt="' +
            p.title +
            '">' +
            "<figcaption><p>" +
            p.category +
            " · " +
            p.year +
            "</p><h3>" +
            p.title +
            "</h3></figcaption></a>"
          );
        })
        .join("");
    }

    render("All");

    if (filters) {
      filters.addEventListener("click", function (e) {
        const btn = e.target.closest("button");
        if (!btn) return;
        filters.querySelectorAll("button").forEach(function (b) {
          b.classList.remove("is-on");
        });
        btn.classList.add("is-on");
        render(btn.getAttribute("data-cat"));
      });
    }

    const lightbox = document.querySelector("[data-lightbox]");
    const lightboxInner = document.querySelector("[data-lightbox-inner]");

    function asList(items, className) {
      if (!items || !items.length) return "";
      return (
        '<ul class="' +
        className +
        '">' +
        items
          .map(function (item) {
            return "<li>" + item + "</li>";
          })
          .join("") +
        "</ul>"
      );
    }

    function openProject(id) {
      const p = projects.find(function (item) {
        return item.id === id;
      });
      if (!p || !lightbox) return;
      const media = p.video
        ? '<iframe src="' + p.video + '" title="' + p.title + '" allowfullscreen></iframe>'
        : '<img src="' + p.image + '" alt="' + p.title + '">';
      const facts = [
        ["Client", p.client],
        ["Role", p.role],
        ["Scale", p.scale],
        ["Duration", p.duration]
      ].filter(function (row) {
        return row[1];
      });
      const meta =
        '<dl class="case-meta">' +
        facts
          .map(function (row) {
            return "<div><dt>" + row[0] + "</dt><dd>" + row[1] + "</dd></div>";
          })
          .join("") +
        "</dl>";
      lightboxInner.innerHTML =
        media +
        "<p class='kicker'>" +
        p.category +
        " · " +
        p.year +
        (p.location ? " · " + p.location : "") +
        "</p>" +
        "<h2>" +
        p.title +
        "</h2>" +
        meta +
        "<p>" +
        p.description +
        "</p>" +
        (p.process && p.process.length
          ? "<h3 class='case-sub'>How it ran</h3>" + asList(p.process, "case-list")
          : "") +
        (p.deliverables && p.deliverables.length
          ? "<h3 class='case-sub'>Delivered</h3>" + asList(p.deliverables, "case-list")
          : "") +
        (p.outcome ? "<h3 class='case-sub'>Close</h3><p>" + p.outcome + "</p>" : "");
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      if (location.hash) history.replaceState(null, "", location.pathname);
    }

    gallery.addEventListener("click", function (e) {
      const card = e.target.closest("[data-open]");
      if (!card) return;
      e.preventDefault();
      const id = card.getAttribute("data-open");
      history.replaceState(null, "", "#" + id);
      openProject(id);
    });

    if (lightbox) {
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox || e.target.closest("[data-close]")) closeLightbox();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });

    if (location.hash) {
      openProject(location.hash.slice(1));
    }
  }

  const form = document.querySelector("[data-enquiry]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const phone = data.get("phone") || "";
      const service = data.get("service") || "";
      const city = data.get("city") || "";
      const when = data.get("when") || "";
      const scale = data.get("scale") || "";
      const details = data.get("details") || "";
      const body =
        "Name: " +
        name +
        "\nEmail: " +
        email +
        "\nPhone: " +
        phone +
        "\nService: " +
        service +
        "\nCity: " +
        city +
        "\nDate / window: " +
        when +
        "\nScale: " +
        scale +
        "\n\n" +
        details;
      const text = encodeURIComponent("New enquiry — Bhanshree Creatives\n" + body);
      const wa = "https://wa.me/" + site.phone + "?text=" + text;
      window.open(wa, "_blank");
    });
  }
})();
