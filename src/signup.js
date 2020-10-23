"use strict";
import API from "./api.js";
import { renderHTML } from "./helpers.js";

const signupPage = {
    load: () => renderHTML(`
    <form class="signup-form" id="signup">
        <h2>Sign up</h2>
        <div><input type="text" placeholder="Name" id="name"></div>
        <div><input type="text" placeholder="Username" id="user"></div>
        <div><input type="text" placeholder="Email" id="email"></div>
        <div><input type="password" placeholder="Password" id="pw"></div>
        <div><input type="password" placeholder="Retype password" id="check-pw"></div>
        <div class="button-wrapper">
            <button id="go-to-login">Back</button>
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
    const username = document.getElementById("user").value;
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const emailRegex = /^[A-Za-z0-9\-\_\.]+\@[A-Za-z0-9\-\_\.]+\.[A-Za-z]+$/;
    try {
        if (password !== retype) throw "Passwords do not match!"
        if  (username > 15) throw "Please keep to a max of 15 characters for username."
        if (!emailRegex.test(email)) throw "Please check email format.";
        if (name.length > 30) throw "Please keep to a max of 30 characters for name."
    }
    catch (err) {
        alert(err);
        return;
    }
    const signup = new API;
    const data = {
        "username": username,
        "password": password,
        "email": email,
        "name": name,
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