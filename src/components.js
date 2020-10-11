import { createElement, createPostTile, uploadImage, appendAll } from './helpers.js';

const loginPage = () => {
    const main = document.getElementById("main");
    const loginForm = createElement("form", "", "");
    const usernameField = createElement("input", "",  { "type": "text", "placeholder": "username" });
    const passwordField = createElement("input", "", { "type": "password", "placeholder": "password" });
    const submitButton = createElement("button", "Submit", { "type": "submit" });
    appendAll([usernameField, passwordField, submitButton], loginForm);
    main.appendChild(loginForm);
}
loginPage();