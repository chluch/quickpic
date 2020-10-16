"use strict";
import API from "./api.js";


export const handleLike = (likes, postId) => {
    const userId = new API;
    console.log(`likes arr: ${likes}`);
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    userId.get("user/", token)
        .then((ret) => {
            console.log(likes.includes(ret.id))
            likes.includes(ret.id) ? removeLike(postId) : addLike(postId);
        })
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
            // let likesNum = document.getElementById(`likes-num-${postId}`);
            // likesNum.innerText = parseInt(likesNum.innerText) +1;
            // likesNum.innerText = likes.len;
            // let post = document.getElementsByClassName("post")[0];
            // post.appendChild(likesNum);
            // feed.appendChild(post);
            // document.getElementById("main").appendChild(feed);
        });
}

const removeLike = (postId) => {
    console.log('removeLike')
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
            // let likesNum = document.getElementById(`likes-num-${postId}`);
            // likesNum.innerText = parseInt(likesNum.innerText) -1;
            // let post = document.getElementsByClassName("post")[0];
            // post.appendChild(likesNum);
            // feed.appendChild(post);
            // document.getElementById("main").appendChild(feed);
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
        // console.log(ret.meta.likes.length);
        let likesCount = document.getElementById(`likes-num-${postId}`);
        likesCount.innerText = ret.meta.likes.length;
    })
}