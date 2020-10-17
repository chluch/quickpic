"use strict";
import API from "./api.js";
import { renderHTML, getTime } from "./helpers.js";
import { handleLike } from "./likes.js";

export async function getProfile(username) {
    const getUser = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${localStorage.getItem("token")}` },
    }
    const data = await getUser.get(`user/?username=${username}`, option);
    return data;
}

// mini profile on Feed
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
        document.getElementById("feed").style.display = "none";
        createProfile(data);
    })
    parentElement.appendChild(seeFullProfile);
}

// Main Profile
const createProfile = (data) => {
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
        </div>
    `
    renderHTML(profileTemplate, `profile-${data.username}`, "main");
    if (data.posts.length === 0) {
        const noPost = document.createElement("div");
        noPost.innerText = "This user has no post."
        document.getElementById(`profile-${data.username}`).appendChild(noPost);
    }
    else {
        getUserPostHistory(data.posts);
    }
}

// Get data for user's posts
// Input type: array of post IDs
async function getUserPostHistory(postIds) {
    const getUserPost = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${localStorage.getItem("token")}` },
    }
    postIds = postIds.sort((a, b) => b - a);
    for (const pId of postIds) {
        const post = await getUserPost.get(`post/?id=${pId}`, option);
        createUserPost(post);
    }
    setLikeEvent();
}

const createUserPost = (post) => {
    let historyTemplate = `
    <div class="user-history" id="history-${post.id}">
        <div class="history-content">
            <img alt="Image by ${post.meta.author}" src="data:image/jpeg;base64, ${post.src}" class="history-img" />
            <div class="text-content">
                <div class="timestamp">${getTime(post.meta.published)}</div>
                <p>${post.meta.description_text}</p>
                <div class="stats">
                    <div class="comments-number">${post.comments.length} comments</div>
                    <div class="likes-number" id="profile-likes-${post.id}">${post.meta.likes.length}</div><div class="heart">&#x2764;</div>
                </div>
            </div>
        </div>
    </div>
    `
    renderHTML(historyTemplate, `history-${post.id}`, `profile-${post.meta.author}`);
}

const setLikeEvent = () => {
    let profile = document.getElementsByClassName("full-profile")[0];
    let hearts = profile.querySelectorAll(".heart");
    hearts.forEach(heart => {
        let postId = heart.closest(".user-history").id.replace(/\D+/, "");
        heart.addEventListener("click", () => {
            handleLike(postId, `profile-likes-${postId}`); 
        });
    });
}