const editor = document.querySelector("#editor");
const editorGallery = document.querySelector("#editor-gallery");
const galleryView = document.querySelector("#editor-gallery-view");
const addWorkForm = document.querySelector("#add-work-form");
const backButton = document.querySelector("#editor-back");
const editorMessage = document.querySelector("#editor-message");

function showEditorView(isAdding) {
    galleryView.hidden = isAdding;
    addWorkForm.hidden = !isAdding;
    backButton.hidden = !isAdding;
    document.querySelector("#editor-title").textContent = isAdding ? "Ajout photo" : "Galerie photo";
    editorMessage.hidden = true;
}

function renderEditorWorks() {
    editorGallery.replaceChildren();
    for (const work of works) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "delete-work";
        remove.textContent = "";
        remove.setAttribute("aria-label", `Supprimer ${work.title}`);
        remove.addEventListener("click", () => deleteWork(work.id, remove));
        figure.append(image, remove);
        editorGallery.append(figure);
    }
}

function closeEditor() {
    editor.close();
}
document.querySelector("#edit-projects").addEventListener("click", () => {
    if (!getToken()) { logout(); return; }
    renderEditorWorks();
    showEditorView(false);
    editor.showModal();
    updateSubmitButton();
});
document.querySelector("#editor-close").addEventListener("click", closeEditor);
editor.addEventListener("click", (event) => {
    if (event.target !== editor) return;
    const bounds = editor.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeEditor();
});
document.querySelector("#add-photo").addEventListener("click", () => showEditorView(true));
backButton.addEventListener("click", () => showEditorView(false));

function reportEditorError(error) {
    if (error.status === 401) {
        sessionStorage.removeItem(tokenKey);
        editorMessage.textContent = "Votre session a expiré. Reconnectez-vous pour continuer.";
        document.querySelector("#edit-projects").hidden = true;
        document.querySelector(".edition-banner").hidden = true;
        filters.hidden = false;
        const link = document.querySelector("#session-link");
        link.textContent = "login";
        link.href = "./login.html";
        link.replaceWith(link.cloneNode(true));
        updateSubmitButton();
    } else {
        editorMessage.textContent = "Opération impossible. Vérifiez le serveur et réessayez.";
    }
    editorMessage.hidden = false;
}

async function deleteWork(id, button) {
    button.disabled = true;
    editorMessage.hidden = true;
    try {
        await apiRequest(`/works/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        works = works.filter((work) => work.id !== id);
        selectCategory(selectedCategoryId);
        renderEditorWorks();
    } catch (error) {
        reportEditorError(error);
        button.disabled = false;
    }
}

const imageInput = document.querySelector("#work-image");
const imagePreview = document.querySelector("#image-preview");
const categorySelect = document.querySelector("#work-category");
const validateButton = document.querySelector("#validate-work");
let previewUrl = null;
let submitting = false;

function renderCategoryOptions() {
    categorySelect.replaceChildren(new Option("", ""));
    for (const category of categories) {
        categorySelect.add(new Option(category.name, category.id));
    }
}
document.addEventListener("categories-loaded", renderCategoryOptions);
renderCategoryOptions();

function isValidImage(file) {
    return file && ["image/jpeg", "image/png"].includes(file.type)
        && file.size > 0 && file.size <= 4 * 1024 * 1024;
}

function updateSubmitButton() {
    validateButton.disabled = submitting || !getToken() || !isValidImage(imageInput.files[0])
        || !addWorkForm.elements.namedItem("title").value.trim() || !categorySelect.value;
}

function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    imagePreview.removeAttribute("src");
    imagePreview.hidden = true;
    for (const element of document.querySelectorAll(".upload-zone > :not(input):not(img)")) element.hidden = false;
}

imageInput.addEventListener("change", () => {
    clearPreview();
    editorMessage.hidden = true;
    const file = imageInput.files[0];
    if (file && !isValidImage(file)) {
        imageInput.value = "";
        editorMessage.textContent = "Choisissez une image JPG ou PNG de 4 Mo maximum.";
        editorMessage.hidden = false;
    } else if (file) {
        previewUrl = URL.createObjectURL(file);
        imagePreview.src = previewUrl;
        imagePreview.hidden = false;
        for (const element of document.querySelectorAll(".upload-zone > :not(input):not(img)")) element.hidden = true;
    }
    updateSubmitButton();
});
addWorkForm.addEventListener("input", updateSubmitButton);
editor.addEventListener("close", () => {
    if (!submitting) {
        addWorkForm.reset();
        clearPreview();
        updateSubmitButton();
    }
});

addWorkForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    updateSubmitButton();
    if (validateButton.disabled) {
        editorMessage.textContent = "Ajoutez une photo, un titre et une catégorie valides.";
        editorMessage.hidden = false;
        return;
    }
    submitting = true;
    updateSubmitButton();
    editorMessage.hidden = true;
    const data = new FormData(addWorkForm);
    data.set("title", addWorkForm.elements.namedItem("title").value.trim());
    try {
        const createdWork = await apiRequest("/works", {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: data,
        });
        addWorkForm.reset();
        clearPreview();
        works.push({ ...createdWork, categoryId: Number(createdWork.categoryId) });
        selectCategory(selectedCategoryId);
        renderEditorWorks();
        showEditorView(false);
        editorMessage.textContent = "Photo ajoutée avec succès.";
        editorMessage.hidden = false;
    } catch (error) {
        reportEditorError(error);
    } finally {
        submitting = false;
        updateSubmitButton();
    }
});

document.addEventListener("works-loaded", () => {
    if (editor.open) renderEditorWorks();
});
imagePreview.addEventListener("error", () => {
    clearPreview();
    imageInput.value = "";
    editorMessage.textContent = "Cette image est illisible. Choisissez un autre fichier.";
    editorMessage.hidden = false;
    updateSubmitButton();
});

// Fermer également depuis un contrôle du formulaire au clavier.
editor.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        event.preventDefault();
        closeEditor();
    }
});
