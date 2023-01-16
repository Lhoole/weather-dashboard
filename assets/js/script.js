var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
var apiKey = "349c7d3f61d7183379a35bc8f017e1ee";
var userinput;
var lastsearch;
var searchbtn = document.getElementById("searchbtn")
var searchbox = document.getElementById("searchcontent")

function getlastsearch() {
    var previousCity = localStorage.getItem("lastsearch");
    if (previousCity !== null) {
    lastsearch = previousCity
    } else {
    lastsearch = "Sydney";
    localStorage.setItem("lastsearch", lastsearch)
    }
    console.log(lastsearch + "test")
    }

getlastsearch()

function getCoords (cityName){
    console.log(cityName)
    fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        console.log(data)
 
        var lat = data[0].lat
        var lon = data[0].lon

        console.log(lon, lat)
        getWeather(lat, lon)
    })

}
function getWeather (lat, lon){
 fetch (`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
 .then(function (response){
    return response.json();
})
.then(function (data) {
    let day = 8
    let temp = data.list
    console.log(temp)
    var dayoneweather = temp.slice(0, 5)
    avg (dayoneweather)
    max_temp(dayoneweather)
    min_temp(dayoneweather)
    console.log(dayoneweather)
    for (var index = 5; index < temp.length; index+= day) {
        let fourdayweather = temp.slice(index, index+8)
        console.log(fourdayweather)
        avg(fourdayweather)
    }
})
}
function avg (array){
    var temptotal = 0
    array.forEach((element, index) => {
        temptotal = temptotal + element.main.temp
        //console.log(temptotal)
        if (index==array.length-1) {
            let tempavg = temptotal/array.length
            console.log(tempavg)
        }
    });
}
 function max_temp(array){
    var tempsarray = []
    array.forEach((element, index) => {
        let tempvalue = element.main.temp
        tempsarray.push(tempvalue)
        if (index==array.length-1) {
            tempsarray.sort((a,b)=>a-b)
            console.log(tempsarray)
            console.log(tempsarray[tempsarray.length - 1])
        }
    });
 }

 function min_temp(array){
    var tempsarray = []
    array.forEach((element, index) => {
        let tempvalue = element.main.temp
        tempsarray.push(tempvalue)
        if (index==array.length-1) {
            tempsarray.sort((a,b)=>b-a)
            console.log(tempsarray)
            console.log(tempsarray[tempsarray.length - 1])
        }
    });
 }


getCoords(lastsearch)


function savesearch() {
    let search = userinput
    localStorage.setItem("lastsearch", search)
    var previousCities = localStorage.getItem("PreviousCities");
      if (previousCities !== null) {
      previousCities = JSON.parse(localStorage.getItem("PreviousCities"))
      } else {
      previousCities = ["Sydney"];
      }
    previousCities.push(search)
    if (previousCities.length > 8) {
    previousCities.shift()
    }
    localStorage.setItem("PreviousCities", JSON.stringify(previousCities));
}

function citySelectFromSearch() {
    getCoords(userinput)
    savesearch()
}

searchbox.addEventListener('input', function handleChange(event) {
    userinput = event.target.value
    event.target.textContent = userinput.trim()
  });
  
  searchbtn.addEventListener('click', citySelectFromSearch);{
  }
  