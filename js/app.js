// Unsplash API
const quantityImageEachTime = 30;
const apiKey = 'nZkhvR_dbKcIelqnGyhaxvuusmk3mSaGNcm_E7snfmQ';
const content_filter = 'high';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${quantityImageEachTime}&content_filter=${content_filter}`;


// DOM element for image
const imageContainer = document.querySelector('#image-container');

// Check for loaded by count number of images is loaded
let isReadyToGetMorePhoto = false;
let imagesIsLoaded = 0;
let totalImagesAreLoaded = 0;

// Loader element
const loader = document.querySelector('#loader');

function helpDOMSetAttributes (element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function checkIfImgIsLoaded() {
    imagesIsLoaded++;
    if(imagesIsLoaded == quantityImageEachTime){
        isReadyToGetMorePhoto = true;
        totalImagesAreLoaded += imagesIsLoaded;
        imagesIsLoaded = 0;

        // If those images are loaded, hidden loader in the first time load imgage
        loader.hidden = true;
    }
}

function createImgElementAndAppendItToContainer (imgUrl,title,aHref){

    // Create image element
    const imgElement = document.createElement('img');
    helpDOMSetAttributes(imgElement, {
        src: imgUrl,
        alt: title,
        title: title
    })

    // check if img loaded
    imgElement.addEventListener('load', checkIfImgIsLoaded);
    
    // Create a element to whenever we click on this picture it open unsplash url of this picture
    const aElement = document.createElement('a');

    helpDOMSetAttributes(aElement,{
        href: aHref,
        target: '_blank'
    })

    // Push image inside a
    aElement.appendChild(imgElement);

    // Push aElement inside image container
    imageContainer.appendChild(aElement);
}


async function getPhotosFromUnsplashAPI() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log(data);
        data.forEach(item => {
            createImgElementAndAppendItToContainer(item.urls.regular,item.alt_description,item.links.html);
        })

    }
    catch(error){
        console.log('We got an error here ', error );
    }
}

function checkAndReloadPhoto () {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && isReadyToGetMorePhoto){
        isReadyToGetMorePhoto = false;
        getPhotosFromUnsplashAPI();
    }
}

// Listen event scroll and check if near the bottom of the page, load more photos
window.addEventListener('scroll',checkAndReloadPhoto)

// On load

getPhotosFromUnsplashAPI();