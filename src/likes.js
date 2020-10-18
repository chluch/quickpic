"use strict";
import API from "./api.js";

export async function handleLike(postId, elementId) {
    console.log(`This is post number: ${elementId}`)
    const getUser = new API;
    const getPost = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`
        },
    }
    const userData = await getUser.get("user/", option);
    const postData = await getPost.get(`post/?id=${postId}`, option);
    const isLiked = postData.meta.likes.includes(userData.id);
    isLiked ? removeLike(postId, elementId) : addLike(postId, elementId);
}

const addLike = (postId, elementId) => {
    const like = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    like.put(`post/like?id=${postId}`, token)
        .then(() => {
            console.log('addlike')
            updateLike(postId, elementId);
        });
}

const removeLike = (postId, elementId) => {
    const unlike = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    unlike.put(`post/unlike?id=${postId}`, token)
        .then(() => {
            console.log('remove like')
            updateLike(postId, elementId);
        });
}

const updateLike = (postId, elementId) => {
    console.log('updating')
    const setLike = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    setLike.get(`post/?id=${postId}`, token)
        .then((ret) => {
            let likesCount = document.getElementById(elementId);
            likesCount.innerText = ret.meta.likes.length;
        })
}