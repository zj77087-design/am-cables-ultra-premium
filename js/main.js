/* =========================================================
   A.M. CABLES — MAIN JAVASCRIPT
   File: js/main.js
   ========================================================= */


/* =========================
   01. MOBILE NAVIGATION
   ========================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navMenu.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        });
    });

    document.addEventListener("click", function (event) {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            navMenu.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 800) {
            navMenu.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        }
    });
}


/* =========================
   02. AUTOMATIC COPYRIGHT YEAR
   ========================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================
   03. ACTIVE NAVIGATION LINK
   ========================= */

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-menu a").forEach(function (link) {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        document.querySelectorAll(".nav-menu a").forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
    }
});
/* A.M. CABLES — FLOATING WHATSAPP BUTTON */

document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(".whatsapp-float")) return;

    const whatsappButton = document.createElement("a");

    whatsappButton.href =
        "https://wa.me/923054335465?text=" +
        encodeURIComponent(
            "Assalam-o-Alaikum A.M. Cables, I would like to inquire about your cable products."
        );

    whatsappButton.className = "whatsapp-float";
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
    whatsappButton.setAttribute("aria-label", "Contact A.M. Cables on WhatsApp");
    whatsappButton.innerHTML =
        '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';

    document.body.appendChild(whatsappButton);
});

/* A.M. CABLES — BACK TO TOP FUNCTIONALITY */

document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(".back-to-top")) return;

    const backToTop = document.createElement("button");

    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.title = "Back to Top";
    backToTop.innerHTML =
        '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';

    document.body.appendChild(backToTop);

    function updateBackToTop() {
        backToTop.classList.toggle("show", window.scrollY > 300);
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    updateBackToTop();
});
/* =========================================
   A.M. CABLES — COMBINED PRODUCT FILTER
   Live Search + Material Filter
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("productSearch");
    const clearButton = document.getElementById("clearProductSearch");
    const materialFilter = document.getElementById("materialFilter");
    const statusText = document.getElementById("productSearchStatus");

    const productCards = document.querySelectorAll(
        ".products-grid .product-card"
    );

    // Products page par hi filtering chalegi
    if (productCards.length === 0) {
        return;
    }

    function applyProductFilters() {
        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedMaterial = materialFilter
            ? materialFilter.value.toLowerCase()
            : "all";

        let visibleCount = 0;

        productCards.forEach(function (card) {
            const name =
                card.querySelector("h3")?.textContent.toLowerCase() || "";

            const description =
                card.querySelector("p")?.textContent.toLowerCase() || "";

            const label =
                card.querySelector(".section-label")
                    ?.textContent.toLowerCase() || "";

            const searchableText =
                name + " " + description + " " + label;

            const matchesSearch =
                searchableText.includes(searchTerm);

            const cardMaterial =
                (card.dataset.material || "other").toLowerCase();

            const matchesMaterial =
                selectedMaterial === "all" ||
                cardMaterial === selectedMaterial;

            const shouldShow =
                matchesSearch && matchesMaterial;

            card.style.display = shouldShow ? "" : "none";

            if (shouldShow) {
                visibleCount++;
            }
        });

        // Clear button
        if (clearButton) {
            clearButton.classList.toggle(
                "visible",
                searchTerm.length > 0
            );
        }

        // Search results status
        if (statusText) {
            if (visibleCount === 0) {
                statusText.textContent =
                    searchTerm || selectedMaterial !== "all"
                        ? "No matching products found. Try different filters."
                        : "No products available.";
            } else if (
                searchTerm.length === 0 &&
                selectedMaterial === "all"
            ) {
                statusText.textContent =
                    "Explore our complete cable range.";
            } else {
                statusText.textContent =
                    visibleCount +
                    (visibleCount === 1
                        ? " product found."
                        : " products found.");
            }
        }
    }

    // Search as the user types
    if (searchInput) {
        searchInput.addEventListener(
            "input",
            applyProductFilters
        );
    }

    // Filter when material changes
    if (materialFilter) {
        materialFilter.addEventListener(
            "change",
            applyProductFilters
        );
    }

    // Clear search, but preserve the selected material
    if (clearButton) {
        clearButton.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }

            applyProductFilters();
        });
    }

    // Initial state
    applyProductFilters();
});
/* =====================================
   A.M. CABLES — STATS COUNTER ANIMATION
===================================== */

document.addEventListener("DOMContentLoaded", function () {
    const statsSection = document.querySelector("#business-stats");

    if (!statsSection) return;

    const counters = statsSection.querySelectorAll(".stat-number");

    if (!counters.length) return;

    function animateCounter(counter) {
        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target) || target < 0) return;

        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * easedProgress);

            counter.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    counters.forEach(animateCounter);
                    observer.unobserve(statsSection);
                }
            });
        }, { threshold: 0.35 });

        observer.observe(statsSection);
    } else {
        counters.forEach(animateCounter);
    }
});
/* =========================================
   A.M. CABLES — PRODUCT MODAL
========================================= */

window.showProductDetails = function (button) {
    const card = button.closest(".product-card");
    const modal = document.getElementById("productModal");

    if (!card || !modal) return;

    const image = card.querySelector(".product-image img");
    const title = document.getElementById("modalProductTitle");
    const description = document.getElementById("modalProductDescription");
    const modalImage = document.getElementById("modalProductImage");

    const productName =
        button.dataset.product ||
        card.querySelector("h3")?.textContent.trim() ||
        "Cable Product";

    if (title) title.textContent = productName;

    if (description) {
        description.textContent =
            button.dataset.description ||
            "Contact A.M. Cables for product information.";
    }

    if (modalImage && image) {
        modalImage.src = image.getAttribute("src");
        modalImage.alt = image.alt || productName;
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
};

window.closeProductDetails = function () {
    const modal = document.getElementById("productModal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
};

window.inquireProductFromModal = function () {
    const title = document.getElementById("modalProductTitle");
    const productName = title?.textContent.trim() || "Cable Product";

    const message =
        "Assalam-o-Alaikum A.M. Cables! I want to inquire about " +
        productName + ".";

    const url =
        "https://wa.me/923054335465?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
};