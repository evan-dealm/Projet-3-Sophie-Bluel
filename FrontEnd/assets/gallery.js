const apiUrl = "http://localhost:5678/api";
const gallery = document.querySelector(".gallery");
const galleryMessage = document.querySelector("#gallery-message");

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

loadGallery();
