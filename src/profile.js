"use strict";
import API from "./api.js";
// import { injectHTMLByClass } from "./helpers.js";

export async function getProfile(username) {
    const getUser = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${localStorage.getItem("token")}` },
    }
    const data = await getUser.get(`user/?username=${username}`, option);
    return data;
}

export async function createProfileSummary(username, postId) {
    const data = await getProfile(username);
    // console.log(data.name)
    console.log(data)
    const parentElement = document.getElementById(`profile-${postId}`);
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
    parentElement.appendChild(seeFullProfile);
    // parentElement.appendChild(quickFollow)

}