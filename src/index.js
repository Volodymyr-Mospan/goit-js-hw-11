import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayAPI from './js/components/PixabayAPI';
import LoadMoreButton from './js/components/load-more-button';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
// const loadMoreButton = document.querySelector('.load-more');

const pixabayApi = new PixabayAPI();
const loadMoreButton = new LoadMoreButton({
  selector: '.load-more',
  hidden: true,
});

let lightbox = null;

formRef.addEventListener('submit', onSubmitSearch);
loadMoreButton.refs.button.addEventListener('click', fechGallery);

function onSubmitSearch(e) {
  e.preventDefault();

  if (pixabayApi.query !== e.currentTarget.searchQuery.value) {
    clearMarkupGallery();
    pixabayApi.query = e.currentTarget.searchQuery.value;
    pixabayApi.resetPage();
  }

  loadMoreButton.show();
  fechGallery();
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

  return galleryRef.insertAdjacentHTML('beforeend', gallery);
}

function clearMarkupGallery() {
  galleryRef.innerHTML = '';
}

function fechGallery() {
  loadMoreButton.disable();
  pixabayApi
    .fetchGallery()
    .then(arr => {
      markupGallery(arr);
      loadMoreButton.enable();
    })
    .catch(error => {
      console.log(error);
    });
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
