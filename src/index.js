import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js'
const throttle = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input')
const countryList = document.querySelector('.country-list')
const countryInfo = document.querySelector('.country-info')

input.addEventListener('input', throttle(countrySearch, DEBOUNCE_DELAY))
function countrySearch(e) {
    fetchCountries(e.target.value.trim()).then(response => {
    if (!response.ok) {
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
        throw new Error(response.status);
    }
        return response.json()
    })
        .then(data => {
            console.log(data);
            if (data.length >= 10) {
                countryList.innerHTML = "";
                countryInfo.innerHTML = "";
                Notify.info("Too many matches found. Please enter a more specific name.")
            } else if (data.length === 1) {
                countryList.innerHTML = "";
                countryInfo.innerHTML = markupCountryInfo(data)
            } else if (input.value === "") {
                countryList.innerHTML = "";
                countryInfo.innerHTML = "";
            } else{
                countryInfo.innerHTML = "";
                countryList.innerHTML = markupCountryList(data)
            }
            
        })
        .catch(error => {
            if (input.value.length > 0) {
                Notify.failure("Oops, there is no country with that name")
            }
        });
}


function markupCountryList(array) {
    return array.map(({ flags, name }) => {
        return `<li class="country-item">
        <img class="country-img" src="${flags.png}" alt="flag of ${name.official}">
        <p class="country-name">${name.official}</p>
      </li>`
    }).join("")
}

function markupCountryInfo(array) {
    return array.map(({ flags, name, capital, population, languages }) => {
        return `<p class="country-info-name"><img class="country-img" src="${flags.png}" alt="flag of ${name.official}">
                ${name.official}</p>
                <p><b>Capital:</b> ${capital}</p>
                <p><b>Population:</b> ${population}</p>
                <p><b>Languages:</b> ${Object.values(languages).join(", ")}</p>`
    }).join("")
}