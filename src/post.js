"use strict";
import API from "./api.js";
import { renderHTML, fileToDataUrl } from "./helpers.js";

// const main = document.getElementById("main");
export const createPostForm = () => {
    const postTemplate = `
    <form id="post-form">
        <h1>Make a post!</h1>
        <textarea id="post-text" placeholder="Say something..."></textarea>
        <div>
            <label class="file-upload">upload file
                <input type="file" id="img-file" name="myPhoto" accept="image/jpeg, image/png, image/jpg" />
            </label>
        </div>
        <button id="clear-post">Clear</button>
        <button type="submit" id="submit-post">Submit</button>
    </form>
    `;
    renderHTML(postTemplate, "post-form", "main");
    const submitButton = document.getElementById("submit-post");
    const resetButton = document.getElementById("clear-post");
    submitButton.onclick = (e) => {
        e.preventDefault();
        let postText = document.getElementById("post-text").value
        let file = document.getElementById("img-file").files[0];
        if (!postText || !file) {
            alert("You must input text and upload an image file!");
            return;
        }
        fileToDataUrl(file)
            .then((url) => {
                let imgUrl = url.replace(/data\:(image\/jpeg|image\/png|image\/jpg)\;base64\,/, "");
                // console.log(imgUrl);
                makePost(postText, imgUrl);
            })
    }
    resetButton.onclick = (e) => {
        e.preventDefault();
        document.getElementById("post-form").reset();
    }
}

const makePost = (postText, imgUrl) => {
    const api = new API;
    const toSend = {
        "description_text": postText,
        "src": imgUrl,
    }
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(toSend),
    }
    api.post("post", option)
        .then(() => {
            alert("Posted successfully!");
        })
        .catch(err => alert(`${err} Oopsie Woopsie uwu`));

}