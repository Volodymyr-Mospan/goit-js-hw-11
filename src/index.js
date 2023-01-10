import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayAPI from './js/components/pixabayAPI';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const pixabayApi = new PixabayAPI();

let lightbox = null;

formRef.addEventListener('submit', onSubmitSearch);
loadMoreButton.addEventListener('click', onLoadMoreButton);

function onSubmitSearch(e) {
  e.preventDefault();

  if (pixabayApi.query !== e.currentTarget.searchQuery.value) {
    clearMarkupGallery();
    pixabayApi.query = e.currentTarget.searchQuery.value;
    pixabayApi.resetPage();
  }

  pixabayApi
    .fetchGallery()
    .then(markupGallery)
    .catch(error => {
      console.log(error);
    });
}

function onLoadMoreButton(e) {
  pixabayApi
    .fetchGallery()
    .then(markupGallery)
    .catch(error => {
      console.log(error);
    });
}

function markupGallery(arr) {
  const gallery = arr
    .map(el => {
      return `
      <div class="photo-card">
        <a class="gallery__link" href="${el.largeImageURL}">
          <img class="gallery__image" src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />  
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${el.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${el.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${el.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${el.downloads}
          </p>
        </div>
      </div>
    `;
    })
    .join('');

  galleryRef.insertAdjacentHTML('beforeend', gallery);
}

function clearMarkupGallery() {
  galleryRef.innerHTML = '';
}

// function onLoadMoreButton(e) {
//   pixabayApi
//     .fetchGallery()
//     .then(data => {
//       markupGallery(data.hits);

//       if (lightbox) {
//         lightbox.refresh();
//       } else {
//         lightbox = new SimpleLightbox('.gallery a');
//       }
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }
