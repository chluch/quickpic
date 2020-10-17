"use strict";
import API from "./api.js";

function handleFollow() {

}

export function addFollow(username) {
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        }
    }
    api.put(`user/follow?username=${username}`, option);
}

export function removeFollow(username) {
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        }
    }
    api.put(`user/unfollow?username=${username}`, option);
}

function updateFollow() {

}