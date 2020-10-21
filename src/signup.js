"use strict";
import API from "./api.js";
import { renderHTML } from "./helpers.js";

const signupPage = {
    load: () => renderHTML(`
    <form id="signup" class="signup-form">
        <div><input type="text" placeholder="Create username" id="user"></div>
        <div><input type="password" placeholder="Create password" id="pw"></div>
        <div><input type="password" placeholder="Retype password" id="check-pw"></div>
        <div><input type="text" placeholder="Email" id="email"></div>
        <div><input type="text" placeholder="Name" id="name"></div>
        <div class="button-wrapper">
            <button id="go-to-login">Back to Login</button>
            <button type="submit" id="signup-btn">Submit</button>
        </div>
    </form>
    `
        , "signup", "main"),
    setEvents: () => {
        document.getElementById("signup-btn").onclick = (e) => {
            e.preventDefault();
            doSignup();
        }
        document.getElementById("go-to-login").onclick = (e) => {
            e.preventDefault();
            document.getElementById("login").style.display="flex";
            document.getElementById("signup").style.display="none";
        }
    }
}

const doSignup = () => {
    const password = document.getElementById("pw").value;
    const retype = document.getElementById("check-pw").value;
    try {
        if (password !== retype) throw "Passwords do not match!"
    }
    catch (err) {
        alert(err);
        return;
    }
    const signup = new API;
    const data = {
        "username": document.getElementById("user").value,
        "password": password,
        "email": document.getElementById("email").value,
        "name": document.getElementById("name").value,
    }
    const sendSignupOptions = {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
    }
    signup.post("auth/signup", sendSignupOptions)
        .then((ret) => {
            if (ret.message) {
                alert(ret.message);
            }
            else {
                // token if authenticated
                alert('signup successful!');
                console.log(ret);
                // return ret;
            }
        });
}

export default signupPage;