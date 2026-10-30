/* =========================================================
   A.M. CABLES — ULTRA PREMIUM WEBSITE ENGINE
   File: js/main.js
   Navigation • Search • Comparison • Modal • WhatsApp
   Forms • Scroll Reveal • Animations • Accessibility
========================================================= */

"use strict";

const AMCables = {
    whatsapp: "923054335465",

    message:
        "Assalam-o-Alaikum A.M. Cables, I would like to inquire about your cable products.",

    selectors: {
        menuToggle: "#menuToggle",
        navMenu: "#navMenu",
        productCard: ".products-grid .product-card",
        productSearch: "#productSearch",
        materialFilter: "#materialFilter",
        clearSearch: "#clearProductSearch",
        searchStatus: "#productSearchStatus",
        modal: "#productModal"
    },

    get(selector, parent = document) {
        return parent.querySelector(selector);
    },

    getAll(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    },

    normalise(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    },

    whatsappURL(message = AMCables.message) {
        return (
            "https://wa.me/" +
            AMCables.whatsapp +
            "?text=" +
            encodeURIComponent(message)
        );
    },

    openWhatsApp(message = AMCables.message) {
        window.open(
            AMCables.whatsappURL(message),
            "_blank",
            "noopener,noreferrer"
        );
    }
};


/* =========================================================
   01. MOBILE NAVIGATION
========================================================= */

AMCables.initNavigation = function () {
    const toggle = AMCables.get("#menuToggle");
    const menu = AMCables.get("#navMenu");

    if (!toggle || !menu) return;

    function closeMenu() {
        menu.classList.remove("active", "is-open", "open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");

        toggle.innerHTML =
            '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }

    function openMenu() {
        menu.classList.add("active");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation menu");

        toggle.innerHTML =
            '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    }

    toggle.setAttribute("aria-controls", "navMenu");
    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", function () {
        if (menu.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    AMCables.getAll("a", menu).forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (event) {
        if (
            menu.classList.contains("active") &&
            !menu.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 850) closeMenu();
    });
};


/* =========================================================
   02. COPYRIGHT YEAR
========================================================= */

AMCables.initCopyrightYear = function () {
    const year = new Date().getFullYear();

    [
        "#currentYear",
        "#current-year",
        "[data-current-year]"
    ].forEach(function (selector) {
        AMCables.getAll(selector).forEach(function (element) {
            element.textContent = year;
        });
    });
};


/* =========================================================
   03. ACTIVE NAVIGATION LINK
========================================================= */

AMCables.initActiveNavigation = function () {
    const path = window.location.pathname;
    const currentPage =
        path.split("/").filter(Boolean).pop() || "index.html";

    AMCables.getAll(".nav-menu a").forEach(function (link) {
        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {
            return;
        }

        let linkPage = href.split("/").pop().split("?")[0];

        if (!linkPage) linkPage = "index.html";

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
};


/* =========================================================
   04. FLOATING WHATSAPP BUTTON
========================================================= */

AMCables.initWhatsAppButton = function () {
    if (
        AMCables.get(".whatsapp-float") ||
        AMCables.get(".floating-whatsapp")
    ) {
        return;
    }

    const button = document.createElement("a");

    button.href = AMCables.whatsappURL();
    button.className = "whatsapp-float";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute(
        "aria-label",
        "Contact A.M. Cables on WhatsApp"
    );

    button.innerHTML =
        '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';

    document.body.appendChild(button);
};


/* =========================================================
   05. BACK TO TOP
========================================================= */

AMCables.initBackToTop = function () {
    let button =
        AMCables.get(".back-to-top") ||
        AMCables.get("#backToTop");

    if (!button) {
        button = document.createElement("button");
        button.type = "button";
        button.className = "back-to-top";
        button.setAttribute("aria-label", "Back to top");

        button.innerHTML =
            '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';

        document.body.appendChild(button);
    }

    function updateVisibility() {
        const visible = window.scrollY > 300;

        button.classList.toggle("show", visible);
        button.classList.toggle("visible", visible);
    }

    window.addEventListener("scroll", updateVisibility, {
        passive: true
    });

    button.addEventListener("click", function () {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth"
        });
    });

    updateVisibility();
};


/* =========================================================
   06. PRODUCT SEARCH AND MATERIAL FILTER
========================================================= */

AMCables.initProductFilters = function () {
    const cards = AMCables.getAll(
        AMCables.selectors.productCard
    );

    if (!cards.length) return;

    const search = AMCables.get("#productSearch");
    const filter = AMCables.get("#materialFilter");
    const clear = AMCables.get("#clearProductSearch");
    const status = AMCables.get("#productSearchStatus");

    function applyFilters() {
        const term = AMCables.normalise(search?.value);
        const material = AMCables.normalise(
            filter?.value || "all"
        );

        let visibleCount = 0;

        cards.forEach(function (card) {
            const heading =
                AMCables.get("h3", card)?.textContent || "";

            const paragraph =
                AMCables.get("p", card)?.textContent || "";

            const searchableText = AMCables.normalise([
                heading,
                paragraph,
                card.dataset.product,
                card.dataset.productName,
                card.dataset.description,
                card.dataset.material
            ].filter(Boolean).join(" "));

            const cardMaterial = AMCables.normalise(
                card.dataset.material || "other"
            );

            const matchesTerm = searchableText.includes(term);

            const matchesMaterial =
                material === "all" ||
                material === cardMaterial;

            const visible = matchesTerm && matchesMaterial;

            card.hidden = !visible;

            if (visible) visibleCount++;
        });

        if (clear) {
            clear.hidden = term.length === 0;
            clear.classList.toggle("visible", term.length > 0);
        }

        if (status) {
            if (visibleCount === 0) {
                status.textContent =
                    "No matching products found. Try another search or filter.";
            } else if (!term && material === "all") {
                status.textContent =
                    "Explore our complete cable range.";
            } else {
                status.textContent =
                    visibleCount +
                    (visibleCount === 1
                        ? " product found."
                        : " products found.");
            }
        }
    }

    search?.addEventListener("input", applyFilters);
    filter?.addEventListener("change", applyFilters);

    clear?.addEventListener("click", function () {
        if (search) {
            search.value = "";
            search.focus();
        }

        if (filter) filter.value = "all";

        applyFilters();
    });

    applyFilters();
};


/* =========================================================
   07. PRODUCT DETAILS MODAL
========================================================= */

AMCables.openProductModal = function (button) {
    const card = button.closest(".product-card");
    const modal = AMCables.get("#productModal");

    if (!modal) return;

    const imageElement =
        AMCables.get(".product-image img", card || document) ||
        AMCables.get("img", card || document);

    const modalImage = AMCables.get("#modalProductImage");
    const title = AMCables.get("#modalProductTitle");
    const description = AMCables.get("#modalProductDescription");

    const productName =
        button.dataset.productName ||
        button.dataset.product ||
        card?.dataset.productName ||
        card?.dataset.product ||
        AMCables.get("h3", card || document)?.textContent.trim() ||
        "Cable Product";

    const productDescription =
        button.dataset.productDescription ||
        button.dataset.description ||
        card?.dataset.productDescription ||
        card?.dataset.description ||
        AMCables.get("p", card || document)?.textContent.trim() ||
        "Contact A.M. Cables for product information.";

    const imagePath =
        button.dataset.productImage ||
        card?.dataset.productImage ||
        imageElement?.currentSrc ||
        imageElement?.src ||
        "";

    if (title) title.textContent = productName;

    if (description) {
        description.textContent = productDescription;
    }

    if (modalImage && imagePath) {
        modalImage.src = imagePath;
        modalImage.alt = productName;
    }

    /* Keep inquiry buttons linked to the selected product. */
    const orderLink = AMCables.get("#modalOrderLink", modal);
    const whatsappLink = AMCables.get("#modalWhatsAppLink", modal);

    if (orderLink) {
        orderLink.href =
            "order.html?product=" + encodeURIComponent(productName);
    }

    if (whatsappLink) {
        whatsappLink.href = AMCables.whatsappURL(
            "Assalam-o-Alaikum A.M. Cables, I would like to inquire about " +
            productName +
            ". Please share the available specifications and quotation."
        );

        whatsappLink.target = "_blank";
        whatsappLink.rel = "noopener noreferrer";
    }

    modal.classList.add("active", "open", "is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const closeButton = AMCables.get(
        ".modal-close, [data-modal-close]",
        modal
    );

    closeButton?.focus();
};

AMCables.closeProductModal = function () {
    const modal = AMCables.get("#productModal");

    if (!modal) return;

    modal.classList.remove("active", "open", "is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
};

AMCables.initProductModal = function () {
    document.addEventListener("click", function (event) {
        const openButton = event.target.closest(
            "[data-product-details], .view-details"
        );

        if (openButton) {
            event.preventDefault();
            AMCables.openProductModal(openButton);
            return;
        }

        const closeButton = event.target.closest(
            "[data-modal-close], .modal-close"
        );

        if (closeButton) {
            event.preventDefault();
            AMCables.closeProductModal();
            return;
        }

        const modal = AMCables.get("#productModal");

        if (
            modal &&
            event.target === modal
        ) {
            AMCables.closeProductModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            AMCables.closeProductModal();
        }
    });
};

window.showProductDetails = function (button) {
    AMCables.openProductModal(button);
};

window.closeProductDetails = function () {
    AMCables.closeProductModal();
};

window.inquireProductFromModal = function () {
    const title = AMCables.get("#modalProductTitle");

    const productName =
        title?.textContent.trim() || "Cable Product";

    AMCables.openWhatsApp(
        "Assalam-o-Alaikum A.M. Cables, I would like to inquire about " +
        productName +
        ". Please share the available specifications and quotation."
    );
};


/* =========================================================
   08. PRODUCT COMPARISON — CHECKBOX SUPPORT
========================================================= */

AMCables.initProductComparison = function () {
    const checkboxes = AMCables.getAll(
        "[data-compare-product]"
    );

    const result = AMCables.get("#comparisonResult");

    if (!checkboxes.length || !result) return;

    const cards = AMCables.getAll(
        ".products-grid .product-card"
    );

    function getProductFromCheckbox(checkbox) {
        const card = checkbox.closest(".product-card");

        const name =
            checkbox.dataset.productName ||
            checkbox.dataset.product ||
            card?.dataset.productName ||
            card?.dataset.product ||
            AMCables.get("h3", card || document)?.textContent.trim() ||
            checkbox.value ||
            "Cable Product";

        const description =
            checkbox.dataset.productDescription ||
            checkbox.dataset.description ||
            card?.dataset.productDescription ||
            card?.dataset.description ||
            AMCables.get("p", card || document)?.textContent.trim() ||
            "Contact us for specifications.";

        const material =
            card?.dataset.material ||
            checkbox.dataset.material ||
            "Not specified";

        return { name, description, material };
    }

    function renderComparison() {
        const selected = checkboxes
            .filter(function (checkbox) {
                return checkbox.checked;
            })
            .map(getProductFromCheckbox);

        const uniqueProducts = Array.from(
            new Map(
                selected.map(function (product) {
                    return [product.name, product];
                })
            ).values()
        );

        result.replaceChildren();

        if (uniqueProducts.length === 0) {
            result.textContent =
                "Select products above to compare their available information.";
            return;
        }

        if (uniqueProducts.length === 1) {
            result.textContent =
                "Select at least one more product to compare.";
            return;
        }

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const firstHeader = document.createElement("th");

        firstHeader.textContent = "Product details";
        headerRow.appendChild(firstHeader);

        uniqueProducts.forEach(function (product) {
            const th = document.createElement("th");
            th.textContent = product.name;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        const rows = [
            {
                label: "Material category",
                key: "material"
            },
            {
                label: "Description",
                key: "description"
            }
        ];

        rows.forEach(function (row) {
            const tr = document.createElement("tr");
            const th = document.createElement("th");

            th.scope = "row";
            th.textContent = row.label;
            tr.appendChild(th);

            uniqueProducts.forEach(function (product) {
                const td = document.createElement("td");
                td.textContent = product[row.key] || "Not specified";
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        result.appendChild(table);
    }

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", renderComparison);
    });

    renderComparison();
};


/* =========================================================
   09. ORDER FORM PREFILL
========================================================= */

AMCables.initOrderPrefill = function () {
    const params = new URLSearchParams(window.location.search);

    const product = params.get("product");
    const application = params.get("application");

    const productField = AMCables.get(
        "#product, #productName, [name='product']"
    );

    const applicationField = AMCables.get(
        "#application, #applicationType, [name='application']"
    );

    function setField(field, value) {
        if (!field || !value) return;

        const target = AMCables.normalise(value);

        if (field.tagName === "SELECT") {
            const matchingOption = Array.from(field.options).find(
                function (option) {
                    return (
                        AMCables.normalise(option.value) === target ||
                        AMCables.normalise(option.textContent) === target
                    );
                }
            );

            if (matchingOption) {
                field.value = matchingOption.value;
                field.dispatchEvent(
                    new Event("change", { bubbles: true })
                );
            }
        } else {
            field.value = value;
            field.dispatchEvent(
                new Event("input", { bubbles: true })
            );
        }
    }

    setField(productField, product);
    setField(applicationField, application);
};


/* =========================================================
   10. WHATSAPP INQUIRY LINKS
========================================================= */

AMCables.initInquiryLinks = function () {
    AMCables.getAll("[data-whatsapp-inquiry]").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const card = button.closest(".product-card");

            const productName =
                button.dataset.productName ||
                button.dataset.product ||
                card?.dataset.productName ||
                card?.dataset.product ||
                AMCables.get("h3", card || document)?.textContent.trim() ||
                "Cable Products";

            AMCables.openWhatsApp(
                "Assalam-o-Alaikum A.M. Cables, I would like to inquire about " +
                productName +
                ". Please share the available specifications and quotation."
            );
        });
    });
};


/* =========================================================
   11. CONTACT AND ORDER FORMS
========================================================= */

AMCables.initForms = function () {
    AMCables.getAll("form[data-whatsapp-form]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!form.reportValidity()) return;

            const formData = new FormData(form);
            const lines = [
                "Assalam-o-Alaikum A.M. Cables.",
                "I would like to make an inquiry:"
            ];

            formData.forEach(function (value, key) {
                const field = form.elements.namedItem(key);

                let label = key;

                if (field && field.labels && field.labels.length) {
                    label = field.labels[0].textContent.trim();
                } else if (field && field.id) {
                    const matchingLabel = AMCables.get(
                        'label[for="' + CSS.escape(field.id) + '"]',
                        form
                    );

                    if (matchingLabel) {
                        label = matchingLabel.textContent.trim();
                    }
                }

                const cleanValue = String(value).trim();

                if (cleanValue) {
                    lines.push(label + ": " + cleanValue);
                }
            });

            AMCables.openWhatsApp(lines.join("\n"));
        });
    });
};


/* =========================================================
   12. OPTIONAL STAT COUNTERS
   Only animate counters with an explicit data-target value.
========================================================= */

AMCables.initStats = function () {
    const section = AMCables.get("#business-stats");

    if (!section) return;

    const counters = AMCables.getAll(
        ".stat-number[data-target]",
        section
    );

    if (!counters.length) return;

    function animateCounter(counter) {
        if (counter.dataset.animated === "true") return;

        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target) || target < 0) return;

        counter.dataset.animated = "true";

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) {
            counter.textContent = String(target);
            return;
        }

        const duration = 1400;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            counter.textContent = String(
                Math.floor(target * eased)
            );

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = String(target);
            }
        }

        requestAnimationFrame(update);
    }

    if (!("IntersectionObserver" in window)) {
        counters.forEach(animateCounter);
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                counters.forEach(animateCounter);
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.25 });

    observer.observe(section);
};


/* =========================================================
   13. SCROLL REVEAL ANIMATIONS
========================================================= */

AMCables.initScrollReveal = function () {
    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    const targets = AMCables.getAll([
        ".section-heading",
        ".feature-card",
        ".benefit-card",
        ".value-card",
        ".application-card",
        ".product-card",
        ".contact-card",
        ".faq-item",
        ".quality-point",
        ".stat-card",
        ".stat-item",
        ".ceo-section",
        ".about-visual",
        ".about-content",
        ".contact-form-wrapper",
        ".order-form-wrapper"
    ].join(","));

    if (!targets.length) return;

    targets.forEach(function (element) {
        element.classList.add("reveal-on-scroll");
    });

    /* Enable hidden initial states only when the observer is ready. */
    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    targets.forEach(function (element) {
        observer.observe(element);
    });
};


/* =========================================================
   14. INITIALISE WEBSITE
========================================================= */

AMCables.init = function () {
    AMCables.initNavigation();
    AMCables.initCopyrightYear();
    AMCables.initActiveNavigation();
    AMCables.initWhatsAppButton();
    AMCables.initBackToTop();

    AMCables.initProductFilters();
    AMCables.initProductModal();
    AMCables.initProductComparison();
    AMCables.initOrderPrefill();
    AMCables.initInquiryLinks();
    AMCables.initForms();
    AMCables.initStats();
    AMCables.initScrollReveal();
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", AMCables.init);
} else {
    AMCables.init();
}

window.AMCables = AMCables;