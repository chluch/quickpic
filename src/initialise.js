"use strict";
import { clearMainContent, toggle } from "./helpers.js";
import { getFeed } from "./feed.js";
import { getProfile, createProfile } from "./profile.js";
import { createPostForm } from "./post.js";

export const initialisePage = (token) => {
    clearMainContent();
    setPostLink();
    setProfileLink();
    setFeedLink();
    banner.style.display = "flex";
    setDropdownIcons();
    setSearch();
    getFeed(token, 0, 10);
    setInfiniteScroll(10);
}

const banner = document.getElementsByClassName("banner")[0];

// Set up all the links in nav and dropdown
const setPostLink = () => {
    const elements = ["post-link", "dd-post-link"];
    for (const el of elements) {
        document.getElementById(el).onclick = (e) => {
            e.preventDefault();
            clearMainContent();
            window.onscroll = null;
            createPostForm();
        }
    }
}
const setProfileLink = () => {
    const elements = ["profile-link", "dd-profile-link"];
    for (const el of elements) {
        document.getElementById(el).onclick = (e) => {
            e.preventDefault();
            clearMainContent();
            window.onscroll = null;
            const ownData = getProfile(localStorage.getItem("username"));
            createProfile(ownData);
        }
    }
}
const setFeedLink = () => {
    const elements = ["quickpic", "feed-link", "dd-feed-link"];
    for (const el of elements) {
        document.getElementById(el).onclick = (e) => {
            e.preventDefault();
            clearMainContent();
            window.onscroll = null;
            getFeed(localStorage.getItem("token"), 0, 10);
            setInfiniteScroll(10);
        }
    }
}

// Set up infinite scroll for feed
let isScrolled = false;
const setInfiniteScroll = (start) => {
    window.onscroll = () => {
        if (((window.scrollY + window.innerHeight + 50) >= document.body.scrollHeight) && !isScrolled) {
            console.log("bottom.")
            isScrolled = true;
            console.log(`SCROLL from: ${start}`);
            getFeed(localStorage.getItem("token"), start, 10)
                .then((gotMorePosts) => {
                    const loadMore = gotMorePosts;
                    if (loadMore) {
                        start += 10;
                        console.log('getting more posts');
                        console.log(`next SCROLL: ${start}`);
                    }
                    else {
                        window.onscroll = '';
                    }
                });
            setTimeout(() => { // Wait for fetch
                isScrolled = false;
            }, 3000);
        }
    }
}

// Set up dropdown icons onclick behaviour
const setDropdownIcons = () => {
    const dropdownIcon = document.getElementById("dropdown-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.style.display = "none";
    const searchIcon = document.getElementsByClassName("dropdown-search-icon")[0];
    const searchLink = document.getElementById("search-link");
    const dropdownSearchBar = document.getElementsByClassName("dropdown-search-bar")[0];
    dropdownSearchBar.style.display = "none";
    dropdownIcon.onclick = (e) => {
        e.preventDefault();
        if (dropdownMenu.style.display === "none" || dropdownSearchBar.style.display === "flex") {
            dropdownSearchBar.style.display = "none";
            dropdownMenu.style.display = "flex";
        }
        else if (dropdownMenu.style.display === "flex") {
            dropdownMenu.style.display = "none";
        }
    }
    searchIcon.onclick = (e) => {
        e.preventDefault();
        if (dropdownSearchBar.style.display === "none" || dropdownMenu.style.display === "flex") {
            dropdownMenu.style.display = "none";
            dropdownSearchBar.style.display = "flex";
        }
        else if (dropdownSearchBar.style.display === "flex") {
            dropdownSearchBar.style.display = "none";
        }
    }
    toggle(searchLink, dropdownSearchBar, "flex");
}

const setSearch = () => {
    const searchButton = document.getElementById("dd-search-btn");
    searchButton.onclick = (e) => {
        e.preventDefault();
        const userToSearch = document.getElementById("dd-search-box").value;
        clearMainContent();
        window.onscroll = null;
        const user = getProfile(userToSearch);
        console.log(user)
        createProfile(user);
    }
}