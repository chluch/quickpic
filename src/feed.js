"use strict";
import API from "./api.js";
import {
    getTime,
    clearMainContent,
    parseHTML,
    sortCommentsByTimestamp,
    toggle,
    sortPostsByTimestamp
} from "./helpers.js";
import { handleLike, createLikesList } from "./likes.js";
import { getProfile, getProfileById, createProfile, getPost } from "./profile.js";

export async function getFeed(token, startPage, pageNum) {
    let getMorePosts = false;
    if (!startPage) {
        startPage = 0;
    }
    if (!pageNum) {
        pageNum = 10;
    }
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${token}`
        },
    }
    let data = await api.get(`user/feed?p=${startPage}&n=${pageNum}`, option);

    // Main Feed Div
    let feed = document.getElementById("feed");
    if (!feed) {
        feed = document.createElement("div");
        feed.id = "feed";
    }

    Object.keys(data).forEach((post) => {
        // console.log(data[post])
        if (data[post].length === 0) {
            // console.log('No more posts to fetch');
            getMorePosts = false;
            // console.log("getFeed -> return FALSE");
            return getMorePosts;
        }
        sortPostsByTimestamp((data[post]));
        // console.log(data[post]);
        data[post].forEach((p) => {
            createPost(
                p.id,
                p.meta.author,
                p.meta.published,
                p.meta.likes,
                p.meta.description_text,
                p.comments,
                p.src,
                feed
            );

        })
        // console.log('More posts to fetch');
        // console.log("getFeed -> return TRUE")
        getMorePosts = true;
    });
    document.getElementById("main").appendChild(feed);
    setLikeEvent();
    return getMorePosts;
}

// Create each individual post from getFeed
const createPost = (postId, author, time, likes, description, comments, img, feed) => {
    const image = document.createElement("img");
    Object.assign(image, {
        src: `data:image/jpeg;base64, ${img}`,
        alt: `Image posted by ${author} on ${getTime(time)}`
    });

    const postTemplate = `
        <div class="wrapper">
            <div class="post" id=post-${postId}>
                <div class="post-heading">
                    <a href="#${author}-profile" class="author">${author}</a>
                    <div class="timestamp">${getTime(time)}</div>
                </div>
                <div class="post-img"></div>
                <div class="post-info">
                    <p class="post-text">${description}</p>
                    <div class="likes-display" id="likes-display-${postId}"></div>
                        <div class="action">
                            <div class="add-comment">
                            <svg id="Capa_1" enable-background="new 0 0 512.193 512.193" height="512" viewBox="0 0 512.193 512.193" width="512" xmlns="http://www.w3.org/2000/svg">
                                <path d="m403.538 177.757 76.491-76.838-100.466-100.919-76.491 76.838z" />
                                <path d="m55.736 325.291-23.572 23.678v100.852h100.533l23.505-23.611z" />
                                <path d="m185.974 396.303 188.364-189.215-100.466-100.919-188.364 189.215z" />
                                <path d="m32.164 482.193h447.85v30h-447.85z" />
                                <path d="m237.864 419.821h242.149v30h-242.149z" />
                            </svg>
                            <a href="#add-comment">Add comment...</a>
                            </div>
                            <div class="comments-number"><a title="comments" href="#show-comments-${postId}" id="comment-count-${postId}">${comments.length}</a> 
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                y="0px" viewBox="0 0 60.016 60.016" style="enable-background:new 0 0 60.016 60.016;" xml:space="preserve" title="see comments">
                                <path d="M42.008,0h-24c-9.925,0-18,8.075-18,18v14c0,9.59,7.538,17.452,17,17.973v8.344c0,0.937,0.764,1.699,1.703,1.699
                                c0.449,0,0.874-0.178,1.195-0.499l1.876-1.876C26.708,52.714,33.259,50,40.227,50h1.781c9.925,0,18-8.075,18-18V18
                                C60.008,8.075,51.933,0,42.008,0z M17.008,29c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S19.213,29,17.008,29z M30.008,29
                                c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S32.213,29,30.008,29z M43.008,29c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4
                                S45.213,29,43.008,29z" />
                                </svg>
                            </div>
                            <div class="likes-number">
                                <a title="show likes" id="likes-num-${postId}" href="#show-likes-${postId}">${likes.length}</a>
                            </div>
                            <button class="heart" role="button">&#x2764;</button>
                        </div>
                    <div class="comment-display" id="comment-display-${postId}"></div>
                </div>
            </div>
        </div>
    `;
    // Set post image
    const parser = new DOMParser();
    const newNode = parser.parseFromString(postTemplate, "text/html");
    let imgWrapper = newNode.getElementsByClassName("post-img")[0];
    imgWrapper.appendChild(image);

    const userInfo = newNode.getElementsByClassName("author")[0];
    userInfo.onclick = () => {
        clearMainContent();
        window.onscroll = null;
        createProfile(getProfile(author));
    }

    // Generate like list and Toggle
    createLikesList(likes, newNode);
    const showLikes = newNode.getElementById(`likes-display-${postId}`);
    let displayLikesToggle = newNode.getElementById(`likes-num-${postId}`);
    showLikes.style.display = "none";
    toggle(displayLikesToggle, showLikes, "block");

    // save each comment as div in array
    let commentLog = displayEachComment(comments);

    // Generate comment input box
    createCommentBox(postId, `post-${postId}`, newNode);

    // Make div for showing ALL comments for EACH post
    // let displayAllComments = newNode.getElementsByClassName("comment-display")[0];
    let showComments = newNode.getElementById(`comment-display-${postId}`);
    for (let el of commentLog) {
        showComments.appendChild(el);
    }

    // Toggle comments
    let displayAllCommentsToggle = newNode.getElementsByClassName("comments-number")[0];
    showComments.style.display = "none";
    toggle(displayAllCommentsToggle, showComments, "block");

    // Toggle comment input box
    let commentBox = newNode.getElementById(`post-comment-${postId}`);
    let addCommentToggle = newNode.getElementsByClassName("add-comment")[0];
    commentBox.style.display = "none";
    toggle(addCommentToggle, commentBox, "block");

    newNode.getElementsByClassName("submit-comment")[0].onclick = (e) => {
        e.preventDefault();
        let commentedPost = document.getElementById(`comment-display-${postId}`);
        let commentCount = document.getElementById(`comment-count-${postId}`);
        postComment(postId, document.getElementById(`post-${postId}`), commentedPost, commentCount);
    }

    // Prevent enter in comment input box
    newNode.getElementsByClassName("comment-text")[0].onkeydown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    let wrapper = newNode.getElementsByClassName("wrapper")[0];
    feed.appendChild(wrapper);
}

const setLikeEvent = () => {
    let hearts = document.querySelectorAll(".heart"); // array
    for (let heart of hearts) {
        // heart.onclick = null;
        let postId = heart.closest(".post").id.replace(/\D+/, "");
        heart.onclick = () => {
            handleLike(postId, `likes-num-${postId}`);
        }
    }
}

export const displayEachComment = (commentArray) => {
    let commentLog = [];
    sortCommentsByTimestamp(commentArray);
    (commentArray).forEach((comment) => {
        const wrapper = document.createElement("div");
        wrapper.className = "comment-wrapper";

        const commenter = document.createElement("a");
        commenter.href = `${comment.author}-profile`;
        commenter.className = "commenter";
        commenter.innerText = `${comment.author}: `

        const commentContent = document.createElement("p");
        commentContent.className = "comment";
        commentContent.innerText = comment.comment;

        const commentTime = document.createElement("div");
        commentTime.className = "comment-time";
        commentTime.innerText = getTime(comment.published);

        commenter.onclick = (e) => {
            e.preventDefault();
            clearMainContent();
            window.onscroll = null;
            createProfile(getProfile(comment.author));
        }
        let temp = [commentTime, commenter, commentContent];
        temp.forEach((el) => {
            wrapper.appendChild(el);
            commentLog.push(wrapper);
        });
    });
    return commentLog;
}

const createCommentBox = (postId, parentElementId, parent) => {
    const commentBoxTemplate = `
    <div class="post-comment" id="post-comment-${postId}">
        <textarea class="comment-text" placeholder="Say something" maxlength="200"></textarea>
        <button type="submit" class="submit-comment" style="display: block;">comment</button>
    </div>
    `;
    parseHTML(commentBoxTemplate, `post-comment-${postId}`, parentElementId, parent);
}

export const postComment = (postId, post, commentedPostEl, commentCountEl) => {
    let commentContent = post.querySelector("textarea").value;
    if (!commentContent) {
        alert("You didn't comment!");
        return;
    }
    const toSend = { "comment": commentContent, }
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(toSend),
    }
    api.put(`post/comment?id=${postId}`, option)
        .then((/*ret*/) => {
            window.onscroll = null;
            // alert(ret.message);
            updateComment(postId, commentedPostEl, commentCountEl);
        })
        .then(post.querySelector("textarea").value = "");
}

const updateComment = async (postId, commentedPostEl, commentCountEl) => {
    const data = await getPost(postId);
    while (commentedPostEl.firstChild) { // Clear comments first before reload
        commentedPostEl.removeChild(commentedPostEl.lastChild);
    }
    let commentLog = displayEachComment(data.comments);
    for (let el of commentLog) {
        commentedPostEl.appendChild(el);
    }
    commentCountEl.innerText = data.comments.length;
    commentedPostEl.style.display = "block";
}
