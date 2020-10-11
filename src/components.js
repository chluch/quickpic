"use strict";

import { createElement, appendAllChildren, removeAllChildren, wrapItUp } from './helpers.js';
import { getJSON } from './api.js';

const main = document.getElementById("main");

const sendLogin = () => {
    const data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
    };
    // console.log(data);
    const sendLoginOptions = {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
        method: "POST",
        // mode: "cors",
    }
    getJSON("auth/login", sendLoginOptions)
        .then((ret) => {
            if (ret.message) {
                alert(ret.message);
            }
            else {
                // token if authenticated
                console.log(ret);
                return ret;
            }
        });
}

export const loginPage = () => {
    removeAllChildren(main);
    const loginForm = createElement("form", "", { "id": "login" });
    const username = createElement("input", "", { "id": "username", "type": "text", "placeholder": "Please enter your username" });
    const password = createElement("input", "", { "id": "password", "type": "password", "placeholder": "Please enter your password" });
    const submitButton = createElement("button", "Submit", { "type": "submit" });
    const createAccount = createElement("button", "Signup", "");
    appendAllChildren(wrapItUp([username, password]), loginForm);
    const buttonWrapper = createElement("div", "", { "class": "button-wrapper" });
    appendAllChildren([submitButton, createAccount], buttonWrapper);
    loginForm.appendChild(buttonWrapper);
    main.appendChild(loginForm);
    submitButton.onclick = (e) => { e.preventDefault(); getFeed(); }
    createAccount.onclick = (e) => { e.preventDefault(); signup(); }
}

const checkPW = () => {
    const password = document.getElementById("pw").value;
    const retype = document.getElementById("check-pw").value;
    try {
        if (password !== retype) throw "Passwords do not match!"
    }
    catch (err) {
        alert(err);
        return;
    }
    sendSignup();
}

const sendSignup = () => {
    const data = {
        "username": document.getElementById("user").value,
        "password": document.getElementById("pw").value,
        "email": document.getElementById("email").value,
        "name": document.getElementById("name").value,
    }
    const sendSignupOptions = {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
        method: "POST",
        mode: "cors",
    }
    getJSON("auth/signup", sendSignupOptions)
        .then((ret) => {
            if (ret.message) {
                alert(ret.message);
            }
            else {
                // token if authenticated
                alert('signup successful!');
                console.log(ret);
                return ret;
            }
        });
}

const signup = (e) => {
    removeAllChildren(main);
    const newAccForm = createElement("form", "", { "id": "create-acc" });
    const username = createElement("input", "", { "type": "text", "placeholder": "Create username", "id": "user" });
    const password = createElement("input", "", { "type": "password", "placeholder": "Create password", "id": "pw" });
    const confirmPassword = createElement("input", "", { "type": "password", "placeholder": "Retype password", "id": "check-pw" });
    const email = createElement("input", "", { "type": "text", "placeholder": "Email", "id": "email" });
    const name = createElement("input", "", { "type": "text", "placeholder": "Name", "id": "name" });
    const submitButton = createElement("button", "Submit", { "type": "submit" });
    const loginButton = createElement("button", "Back to Login", "")
    appendAllChildren(wrapItUp([username, password, confirmPassword, email, name]), newAccForm);
    const buttonWrapper = createElement("div", "", { "class": "button-wrapper" });
    appendAllChildren([submitButton, loginButton], buttonWrapper);
    newAccForm.appendChild(buttonWrapper);
    main.appendChild(newAccForm);
    submitButton.onclick = (e) => { e.preventDefault(); checkPW(); }
    loginButton.onclick = (e) => { e.preventDefault(); loginPage(); };
}

export async function getFeed() {
    const token = await sendLogin();
   
    // const options = {
    //     headers : {"content-type": "application/json"},
    //     body : JSON.stringify(token),
    //     method : "GET",
    //     mode: "cors",
    // }
    // getJSON("user/feed", options)
    // .then((ret) => {
    //     if (ret.message) {
    //         alert(ret.message);
    //     }
    //     else {
    //         console.log('feed')
    //         console.log(ret);
    //         return ret;
    //     }
    // });
}


