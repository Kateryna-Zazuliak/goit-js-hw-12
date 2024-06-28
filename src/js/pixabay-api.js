import axios from 'axios';
import imageUrl from '../img/error.png';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


export async function getResearch(gallery, page = 1) {
    const BASE_URL = 'https://pixabay.com';
    const END_POINT = '/api/';
    const params = new URLSearchParams({
        key: '44398690-5434b83d57176502a6803f4be',
        q: gallery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 15,
    });
    const url = `${BASE_URL}${END_POINT}?${params}`;
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        console.log(err);
        iziToast.error({
        message: 'Error',
        });
    };
}

