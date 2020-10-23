"use strict";
import API from "./api.js";
import { getProfile } from "./profile.js";

export function addFollow(username, className) {
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        }
    }
    api.put(`user/follow?username=${username}`, option)
        .then(() => updateFollowers(username, className));
}

export function removeFollow(username, className) {
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        }
    }
    api.put(`user/unfollow?username=${username}`, option)
        .then(() => updateFollowers(username, className));
}

export async function updateFollowers(username, className) {
    const elements = document.getElementsByClassName(className);
    const data = await getProfile(username);
    for (const el of elements) {
        el.innerText = data.followed_num;
    }
}