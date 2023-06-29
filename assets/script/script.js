//Global variables

//Variables for location input, relating to html elements to on the page and how it's displayed
var cityInput = document.querySelector("#search-input");
var cityTitle = document.querySelector("#city");
var cardContainer = document.querySelector("#card-container");

//Variables relating to saving data to local storage
var cityList = document.querySelector("#cities");
var searchedCities = document.querySelector("#searched-cities");

//Variables for displaying and calling specific forecast data for given location from OpenWeather API
var currentTemp = document.querySelector("#current-temp");
var currentWind = document.querySelector("#current-wind");
var currentHumidity = document.querySelector("#current-humidity");
var weatherPicture = document.querySelector("#weather-icon");
var forePicture = document.querySelector("#fore-icon")

//Variables for HTML element containers to display forecast data
var forecast_Data = document.querySelector("#forecast-data");
var fiveDay = document.querySelector("#five-day");

//Variables for the search form and search button for submit/click events
var submitEl = document.querySelector("#submit-form");
var submitButton = document.getElementById("submit-button");

//Variables for fetching date input from search form, used across forecast functions and for saving location-date input to local storage
var inputDay;
var inputDate = document.getElementById("date-input");
var parsedInputDay;
var displayDay = dayjs("6-14-2023").format("M-D-YYYY");
var today = dayjs().format("M-D-YYYY");

//Variables relating to fetching nearby results from the TomTom API and their correlating HTML elements to display on the page
var requestURL;
var baseURL = "https://api.tomtom.com/search/2/nearbySearch/.json?"
var categoryID = "";
var radius = "&radius=10000";
var limit = "&limit=10";
var appid = "&key=lQzhlUqG4GkQgblg5j1RGpsNRkCl2PrN";
var resultsDiv = document.getElementById("results-div");

//Functions
//Functions that are declared as variables to improve efficiency and organization of script code.
// Puts values into local storage
var loadLocalStorage = function (loadCity, loadDate) {
    var citiesInStorage = JSON.parse(localStorage.getItem("citySearch")) || []
    citiesInStorage.push({ searchedName: loadCity, searchedDate: loadDate });
    localStorage.setItem("citySearch", JSON.stringify(citiesInStorage));
    var cityArray = JSON.parse(localStorage.getItem("citySearch"));

    var recallSearch = function () {
        forecast_Data.innerHTML = "";
        document.getElementById("cities").innerHTML = ""
        for (let i = 0; i < citiesInStorage.length; i++) {
            var cityDateButton = document.createElement("button");

            var counter = cityArray[i];

            cityDateButton.textContent = counter.searchedName + " | " + counter.searchedDate;
            document.getElementById("cities").appendChild(cityDateButton);
            cityDateButton.setAttribute("class", "bg-transparent hover:bg-blue-500 text-black-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded text-base");
        }
    }
    recallSearch();
}

var buttonClickHandler = function (event) {
    forecast_Data.innerHTML = "";
    var cityDateParse = (event.target.textContent)
    var cityDateParseArray = cityDateParse.split(" | ");
    let cityParse = cityDateParseArray[0];
    let dateParse = cityDateParseArray[1];
    inputDay = dayjs(dateParse)
    getLatLonCity(cityParse);
}
document.getElementById("cities").addEventListener("click", buttonClickHandler);

// This function inserts the city into the apiURL then fetches the latitude and longitude of the city.  It checks the cities in the storage array and if the current searched city is not in the array, it adds it to the array.  If it's already in there it doesn't re-add the city to the array.  Then it runs the getWeather and getFiveDay functions.
var getLatLonCity = function (city) {

    var apiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=44be570f60fd1ef1f012456a39e5a0ff";

    fetch(apiURL).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {

                for (var i = 0; i < data.length; i++) {
                    latitude = data[i].lat;
                    longitude = data[i].lon;
                    cityName = data[i].name;

                    getForecast(latitude, longitude);
                    map(latitude, longitude);
                    getNearbyResults(requestURL, latitude, longitude);
                }
            })
        }
    })
};

//This function retrieves relevant forecast data from the OpenWeather API with the coordinates fetched from the getLatLonCity function and the date from user input.  Once the specific forecast data is retrieved, it is appended to the relating HTML elements and their container to display onto the page.
var getForecast = function (latitude, longitude) {
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=44be570f60fd1ef1f012456a39e5a0ff";


    fetch(fiveDayURL).then(function (response) {
        return response.json()
    })
        .then(function (forecastData) {

            var dayChosen = determineArrayPosition();

            var foreDay = dayjs().add([dayChosen], "day").format("M/D/YYYY");
            var foreIcon = forecastData.list[dayChosen].weather[0].icon;
            var foreTemp = ((((forecastData.list[dayChosen].main.temp) - 273.15) * 1.8) + 32).toFixed(2) + " F";
            var foreFeels = ((((forecastData.list[dayChosen].main.feels_like) - 273.15) * 1.8) + 32).toFixed(2) + " F";
            var foreWind = forecastData.list[dayChosen].wind.speed;
            var foreHumidity = forecastData.list[dayChosen].main.humidity;
            var foreClouds = forecastData.list[dayChosen].clouds.all;
            var foreRain = forecastData.list[dayChosen].pop;
            var foreCity = forecastData.city.name;
            var foreCountry = forecastData.city.country;
            var foreTimezone = forecastData.city.timezone;
            var foreSunrise = forecastData.city.sunrise;
            var foreSunset = forecastData.city.sunset;

            var sunriseArray = dayjs.unix(foreSunrise);
            var sunsetArray = dayjs.unix(foreSunset);

            var timezoneFormatted = " (UTC " + foreTimezone / 3600 + " hours)";

            if (sunriseArray.$H < 12) {
                var riseAmpm = "a.m."
            } else {
                var riseAmpm = "p.m."
            }

            if (sunsetArray.$H < 12) {
                var twelveHour = sunsetArray.$H;
                var setAmpm = "a.m.";
            } else {
                var twelveHour = sunsetArray.$H - 12;
                var setAmpm = "p.m.";
            }

            if (sunriseArray.$m.toString().length == 1) {
                var fullSunriseMinutes = sunriseArray.$m + "0";
            } else (fullSunriseMinutes = sunriseArray.$m);

            if (sunsetArray.$m.toString().length == 1) {
                var fullSunsetMinutes = sunsetArray.$m + "0";
            } else (fullSunsetMinutes = sunsetArray.$m);

            var sunrise12Format = sunriseArray.$H + ":" + fullSunriseMinutes + " " + riseAmpm
            var sunset12Format = twelveHour + ":" + fullSunsetMinutes + " " + setAmpm

            rainProbability = foreRain * 100;

            var rowDivEl = document.createElement("div");

            var foreList = document.createElement("div");
            foreList.setAttribute("class", "col-12 m-3 col-xl ml-4");

            var cardEl = document.createElement("div");
            cardEl.setAttribute("class", "card p-3 m-3 my-2 fs-6 bg-opacity-25");

            var titleEl = document.createElement("h4");
            titleEl.textContent = foreDay;

            var cityCountryEl = document.createElement("p");
            cityCountryEl.textContent = foreCity + " (" + foreCountry + ")";

            var timezoneEl = document.createElement("p");
            timezoneEl.textContent = "Timezone: " + timezoneFormatted;

            var tempEl = document.createElement("p");
            tempEl.textContent = "Temp: " + foreTemp;

            var feelsLikeEl = document.createElement("p");
            feelsLikeEl.textContent = "Feels like: " + foreFeels;

            var windEl = document.createElement("p");
            windEl.textContent = "Wind: " + foreWind + " MPH";

            var humidityEl = document.createElement("p");
            humidityEl.textContent = "Humidity: " + foreHumidity + "%";

            var cloudsEl = document.createElement("p");
            cloudsEl.textContent = "Cloudiness: " + foreClouds;

            var rainEl = document.createElement("p");
            rainEl.textContent = "Rain probability: " + foreRain;

            var sunriseEl = document.createElement("p");
            sunriseEl.textContent = "Sunrise: " + sunrise12Format;

            var sunsetEl = document.createElement("p");
            sunsetEl.textContent = "Sunset: " + sunset12Format;

            var weatherPicture = "https://openweathermap.org/img/w/" + foreIcon + ".png";

            var pic = document.createElement("img");
            pic.setAttribute("alt", "weather icon");
            pic.src = weatherPicture;
            pic.setAttribute("height", "50");
            pic.setAttribute("width", "50");

            cardEl.appendChild(titleEl);
            cardEl.appendChild(pic);
            cardEl.appendChild(cityCountryEl);
            cardEl.appendChild(timezoneEl);
            cardEl.appendChild(tempEl);
            cardEl.appendChild(feelsLikeEl);
            cardEl.appendChild(windEl);
            cardEl.appendChild(humidityEl);
            cardEl.appendChild(cloudsEl);
            cardEl.appendChild(rainEl);
            cardEl.appendChild(sunriseEl);
            cardEl.appendChild(sunsetEl);
            foreList.appendChild(cardEl);
            rowDivEl.appendChild(foreList);
            forecast_Data.appendChild(rowDivEl);
        })
}

function toggleModal(modalID) {
    
    let backdropModalId = modalID+"-backdrop"
    
    document.getElementById(modalID).classList.toggle("hidden");
    // document.getElementById(modalID + "-backdrop").classList.toggle("hidden");
    // document.getElementById(backdropModalId).classList.toggle("hidden");
    document.getElementById(modalID).classList.toggle("flex");
    // document.getElementById(modalID + "-backdrop").classList.toggle("flex");
    // document.getElementById(backdropModalId).classList.toggle("flex");
}

//Functions that can be called asynchronously
//Functions for user input for location and date
function getInputDate() {
    inputDay = dayjs(inputDate.value);
    parsedInputDay = dayjs(inputDay).format("MM-DD-YYYY");

    // if (parsedInputDay==="") {
    //     toggleModal("no-input");}

    return parsedInputDay;
}


function getInputCity() {
    cityName = document.getElementById("location-search").value;

    // if ((cityName === "")||(typeof cityNameData ==="undefined")) {
    //     toggleModal("no-input");
    //     return;
    // }

    return cityName;
}

//This function calls the previous functions to consolidate the user location and date input so it can be used in conjunction for saving to local storage and retrieving forecast data.
function handleSubmitBtn(e) {
    e.preventDefault();
    var dateData = getInputDate();
    var cityNameData = getInputCity();

    if (dateData === "Invalid Date") {
        toggleModal("no-input");
        return;
    }

    if ((dayjs(dateData).diff(today, "day")) > 30) {
        toggleModal("no-input");
        return;
    }


    if ((cityName === "")||(typeof cityNameData ==="undefined")) {

        toggleModal("no-input");
        return;
    }
    getLatLonCity(cityNameData);
    loadLocalStorage(cityNameData, dateData);
}

//This function is used as a cap by determining the user input date against an array of dates 30 days from the current day and alerts if a user tries to input a date and retrieve data that is outside of the OpenWeather API's database.  (As well as science, since it is highly unlikely that accurrate forecast predictions can be made over 30 days into the future.)
function determineArrayPosition() {
    if (inputDay.diff(today, "day") > 30) {
        return;
    } else {
        var arrayPosition = inputDay.diff(today, "day");
        return arrayPosition;
    }
};

//This function displays the map based on location input coordinates from the OpenWeather API geolocation fetch and displays the TomTom API interactive map on the page. If the user inputs a new location, the map updates accordingly. 
function map(latitude, longitude) {
    var API_KEY = "7ZuASDGIDYaSxAwpTaBAcI5E3Eqe7pq4";
    var coordinates = [longitude, latitude];
    var map = tt.map({
        key: API_KEY,
        center: coordinates,
        zoom: 10,
        container: 'mymap',
    });

    var handleResults = function (result) {
        if (result.results) {
            moveMap(result.results[0].position)
        }
    }

    submitButton.addEventListener("click", search);

    function search() {
        tt.services.fuzzySearch({
            key: API_KEY,
            query: document.getElementById("query").value,
        }).go().then(handleResults)
    }
}

//This function accesses the TomTom API with the location input in longitude and latitude (previously sourced from the OpenWeather geolocation API call), and dynamically creates result cards of relevant POI nearby.
function getNearbyResults(requestURL, latitude, longitude) {

    //the requestURL is a globally declared variable that is broken down into key value search parameters. This allows for further development and customization of narrower user-sourced search parameters to fetch more relevant data and improve user experience. 
    var tomLatitude = latitude;
    var tomLongitude = longitude;
    var lat = "lat=" + tomLatitude;
    var lon = "&lon=" + tomLongitude;
    var categorySet = "&categoryset=" + categoryID;

    requestURL = baseURL + lat + lon + radius + limit + appid;
    //[Although there is not a dropdown Category section implemented yet, the functional code has accommodated space for one.]
    if (categoryID !== "") {
        requestURL + categorySet;
    }

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //After fetching the entire data object, specifically targets the 'results' from that object.
            let resultsList = data.results;
            
            resultsDiv.innerHTML="";
            
            //Utilizing for-loop to dynamically create a div container in the html for each result as well as the information to display
            for (let index = 0; index < resultsList.length; index++) {
                let resultCard = document.createElement("div");
                resultCard.setAttribute("class", "result-card");
                //For future usability and development, each dynamically created div container is given a unique id based on the index iteration in the fetched data.result object
                resultCard.setAttribute("id", "result-info" + [index]);

                //going through result by index and retrieving relevant data and saving to an object
                let result = {
                    Name: resultsList[index].poi.name,
                    Address: resultsList[index].address.freeformAddress,
                    Categories: resultsList[index].poi.categories.join(),
                    Phone: resultsList[index].poi.phone,
                    Link: resultsList[index].poi.url,
                };
                //if no entry in fetch data, entry for result object is deleted. this is to enhance UI and remove unnecessary entries with undefined data
                if (result.Phone == undefined) {
                    delete result.Phone;
                }
                if (result.Link == undefined) {
                    delete result.Link;
                }

                //preparing result object to display entries as a readable text, then appending that text value to the created result card information and finally appending the p element text to the result container.
                for (const [key, value] of Object.entries(result)) {
                    let resultText = document.createElement("p");
                    resultText.textContent = `${key}: ${value}`;

                    resultCard.appendChild(resultText);
                }
 
                resultsDiv.appendChild(resultCard);
            }
        })
}

//Event listeners
//This is the event listener that references the handleSubmitButton function and begins the cascading function chain sequence for retrieving location coordinates, input date, saving to local storage, forecast, map location, and nearby POI results.
submitButton.addEventListener("click", handleSubmitBtn);