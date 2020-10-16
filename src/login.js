"use strict";
import API from "./api.js";
import { renderHTML } from "./helpers.js";
import { getFeed } from "./feed.js";

const loginPage = {
    load: () => renderHTML(`
    <form id="login">
        <div>
            <input id="username" type="text" placeholder="&#x1F464;Username">
        </div>
        <div>
            <input id="password" type="password" placeholder="&#x1F512;Password">
        </div>
        <div class="button-wrapper">
            <button id="go-to-signup">Signup</button>
            <button type="submit" id="login-btn">Login</button>
        </div>
    </form>
    `
        , "login"),
    setEvents: () => {
        document.getElementById("go-to-signup").onclick = (e) => {
            e.preventDefault();
            document.getElementById("login").style.display="none";
            document.getElementById("signup").style.display="flex";
        }
        document.getElementById("login-btn").onclick = (e) => {
            e.preventDefault();
            doLogin();
        }
    }
}

const doLogin = () => {
    const login = new API;
    const data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
    }
    const sendLoginOptions = {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
    }
    login.post("auth/login", sendLoginOptions)
        .then((ret) => {
            if (ret.message) {
                alert(ret.message);
            }
            else {
                stickBanner();
                document.getElementById("login").style.display="none";
                // Store token in localStorage
                localStorage.setItem('token', ret.token);
                // get Feed with token
                getFeed(ret.token);
            }
        });
}

// Stick banner on top
const stickBanner = () => {
    const banner = document.getElementsByClassName("banner")[0];
    banner.style.top = 0;
    banner.style.position = "sticky";
    const wrapper = document.getElementById("page-wrapper");
    wrapper.style.height = "auto";
}

export default loginPage