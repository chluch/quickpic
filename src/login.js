"use strict";
import API from "./api.js";
import { clearMainContent, renderHTML } from "./helpers.js";
import { getFeed } from "./feed.js";
import { getProfile, createProfile } from "./profile.js";
import { createPostForm } from "./post.js";

const loginPage = {
    load: () => renderHTML(`
    <form id="login" class="login-form">
        <h2>Login</h2>
        <div><input id="username" type="text" placeholder="&#x1F464;Username"></div>
        <div><input id="password" type="password" placeholder="&#x1F512;Password"></div>
        <div class="button-wrapper">
            <button id="go-to-signup">Signup</button>
            <button type="submit" id="login-btn">Login</button>
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

const title = document.getElementById("quickpic")
const feedLink = document.getElementById("feed-link");
const search = document.getElementById("search");
// const searchBox = document.getElementById("search-box");
// const searchButton = document.getElementById("search-btn");

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
                // Store token in localStorage
                localStorage.setItem("token", ret.token);
                localStorage.setItem("username", document.getElementById("username").value);
                // get Feed with token
                stickBanner();
                document.getElementById("nav").style.display = "block";
                const loginPage = document.getElementById("login");
                const signupPage = document.getElementById("signup");
                loginPage.parentNode.removeChild(loginPage);
                signupPage.parentNode.removeChild(signupPage);
                setPostLink();
                setProfileLink();
                setFeedLink(title);
                setFeedLink(feedLink);
                search.style.display="flex";
                // searchBox.style.display = "block";
                // searchButton.style.display = "block";
                getFeed(ret.token, 0, 10);
                setInfiniteScroll(10);
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

const setPostLink = () => {
    document.getElementById("post-link").onclick = (e) => {
        e.preventDefault();
        clearMainContent();
        window.onscroll = null;
        createPostForm();
    }
}

const setProfileLink = () => {
    document.getElementById("profile-link").onclick = (e) => {
        e.preventDefault();
        clearMainContent();
        window.onscroll = null;
        const ownData = getProfile(localStorage.getItem("username"));
        createProfile(ownData);
    }
}

const setFeedLink = (el) => {
    el.onmouseover = () => {
        el.style.color = "#3ca4ff";
        el.style.cursor = "pointer";
    }
    el.onmouseout = () => {
        el.style.color = "inherit";
        el.style.cursor = "inherit";
    }
    el.onclick = (e) => {
        e.preventDefault();
        clearMainContent();
        window.onscroll = null;
        getFeed(localStorage.getItem("token"), 0, 10);
        setInfiniteScroll(10);
    }
}

let isScrolled = false;
const setInfiniteScroll = (start) => {
    window.onscroll = () => {
        if (((window.scrollY + window.innerHeight + 50) >= document.body.scrollHeight) && !isScrolled) {
            console.log("bottom.")
            isScrolled = true;
            console.log(`SCROLL from: ${start}`);
            getFeed(localStorage.getItem("token"), start, 10)
                .then((gotMorePosts) => {
                    const loadMore = gotMorePosts;
                    if (loadMore) {
                        start += 10;
                        console.log('getting more posts');
                        console.log(`next SCROLL: ${start}`);
                    }
                    else {
                        window.onscroll = '';
                    }
                });
            setTimeout(() => { // Wait for fetch
                isScrolled = false;
            }, 3000);
        }
    }
}

export default loginPage;