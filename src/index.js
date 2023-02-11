import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axiosGet from "./js/api-service";
import cardTemplate from './templates/card-pic.hbs';
// import axiosGet from './js/api-service'; 


//Light-box------
	const lightbox = new SimpleLightbox('.photo-card a',
	{
		captionsData: 'alt',
		captionDelay: 250,
		captions: true,
		});



let searchQuery = '';
let currentPage = 1;
let perPage = 40;;
let totalPage = 0;

const searchForm = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const picContainer = document.querySelector('.gallery');
const backBth = document.querySelector('.bth-back');
console.log(loadMore);
console.log(searchForm);



loadMore.addEventListener('click', onLoadMore);
searchForm.addEventListener('submit', onSubmitSend);


async function onLoadMore() {
	currentPage += 1;
	const response = await axiosGet(searchQuery, currentPage, perPage);
	
	totalPage = response.totalHits / perPage
	renderMarkUP(response.hits);
	
	const { height: cardHeight } = document.querySelector(".gallery")
  	.firstElementChild.getBoundingClientRect();

			window.scrollBy({
  			top: cardHeight * 100,
  			behavior: "smooth",
			});
	
	try {
		if (currentPage >= totalPage) {

				buttonHide()
				backBthShow()
				backBth.addEventListener('click', function (e) {
					e.preventDefault();
				const { height: cardHeight } = document.querySelector(".gallery")
  				.firstElementChild.getBoundingClientRect();

				window.scrollBy({
  				top: cardHeight * -200,
  				behavior: "smooth",
	});
				})
				

		Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
	}

	} catch (error) {
		console.log(error);
	}
	lightbox.refresh();// ставить всегда после разметки(а лучше в конце функции)
	}

async function onSubmitSend(e) {
	e.preventDefault();
	currentPage  = 1; 
	searchQuery = e.currentTarget.elements.searchQuery.value;
	clearContainer();
	if (searchQuery === '') {
		return searchQuery;
	}
	const response = await axiosGet(searchQuery, currentPage, perPage);

	totalPage = response.totalHits / perPage
	console.log(totalPage);
	
	try {
		if (response.hits.length > 0) {
			Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
			clearContainer();
			renderMarkUP(response.hits);
			lightbox.refresh();
			
		} 

		if (currentPage < totalPage) {
			buttonShow();
			backBthHide();
		} else {
			buttonHide();
			backBthHide();
			Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
		}
		
		
	} catch (error) {
		console.log(error)
	}
	
	

};

//---Functions

buttonHide()

function renderMarkUP(picture) {
	const markeUp = picture.map(pic => cardTemplate(pic)).join(' ');
	picContainer.insertAdjacentHTML('beforeend', markeUp);
	
}

function clearContainer() {
	picContainer.innerHTML = '';
}


function buttonHide() {
		loadMore.classList.add('is-hiden');
}
	
function buttonShow() {
		loadMore.classList.remove('is-hiden');
}


backBthHide()
function backBthHide() {
	backBth.classList.add('is-hide');
}


function backBthShow() {
	backBth.classList.remove('is-hide');
}









