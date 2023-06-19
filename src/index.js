import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';


// запит на сайт з параметрами ТЗ
const API_KEY = '37472485-f9bdad7e7011607296af4912b';
const url = 'https://pixabay.com/api/';
const quantityPerPage = 40;

async function getImages(searchQuerys, countPage) {
  const parametres = {
    parametres: {
      timeout: 1000,
      key: API_KEY,
      q: searchQuerys,
      image_type: 'photo',
      orientation: 'horizontal',
      page: countPage,
      per_page: quantityPerPage,
    },
  };

    const response = await axios.get(url, parametres)
        .then(response => { return response.data })
        .catch(error => Notiflix.Notify.failure(error))
}


