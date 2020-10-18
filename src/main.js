// importing named exports we use brackets
import loginPage from './login.js'
import signupPage from './signup.js'

const loadLoginPage = () => {
    loginPage.load();
    signupPage.load();
    loginPage.setEvents();
    signupPage.setEvents();
}

const clearMainContent = () => {
    const main = document.getElementById("main");
    while (main.firstChild) {
        main.removeChild(main.lastChild);
    }
}

window.onload = () => {
    loadLoginPage();
}

document.getElementById("logout-link").onclick = () => {
    clearMainContent();
    const banner = document.getElementsByClassName("banner")[0];
    banner.style.top = "auto";
    banner.style.position = "static";
    const wrapper = document.getElementById("page-wrapper");
    wrapper.style.height = "100%";
    document.getElementById("nav").style.display="none";
    loadLoginPage();
}

