// importing named exports we use brackets
import loginPage from './login.js'
import signupPage from './signup.js'
import { clearMainContent, toggle } from './helpers.js'

const loadLoginPage = () => {
    createTitle();
    loginPage.load();
    signupPage.load();
    loginPage.setEvents();
    signupPage.setEvents();
}

window.onload = () => {
    loadLoginPage();
}

const createTitle = () => {
    const title = document.createElement("h1");
    title.id = "login-quickpic";
    title.innerText = "Quickpic";
    document.getElementById("main").appendChild(title);
}

const elements = ["logout-link", "dd-logout-link"];
for (const el of elements) {
    document.getElementById(el).onclick = (e) => {
        e.preventDefault();
        doLogout();
    }
}

const doLogout = () => {
    clearMainContent();
    const banner = document.getElementsByClassName("banner")[0];
    banner.style.display = "none";
    window.onscroll = null;
    loadLoginPage();
}

const dropdownIcon = document.getElementById("dropdown-icon");
const dropdownMenu = document.getElementById("dropdown-menu");
dropdownMenu.style.display = "none";
const searchIcon = document.getElementsByClassName("dropdown-search-icon")[0];
const searchLink = document.getElementById("search-link");
const dropdownSearchBar = document.getElementsByClassName("dropdown-search-bar")[0];
dropdownSearchBar.style.display = "none";
dropdownIcon.onclick = (e) => {
    e.preventDefault();
    if (dropdownMenu.style.display === "none" || dropdownSearchBar.style.display === "flex") {
        dropdownSearchBar.style.display = "none";
        dropdownMenu.style.display = "flex";
    }
    else if (dropdownMenu.style.display === "flex") {
        dropdownMenu.style.display = "none";
    }
}
searchIcon.onclick = (e) => {
    e.preventDefault();
    if (dropdownSearchBar.style.display === "none" || dropdownMenu.style.display === "flex") {
        dropdownMenu.style.display = "none";
        dropdownSearchBar.style.display = "flex";
    }
    else if (dropdownSearchBar.style.display === "flex") {
        dropdownSearchBar.style.display = "none";
    }
}
toggle(searchLink, dropdownSearchBar, "flex");

