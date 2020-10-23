// importing named exports we use brackets
import loginPage from './login.js'
import signupPage from './signup.js'
import { clearMainContent } from './helpers.js'

const loadLoginPage = () => {
    loginPage.load();
    signupPage.load();
    loginPage.setEvents();
    signupPage.setEvents();
}

window.onload = () => {
    loadLoginPage();
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
dropdownIcon.onclick = (e) => {
    e.preventDefault();
    dropdownMenu.style.display === "none" ? dropdownMenu.style.display = "flex" : dropdownMenu.style.display = "none";
}
