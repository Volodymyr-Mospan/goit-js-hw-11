import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

const KEY = '32702004-1edcc94db1ad9191accf2fa0a';
const imageType = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';

formRef.addEventListener('submit', onSubmitSearch);

function onSubmitSearch(e) {
  e.preventDefault();

  const input = e.currentTarget.searchQuery.value;

  fetchGallery(input)
    .then(data => {
      murkupGallery(data.hits);
      const lightbox = new SimpleLightbox('.gallery a');
    })
    .catch(error => {
      console.log(error);
    });
}

function fetchGallery(input) {
  return fetch(
    `https://pixabay.com/api/?key=${KEY}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}&q=${input}`
  ).then(resp => {
    console.log(resp);

    if (resp.ok) {
      return resp.json();
    }
    throw new Error(resp.statusText);
  });
}

function murkupGallery(arr) {
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

/* <div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>; */
