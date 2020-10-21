"use strict";
import API from "./api.js";
import { renderHTML, getTime, clearEmptyValue } from "./helpers.js";
import { handleLike } from "./likes.js";
import { addFollow, removeFollow } from "./follow.js";

export const getProfile = async (username) => {
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

export const getProfileById = async (id) => {
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`
        },
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
    const profileTemplate = `
        <div class="full-profile" id="profile-${data.username}">
            <div class="profile-heading">
                <h2>${data.name}</h2>
                <h3>${data.username}</h3>
            </div>
            <div class="profile-action">
                <a href="mailto:${data.email}?subject=Mailed from Quickpic" target="_blank" rel="noopener noreferrer">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                    y="0px" viewBox="0 0 477.867 477.867" xml:space="preserve">
                    <path d="M460.8,68.267H17.067l221.867,182.75L463.309,68.779C462.488,68.539,461.649,68.368,460.8,68.267z" />
                    <path d="M249.702,286.31c-6.288,5.149-15.335,5.149-21.623,0L0,98.406v294.127c0,9.426,7.641,17.067,17.067,17.067H460.8
                    c9.426,0,17.067-7.641,17.067-17.067V100.932L249.702,286.31z" />
                </svg>
                Email
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

    // If no post yet, we print "This user has no post" to profile
    if (data.posts.length === 0) {
        const noPost = document.createElement("div");
        noPost.innerText = "This user has no post."
        document.getElementById(`profile-${data.username}`).appendChild(noPost);
    }
    else {
        apiPostHistory(data.posts);
    }

    // Generate edit buttons if own profile
    if (data.username === localStorage.getItem("username")) {
        const editWrapper = document.createElement("div");
        editWrapper.className = "edit-options";
        const editButtons = ["edit account", "edit post"]
        editButtons.forEach((str) => {
            let button = document.createElement("button");
            button.innerText = str;
            button.className = str.replace(/ /, "-");
            editWrapper.appendChild(button);
        });
        const main = document.getElementById("main");
        main.insertBefore(editWrapper, main.firstChild);
        const editProfile = document.getElementsByClassName("edit-account")[0];
        const editPost = document.getElementsByClassName("edit-post")[0];

        // Load account settings modal
        editProfileModal();

        editProfile.onclick = (e) => {
            e.preventDefault();
            editProfile.disabled = true;
            document.getElementById("account-settings").style.display = "block";
        }
        editPost.onclick = (e) => {
            e.preventDefault();
            const allPosts = document.getElementsByClassName("user-history");
            for (const post of allPosts) {
                console.log(post.id);
                const parent = post.getElementsByClassName("text-content")[0];
                const edit = document.createElement("button");
                edit.classname = "edit-this-post";
                edit.innerText = "edit";
                parent.insertBefore(edit, parent.firstChild);
                editPost.disabled = true;
            }
        }
    }
    else {
        document.getElementById(`profile-${data.username}`).style.margin = "20px auto";
    }

    // Add follow function to follow button
    setFollow(data.id, data.username);

    // Populate following list
    createFollowingList(data);
    let clickFollowList = false;
    // Toggle
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
    const listDisplay = document.getElementsByClassName("following-list")[0];
    if (followingList.length === 0) {
        listDisplay.innerText = "Not following anyone."
        return;
    }
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
    listDisplay.appendChild(list);
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

const editProfileModal = () => {
    const template = `
    <div class="modal" id="account-settings">
        <div class="edit-acc-modal">
            <div class="close">&#xd7;</div>
            <svg version="1.1" id="settings-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 422.912 422.912" style="enable-background:new 0 0 422.912 422.912;"
                xml:space="preserve">
                <path
                    d="M410.112,169.472l-29.696-5.12c-3.584-13.824-9.216-27.136-16.384-39.424l17.408-24.576
            c4.608-6.144,4.096-14.848-1.536-19.968l-37.888-37.888c-5.12-5.632-13.824-6.144-19.968-1.536l-24.576,17.408
            c-12.288-6.656-25.6-12.288-38.912-15.872L253.44,12.8C252.416,5.12,245.76,0,238.08,0h-53.248c-7.68,0-14.336,5.12-15.36,12.8
            l-5.12,29.696c-13.824,3.584-27.136,9.216-39.424,16.384l-24.576-17.408c-6.144-4.608-14.848-4.096-19.968,1.536L42.496,80.896
            c-5.632,5.12-6.144,13.824-1.536,19.968l17.408,24.576c-6.656,12.288-12.288,25.6-15.872,38.912l-29.696,5.12
            c-7.68,1.024-12.8,7.68-12.8,15.36v53.248c0,7.68,5.12,14.336,12.8,15.36l29.696,5.12c3.584,13.824,9.216,27.136,16.384,39.424
            L41.472,322.56c-4.608,6.144-4.096,14.848,1.536,19.968l37.888,37.888c5.12,5.632,13.824,6.144,19.968,1.536l24.576-17.408
            c12.288,6.656,25.6,12.288,38.912,15.872l5.12,29.696c1.024,7.68,7.68,12.8,15.36,12.8h53.248c7.68,0,14.336-5.12,15.36-12.8
            l5.12-29.696c13.824-3.584,27.136-9.216,39.424-16.384l24.576,17.408c6.144,4.608,14.848,4.096,19.968-1.536l37.888-37.888
            c5.632-5.12,6.144-13.824,1.536-19.968l-17.408-24.576c6.656-12.288,12.288-25.6,15.872-38.912l29.696-5.12
            c7.68-1.024,12.8-7.68,12.8-15.36v-53.248C422.912,177.152,417.792,170.496,410.112,169.472z M211.456,295.936
            c-46.592,0-84.48-37.888-84.48-84.48s37.888-84.48,84.48-84.48s84.48,37.888,84.48,84.48S258.048,295.936,211.456,295.936z" />
            </svg>
            <h1>Account Settings</h1>
            <form id="edit-acc-form">
                <div><input type="password" placeholder="Change password" id="new-password"></div>
                <div><input type="password" placeholder="Retype new password" id="check-new-password"></div>
                <div><input type="text" placeholder="Change email" id="new-email"></div>
                <div><input type="text" placeholder="Change name" id="new-name"></div>
                <button type="submit" id="submit-acc-edit">Submit</button>
            </form>
        </div>
    </div>
    `;
    renderHTML(template, "account-settings", "main");
    const editProfile = document.getElementsByClassName("edit-account")[0];
    const accModal = document.getElementById("account-settings");
    const modalCloseButton = document.getElementsByClassName("close")[0];
    const modalSubmitButton = document.getElementById("submit-acc-edit");
    modalCloseButton.onclick = (e) => {
        e.preventDefault();
        accModal.style.display = "none";
        editProfile.disabled = false;
    }
    modalSubmitButton.onclick = (e) => {
        e.preventDefault();
        handleProfileUpdate();
    }

}
const handleProfileUpdate = () => {
    const newPassword = document.getElementById("new-password").value;
    const checkPassword = document.getElementById("check-new-password").value;
    const email = document.getElementById("new-email").value;
    const name = document.getElementById("new-name").value
    const emailRegex = /^[A-Za-z0-9\-\_\.]+\@[A-Za-z0-9\-\_\.]+\.[A-Za-z]+$/;
    try {
        if (newPassword !== checkPassword) throw "Passwords do not match.";
        if (email && !emailRegex.test(email)) throw "Check email format.";
        if (name && name.length > 30) throw "Please keep to a max of 30 characters."
    }
    catch (err) {
        alert(err);
        return;
    }
    let data = {
        "email": email,
        "name": name,
        "password": newPassword,
    }
    data = clearEmptyValue(data);
}

const updateProfile = () => {
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`
        },
    }
}