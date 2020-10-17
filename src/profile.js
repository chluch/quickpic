"use strict";
import API from "./api.js";
import { renderHTML } from "./helpers.js";
// import { injectHTMLByClass } from "./helpers.js";

export async function getProfile(username) {
    const getUser = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${localStorage.getItem("token")}` },
    }
    const data = await getUser.get(`user/?username=${username}`, option);
    return data;
}

function createProfile(data) {
    // const data = await getProfile(username);
    const profileTemplate = `
        <div class="full-profile" id="profile-${data.username}">
            <div class="profile-heading">
                <h2>${data.name}</h2>
                <h3>${data.username}</h3>
            </div>
            <div class="profile-action">
                <a href="mailto:${data.email}?subject=Mailed from Quickpic" target="_blank" rel="noopener noreferrer">
                    &#x1F4E7; Email
                </a>
                <button id="follow-btn">Follow</button>
            </div>
            <div class="follow-info">
                <div>
                    <h4>Following</h4>
                    <p>${data.following.length}</p>
                </div>
                <div>
                    <h4>Followers</h4>
                    <p>${data.followed_num}</p>
                </div>
            </div>
            <div class="user-posts">
                SOME POSTS
            </div>
        </div>
    `
    renderHTML(profileTemplate, `profile-${data.username}`);
}

function getUserPostHistory() {
    
}

export async function createProfileSummary(username, postId) {
    const data = await getProfile(username);
    // console.log(data)
    const parentElement = document.getElementById(`profile-s-${postId}`);
    const name = document.createElement("h3");
    name.innerText = data.name;
    parentElement.appendChild(name);
    const obj = {
        "posts:": data.posts.length,
        "followers:": data.followed_num,
        "following:": data.following.length,
    }
    const follow = document.createElement("div");
    follow.className = "profile-s-info";
    Object.keys(obj).forEach((k) => {
        const text = document.createElement("p");
        const title = document.createElement("h4")
        
        title.innerText = k;
        text.innerText = obj[k];
        follow.appendChild(title);
        follow.appendChild(text);
        parentElement.appendChild(follow)
    });
    const seeFullProfile = document.createElement("button");
    seeFullProfile.className = "go-to-profile";
    seeFullProfile.innerText = "Full Profile"
    // const quickFollow = document.createElement("button");
    // quickFollow.className = "quick-follow";
    // quickFollow.innerText = "Follow";
    // parentElement.appendChild(quickFollow)
    seeFullProfile.addEventListener("click", (e) => {
        document.getElementById("feed").style.display="none";
        createProfile(data);
    })
    parentElement.appendChild(seeFullProfile);
}