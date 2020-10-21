"use strict";
import API from "./api.js";
import { clearMainContent, renderHTML } from "./helpers.js";
import { getFeed } from "./feed.js";
import { getProfile, createProfile } from "./profile.js";
import { createPostForm } from "./post.js";

// let start = 10;
const loginPage = {
    load: () => renderHTML(`
    <form id="login" class="login-form">
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
                setFeedLink();
                getFeed(ret.token, 0, 20);
                // setInfiniteScroll();
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
        createPostForm();
    }
}

const setProfileLink = () => {
    document.getElementById("profile-link").onclick = (e) => {
        e.preventDefault();
        clearMainContent();
        // window.onscroll = "";
        const ownData = getProfile(localStorage.getItem("username"));
        createProfile(ownData);
    }
}

const setFeedLink = () => {
    const title = document.getElementById("quickpic")
    title.onmouseover = () => {
        title.style.color = "#62b37c";
        title.style.cursor = "pointer"
    }
    title.onmouseout = () => {
        title.style.color = "inherit";
        title.style.cursor = "inherit";
    }
    title.onclick = (e) => {
        e.preventDefault();
        clearMainContent();
        // console.log(document.getElementById("main").childElementCount)
        // console.log("clicky!")
        // window.onscroll = "";
        getFeed(localStorage.getItem("token"), 0, 20);
        // start = 10;
        // setInfiniteScroll();
        // Main Feed Div
    }
}


// const setInfiniteScroll = () => {
//     window.onscroll = () => {
//         if ((window.scrollY + window.innerHeight + 100) >= document.body.scrollHeight) {
//             console.log(`SCROLL from: ${start}`);
//             getFeed(localStorage.getItem("token"), start, 10)
//                 .then((gotMorePosts) => {
//                     const loadMore = gotMorePosts;
//                     if (loadMore) {
//                         start += 10;
//                         console.log('getting more posts');
//                         console.log(`next SCROLL: ${start}`);
//                     }
//                     else {
//                         window.onscroll = '';
//                     }
//                 });
//         }
//     }
// }

export default loginPage;