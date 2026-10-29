const apiUrl = "http://localhost:5678/api";
const gallery = document.querySelector(".gallery");
const galleryMessage = document.querySelector("#gallery-message");
const filters = document.querySelector(".filters");
const filterMessage = document.querySelector("#filter-message");

let works = [];

function renderWorks(projects) {
	gallery.replaceChildren();

	for (const project of projects) {
		const figure = document.createElement("figure");
		const image = document.createElement("img");
		const caption = document.createElement("figcaption");

		image.src = project.imageUrl;
		image.alt = project.title;
		caption.textContent = project.title;
		figure.append(image, caption);
		gallery.append(figure);
	}
}

async function loadGallery() {
	try {
		const response = await fetch(`${apiUrl}/works`);
		if (!response.ok) {
			throw new Error("Unable to load projects");
		}

		works = await response.json();
		renderWorks(works);
	} catch {
		galleryMessage.textContent = "Impossible de charger les projets. Veuillez réessayer plus tard.";
		galleryMessage.hidden = false;
	}
}

function renderFilters(categories) {
	const allCategories = [{ id: 0, name: "Tous" }, ...categories];
	filters.replaceChildren();

	for (const category of allCategories) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "filter-button";
		button.textContent = category.name;
		button.dataset.categoryId = category.id;
		button.setAttribute("aria-pressed", String(category.id === 0));
		filters.append(button);
	}
}

async function loadCategories() {
	try {
		const response = await fetch(`${apiUrl}/categories`);
		if (!response.ok) {
			throw new Error("Unable to load categories");
		}

		const categories = await response.json();
		renderFilters(categories);
	} catch {
		filterMessage.textContent = "Impossible de charger les filtres. Veuillez réessayer plus tard.";
		filterMessage.hidden = false;
	}
}

loadGallery();
loadCategories();
