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
            likes.includes(ret.id) ? removeLike(postId) : addLike(postId);
        })
}

const addLike = (postId) => {
    console.log('like')
    const like = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    like.put(`post/like?id=${postId}`, token)
        .then(() => {
            let likesNum = document.getElementsByClassName("likes-number")[0];
            console.log("eh" + likesNum.innerText.match(/\d/));
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
            let likesNum = document.getElementsByClassName("likes-number")[0];
            console.log(likesNum.innerText.match(/\d/));
            // let post = document.getElementsByClassName("post")[0];
            // post.appendChild(likesNum);
            // feed.appendChild(post);
            // document.getElementById("main").appendChild(feed);
        });
}