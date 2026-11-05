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
        remove.textContent = "▤";
        remove.setAttribute("aria-label", `Supprimer ${work.title}`);
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
});
document.querySelector("#editor-close").addEventListener("click", closeEditor);
editor.addEventListener("click", (event) => {
    if (event.target !== editor) return;
    const bounds = editor.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeEditor();
});
document.querySelector("#add-photo").addEventListener("click", () => showEditorView(true));
backButton.addEventListener("click", () => showEditorView(false));
