
import { getResearch } from './js/pixabay-api.js';
import {markupResearch, showLoader, hideLoader, refs } from './js/render-functions.js';
import imageUrl from './img/error.png';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


export let currentPage = 1;
export let gallery = '';
export const perPage = 15;


refs.formElem.addEventListener('submit', async event => {
    event.preventDefault();
    gallery = refs.inputElem.value.trim();
    refs.galleryElem.innerHTML = '';
    if (gallery === '' || gallery === ' ') {
        refs.galleryElem.innerHTML = '';
        hideLoadBtn();
        iziToast.error({
            position: 'topRight',
            theme: 'dark',
            messageColor: 'white',
            iconUrl: imageUrl,
            backgroundColor: '#ef4040',
            message: 'Please enter a search word.',
        });
    } else {
        currentPage = 1;
        await fetchImages();
    }
});

refs.btnLoadMore.addEventListener('click', async () => {
  currentPage += 1;
  await fetchImages();
});

async function fetchImages() {
    showLoader();
    hideLoadBtn();
    try {
        const arr = await getResearch(gallery, currentPage, perPage);
        if (arr.hits.length === 0) {
            hideLoadBtn();
            iziToast.error({
                position: 'topRight',
                theme: 'dark',
                messageColor: 'white',
                iconUrl: imageUrl,
                backgroundColor: '#ef4040',
                message: 'Sorry, there are no images matching your search query. Please try again!',
            });
            refs.galleryElem.innerHTML = '';
        } else {
            showLoadBtn();
            markupResearch(arr.hits);
            scrollElements();
            let newGallery = new SimpleLightbox('.gallery-link', {
                captionsData: 'alt',
                captionPosition: 'bottom',
                captionDelay: 250,
            }).refresh();

            newGallery.on('error.simplelightbox', function (e) {
                console.log(e);
            });
            if (arr.hits.length < 15 || currentPage * 15 >= arr.totalHits) {
                refs.galleryElem.innerHTML = '';
                hideLoadBtn();
                iziToast.info({
                    position: 'topRight',
                    theme: 'dark',
                    messageColor: 'white',
                    iconUrl: imageUrl,
                    backgroundColor: '#ef4040',
                    message: "We're sorry, but you've reached the end of search results.",
                });
            } else {
                showLoadBtn();
            }
        };
    } catch (err) {
        console.log(err);
        iziToast.error({
        position: 'topRight',
        theme: 'dark',
        messageColor: 'white',
        iconUrl: imageUrl,
        backgroundColor: '#ef4040',
        message: "Something was wrong.",});
    } finally {
        hideLoader();
        refs.inputElem.value = '';
    };
}

function scrollElements() {
    const liElem = refs.galleryElem.firstElementChild;
    const height = liElem.getBoundingClientRect().height;
    scrollBy({
        top: height * 2,
        behavior: 'smooth',
    });
}
function showLoadBtn() {
    refs.btnLoadMore.classList.remove('visually-hidden');
};
function hideLoadBtn() {
    refs.btnLoadMore.classList.add('visually-hidden');
};