"use strict";
import API from "./api.js";
import { renderHTML, getTime } from "./helpers.js";
import { handleLike } from "./likes.js";
import { addFollow, removeFollow, updateFollowers } from "./follow.js";

export async function getProfile(username) {
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`
        },
    }
    const data = await api.get(`user/?username=${username}`, option);
    return data;
}

async function getProfileById(id) {
    const api = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${localStorage.getItem("token")}` },
    }
    const data = await api.get(`user/?id=${id}`, option);
    return data;
}

// // Mini profile on Feed
// export async function createProfileSummary(username, postId) {
//     const data = await getProfile(username);
//     const parentElement = document.getElementById(`profile-s-${postId}`);
//     const name = document.createElement("h3");
//     name.innerText = data.name;
//     parentElement.appendChild(name);
//     const obj = {
//         "posts": data.posts.length,
//         "followers": data.followed_num,
//         "following": data.following.length,
//     }
//     const follow = document.createElement("div");
//     follow.className = "profile-s-info";
//     Object.keys(obj).forEach((k) => {
//         const text = document.createElement("p");
//         const title = document.createElement("h4")
//         text.className = `${k}-s`;
//         title.innerText = `${k}: `;
//         text.innerText = obj[k];
//         follow.appendChild(title);
//         follow.appendChild(text);
//         parentElement.appendChild(follow)
//     });
//     const seeFullProfile = document.createElement("button");
//     seeFullProfile.className = "go-to-profile";
//     seeFullProfile.innerText = "Full Profile";
//     // const quickFollow = document.createElement("button");
//     // quickFollow.className = "quick-follow";
//     // quickFollow.innerText = "Follow";
//     // parentElement.appendChild(quickFollow)
//     // quickFollow.addEventListener("click", () => {
//     //     addFollow(username);
//     // });
//     seeFullProfile.addEventListener("click", () => {
//         document.getElementById("feed").style.display = "none";
//         createProfile(data);
//     })
//     parentElement.appendChild(seeFullProfile);
// }

// Main Profile
export async function createProfile(d) {
    const data = await d;
    console.log(data)
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
                <button id="follow-btn"></button>
            </div>
            <div class="follow-info">
                <div>
                    <h4 class="following">Following</h4>
                    <p>${data.following.length}</p>
                </div>
                <div>
                    <h4>Followers</h4>
                    <p class="follower-count">${data.followed_num}</p>
                </div>
            </div>
            <div class="following-list" id="following-${data.username}"></div>
            <h3>${data.name}'s Posts</h3>
        </div>
    `
    renderHTML(profileTemplate, `profile-${data.username}`, "main");
    if (data.posts.length === 0) {
        const noPost = document.createElement("div");
        noPost.innerText = "This user has no post."
        document.getElementById(`profile-${data.username}`).appendChild(noPost);
    }
    else {
        apiPostHistory(data.posts);
    }
    // Add follow function to follow button
    setFollow(data.id, data.username);
    // Populate following list
    createFollowingList(data);
    let clickFollowList = false;
    document.getElementsByClassName("following")[0].addEventListener("click", () => {
        if (clickFollowList) {
            document.getElementById(`following-${data.username}`).style.display = "none";
            clickFollowList = false;
        }
        else {
            document.getElementById(`following-${data.username}`).style.display = "block";
            clickFollowList = true;
        }
    });
}

// Get data for user's posts
// Input type: array of post IDs
async function apiPostHistory(postIds) {
    const apiPost = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${localStorage.getItem("token")}` },
    }
    postIds = postIds.sort((a, b) => b - a);
    for (const pId of postIds) {
        const post = await apiPost.get(`post/?id=${pId}`, option);
        createUserPost(post);
    }
    setLikeEvent();
}

async function createFollowingList(data) {
    const followingList = data.following;
    let list = document.createElement("ul");
    list.classname = "users-followed";
    for (const id of followingList) {
        // console.log(id)
        const data = await getProfileById(id);
        const username = data.username;
        let user = document.createElement("li");
        user.innerText = username;
        list.appendChild(user);
        user.onclick = () => {
            // remove current profile
            let profile = document.getElementsByClassName("full-profile")[0];
            while (profile.firstChild) {
                profile.removeChild(profile.lastChild);
            }
            profile.parentNode.removeChild(profile);
            // create new profile
            createProfile(data);
        }
    }
    document.getElementsByClassName("following-list")[0].appendChild(list);
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
                    <div class="add-comment">
                    <svg id="Capa_1" enable-background="new 0 0 512.193 512.193" height="512" viewBox="0 0 512.193 512.193" width="512"
                        xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path d="m403.538 177.757 76.491-76.838-100.466-100.919-76.491 76.838z" />
                                <path d="m55.736 325.291-23.572 23.678v100.852h100.533l23.505-23.611z" />
                                <path d="m185.974 396.303 188.364-189.215-100.466-100.919-188.364 189.215z" />
                            </g>
                            <g>
                                <path d="m32.164 482.193h447.85v30h-447.85z" />
                            </g>
                            <g>
                                <path d="m237.864 419.821h242.149v30h-242.149z" />
                            </g>
                    </svg>
                    Add comment
                    </div>
                    <div class="comments-number">${post.comments.length} 
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                y="0px" viewBox="0 0 60.016 60.016" style="enable-background:new 0 0 60.016 60.016;" xml:space="preserve">
                                <path d="M42.008,0h-24c-9.925,0-18,8.075-18,18v14c0,9.59,7.538,17.452,17,17.973v8.344c0,0.937,0.764,1.699,1.703,1.699
                                c0.449,0,0.874-0.178,1.195-0.499l1.876-1.876C26.708,52.714,33.259,50,40.227,50h1.781c9.925,0,18-8.075,18-18V18
                                C60.008,8.075,51.933,0,42.008,0z M17.008,29c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S19.213,29,17.008,29z M30.008,29
                                c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S32.213,29,30.008,29z M43.008,29c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4
                                S45.213,29,43.008,29z" />
                        </svg>
                    </div>
                    <div class="likes-number" id="profile-likes-${post.id}">${post.meta.likes.length}</div><div class="heart">&#x2764;</div>
                </div>
            </div>
        </div>
    </div>
    `
    renderHTML(historyTemplate, `history-${post.id}`, `profile-${post.meta.author}`);
}

async function setFollow(id, username) {
    const ownUsername = localStorage.getItem("username");
    const followButton = document.getElementById("follow-btn");
    if (ownUsername === username) {
        followButton.parentNode.removeChild(followButton);
        return;
    }
    const ownData = await getProfile(ownUsername);
    if (ownData.following.includes(id)) {
        followButton.innerText = "UNFOLLOW";
    }
    else {
        followButton.innerText = "FOLLOW";
    }
    followButton.addEventListener("click", () => {
        if (followButton.innerText === "FOLLOW") {
            addFollow(username, "follower-count");
            followButton.innerText = "UNFOLLOW";
        }
        else {
            removeFollow(username, "follower-count");
            followButton.innerText = "FOLLOW";
        }
    });
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