const userTab = document.querySelector("[data-user-weather]");
const searchTab = document.querySelector("[data-search-weather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initially variable need
// by default mera your weather current tab rhega
let oldTab = userTab;
const API_KEY = "5e62b289d57f27f56a2df2d0fbb2007c";
oldTab.classList.add("current-tab");
getfromSessionStorage();


// function call krenge your weather and search weather tab switchkrne ke liye or add event listener user krnege

function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }
        else{
            // pehle search wale tab me tha ab your weather tab visible krna hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            // ab mai weather tab me aa gya hu to weather tab bhi display krna pdega, so lets check local storage first , for coordinate we have saved them their
            getfromSessionStorage();
           
        }

    }

}

userTab.addEventListener("click", ()=>{
    // pass clicked tab as input---> jis bhi tab pe click krenge open hoga
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    // pass clicked tab as input---> jis bhi tab pe click krenge open hoga
    switchTab(searchTab);
});


// check if coordinates are already present in session torage or not 
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // aar local coordinates prsent nhi hai session storage me then
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinate = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinate);
    }

}

async function  fetchUserWeatherInfo(coordinate){
    const {lat, lon} = coordinate;
    // make grant container invisible , loader show kro
    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    // api call
    try{
        const respond =  await fetch(` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const data = await respond.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);


    }
    catch(err){
        loadingScreen.classList.remove("active")

    }


}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the element
    const cityName = document.querySelector("[data-cityName]");
    const CountryIcon = document.querySelector("[data-countryIcon]");
    const weatherdesc = document.querySelector("[data-weatherDesc]");
    const WeatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-Humidity]");
    const cloudiness = document.querySelector("[data-cloud]");


    // fetch values from weather info and put it in UI
    cityName.innerText = weatherInfo?.name;
    CountryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherdesc.innerText = weatherInfo?.weather?.[0]?.description;
    WeatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // 
    }
}

function showPosition(position){

    const userCoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,

    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinate));
    fetchUserWeatherInfo(userCoordinate);
}

const grantAccesbtn = document.querySelector("[data-grant-access]")
grantAccesbtn.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]") ;
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchsearchweatherinfo(cityName);
    }

})

async function fetchsearchweatherinfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }

}