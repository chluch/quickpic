// importing named exports we use brackets
import loginPage from './login.js'
import signupPage from './signup.js'
import { clearMainContent} from './helpers.js'

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
