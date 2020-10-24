"use strict";
import API from "./api.js";
import {initialisePage} from  "./initialise.js"
import { clearMainContent, parseHTML, toggle } from "./helpers.js";
import { getFeed } from "./feed.js";
import { getProfile, createProfile } from "./profile.js";
import { createPostForm } from "./post.js";

const loginPage = {
    load: () => parseHTML(`
    <form id="login" class="login-form">
        <h2>Login</h2>
        <div><input id="username" type="text" placeholder="&#x1F464;Username"></div>
        <div><input id="password" type="password" placeholder="&#x1F512;Password"></div>
        <div class="button-wrapper">
            <button type="submit" id="login-btn">Login</button>
            <button id="go-to-signup">Signup</button>
        </div>
    </form>
    `
        , "login", "main"),
    setEvents: () => {
        document.getElementById("go-to-signup").onclick = (e) => {
            e.preventDefault();
            document.getElementById("login").style.display = "none";
            document.getElementById("signup").style.display = "flex";
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
                // Store token in localStorage
                localStorage.setItem("token", ret.token);
                localStorage.setItem("username", document.getElementById("username").value);
                initialisePage(ret.token);
        });
}

export default loginPage;
