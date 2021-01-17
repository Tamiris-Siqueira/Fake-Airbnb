const API_URL = "https://dry-cliffs-94979.herokuapp.com/";
let currentPage = 1;
const ITEMS_PER_PAGE = 8;

const filterPlaces = (input, places) => {
    return places.filter(place => place.name.toLowerCase().includes(input.value.toLowerCase()));
};

const paginateData = (data) => {
    return data.reduce((total, current, index) => {
        const belongArrayIndex = Math.ceil((index + 1) / ITEMS_PER_PAGE) - 1;
        total[belongArrayIndex] ? total[belongArrayIndex].push(current) : total.push([current]);
        return total;
    }, []);
};

const fetchAPI = async (url) => {
    let response = await fetch(url);
    const textResponse = await response.text();
    return JSON.parse(textResponse);
};

const changePage = (pageToBeRendered) => {
    currentPage = pageToBeRendered;
    renderPage();
};

const renderPaginationMenu = (paginatedData) => {
    const paginationContainer = document.querySelector('.pagination');
    while (paginationContainer.firstChild) {
        paginationContainer.removeChild(paginationContainer.firstChild);
    };
    const previousPage = document.createElement('span');
    previousPage.className = 'page-changer';
    previousPage.innerHTML = '<';
    previousPage.addEventListener('click', () => currentPage <= 1 ? () => { } : changePage(currentPage - 1));
    paginationContainer.appendChild(previousPage);

    paginatedData.forEach((_, index) => {
        const pageButton = document.createElement('span');
        pageButton.innerHTML = index + 1;

        pageButton.addEventListener('click', () => changePage(index + 1));

        if (currentPage === index + 1) {
            pageButton.className = 'active';
        };
        paginationContainer.appendChild(pageButton);
    });

    const nextPage = document.createElement('span');
    nextPage.className = 'page-changer';
    nextPage.innerHTML = '>';
    nextPage.addEventListener('click', () => currentPage >= paginatedData.length ? () => { } : changePage(currentPage + 1));

    paginationContainer.appendChild(nextPage);
};

const renderPage = async () => {
    const apiData = await fetchAPI(API_URL);

    const searchInput = document.querySelector('#filter');
    let filteredApiData = filterPlaces(searchInput, apiData);

    const searchButton = document.querySelector('#search-button');
    searchButton.addEventListener('click', {passive: true}, () => {
        filteredApiData = filterPlaces(searchInput, apiData);
        renderPage();
    });
    const paginatedData = paginateData(filteredApiData);
    renderPaginationMenu(paginatedData);

    cardContainer = document.querySelector(".card-container");

    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    };

    paginatedData[currentPage - 1].forEach(property => {
        const { name, photo, price, property_type } = property;
        card = document.createElement("div");
        card.className = "card";

        cardImg = document.createElement("img");
        cardImg.className = "card-img";
        cardImg.src = photo;

        cardInfo = document.createElement("div");
        cardInfo.className = "card-info";

        propertyName = document.createElement("div");
        propertyName.className = "property-name";
        propertyName.innerHTML = name;

        propertyType = document.createElement("div");
        propertyType.className = "property-type";
        propertyType.innerHTML = `Tipo: ${property_type}`;

        propertyPrice = document.createElement("div");
        propertyPrice.className = "property-price";
        propertyPrice.innerHTML = `R$  ${price.toFixed(2)}/noite`;

        cardContainer.appendChild(card);
        card.appendChild(cardImg);
        card.appendChild(cardInfo);
        cardInfo.appendChild(propertyName);
        cardInfo.appendChild(propertyType);
        cardInfo.appendChild(propertyPrice);
    });
};

function initMap() {
    const locations = [
        ['Avenida Paulista', -23.563311, -46.654275, 5],
        ['Gonzaga', -23.964003457463175, -46.33489610480924, 4],
        ['Marco Zero', -23.550460, -46.633934, 3],
        ['Morumbi', -23.60350109191081, -46.712113567013375, 2],
        ['Copacabana', -22.96441895030272, -43.192621916292644, 1]
    ];

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(-23.550460, -46.633934),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    const infowindow = new google.maps.InfoWindow();

    let marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}
renderPage();