"use strict";
import API from "./api.js";

export async function handleLike(postId) {
    const getUser = new API;
    const getPost = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${localStorage.getItem("token")}` },
    }
    const userData = await getUser.get("user/", option);
    const postData = await getPost.get(`post/?id=${postId}`, option);
    const isLiked = postData.meta.likes.includes(userData.id);
    isLiked ? removeLike(postId) : addLike(postId);
}

const addLike = (postId) => {
    const like = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    like.put(`post/like?id=${postId}`, token)
        .then(() => {
            updateLike(postId);
            const heartIcon = document.getElementById(`likes-num-${postId}`).nextSibling;
            // heartIcon.style.color = "red";
        });
}

const removeLike = (postId) => {
    const unlike = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    unlike.put(`post/unlike?id=${postId}`, token)
        .then(() => {
            updateLike(postId);
            const heartIcon = document.getElementById(`likes-num-${postId}`).nextSibling;
            // heartIcon.style.color = "black";
        });
}

const updateLike = (postId) => {
    const setLike = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    setLike.get(`post/?id=${postId}`, token)
    .then((ret) => {
        let likesCount = document.getElementById(`likes-num-${postId}`);
        likesCount.innerText = ret.meta.likes.length;
    })
}