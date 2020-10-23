// Given a js file object representing a jpg or png image, such as one taken
// from a html file input element, return a promise which resolves to the file
// data as a data url.
// More info:
// *   https://developer.mozilla.org/en-US/docs/Web/API/File
// *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
// *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
// Example Usage:
//      const file = document.querySelector('input[type="file"]').files[0];
//      console.log(fileToDataUrl(file));
// @param { File } file The file to be read.
// @return { Promise<string>} Promise which resolves to the file as a data url.

export function fileToDataUrl(file) {
    if (!file) {
        throw Error('must provide a file.')
    }
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

// Render HTML code blocks and append to main. Hayden has given the greenlight for DOMParser usage (emailed).
export function parseHTML(htmlBlock, elementID, parentID, ancestor) {
    const parser = new DOMParser();
    const newNode = parser.parseFromString(htmlBlock, "text/html");
    const element = newNode.getElementById(elementID);
    if (!ancestor) {
        document.getElementById(parentID).appendChild(element);
    }
    else {
        ancestor.getElementById(parentID).appendChild(element)
    }
}

// Convert unix time to DD/MM/YY HH:MM
export const getTime = (unixTime) => {
    const t = new Date(unixTime * 1000);
    const year = `${t.getFullYear()}`;
    const month = t.getMonth() + 1;
    const day = t.getDate();
    const hour = t.getHours();
    const min = `0${t.getMinutes()}`;
    const time = `${day}/${month}/${year.substr(-2)} ${hour}:${min.substr(-2)}`;
    return time;
}

// Clear main
export const clearMainContent = () => {
    const main = document.getElementById("main");
    while (main.firstChild) {
        main.removeChild(main.lastChild);
    }
}

// Remove empty value from Objects
export const clearEmptyValue = (obj) => {
    let ret = {};
    Object.keys(obj).forEach((k) => {
        if (obj[k]) {
            ret[k] = obj[k];
        }
    });
    return ret;
}

// Sort objects by timestamp
export const sortByTimestamp = (objectArray) => {
    objectArray.sort((a, b) => {
        return b.published - a.published;
    });
}

// Toggle buttons or links
export const toggle = (clickable, elementToShow, displayStyle) => {
    clickable.onclick = (e) => {
        e.preventDefault();
        elementToShow.style.display === "none" ? elementToShow.style.display = displayStyle : elementToShow.style.display = "none";
    }
}