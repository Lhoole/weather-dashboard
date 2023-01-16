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
    var temp = data.list
    console.log(temp)
    var dayoneweather = temp.slice(0, 5)
    createCard(dayoneweather)
    for (var index = 5; index < temp.length; index+= day) {
        let fourdayweather = temp.slice(index, index+8)
        //console.log(fourdayweather)
        createCard(fourdayweather)
    }
})
}
function createCard(array){
    console.log(array)
    avg (array)
    max_temp(array)
    min_temp(array)
    wind_speed(array)
    wind_gust(array)
    wind_direction(array)
    iconFind(array)
    humidityMax(array)
    weatherDate(array)
    // console.log(max_temp(array))
    // console.log(min_temp(array))
    // console.log(wind_speed(array))
    // console.log(wind_gust(array))
    // console.log(wind_direction(array))
    // console.log(iconFind(array))
    // console.log(humidityMax(array))
    // console.log(weatherDate(array))
}
function avg (array){
    var temptotal = 0
    array.forEach((element, index) => {
        temptotal = temptotal + element.main.temp
        if (index==array.length-1) {
            let tempavg = temptotal/array.length
            console.log(tempavg)
            return tempavg
        }
    });
}
function weatherDate(array){
    var date = new Date(array[1].dt*1000).toLocaleDateString("en-AU")
    console.log(date)
    return date
}

function mostfrequent (array){
    var mf = 1;
    var m = 0;
    var item;
    for (var i=0; i<array.length; i++){
            for (var j=i; j<array.length; j++){
                    if (array[i] == array[j])
                    m++;
                    if (mf<m){
                    mf=m; 
                    item = array[i];
                    }
            }
            m=0;
    }
    //console.log(item) ;
    return item;
    }

function wind_direction (array){
    var degarray = []
    //console.log(array)
    array.forEach((element, index) => {
        let gustdir = element.wind.deg
        if (0<=gustdir<22.5 || 337.5<=gustdir<=360) {
            degarray.push("N")
        }
        else if (22.5<=gustdir<67.5) {
            degarray.push("NE")
        }
        else if (67.5<=gustdir<112.5) {
            degarray.push("E")
        }
        else if (112.5<=gustdir<157.5) {
            degarray.push("SE")
        }
        else if (157.5<=gustdir<202.5) {
            degarray.push("S")
        }
        else if (202.5<=gustdir<247.5) {
            degarray.push("SW")
        }
        else if (247.5<=gustdir<292.5) {
            degarray.push("W")
        }
        else if (292.5<=gustdir<337.5) {
            degarray.push("NW")
        };

        if (index==array.length-1){
            //console.log(degarray)
            mostfrequent(degarray)
            console.log(mostfrequent(degarray))
            return mostfrequent(degarray)
        }
    })

}
function wind_speed (array){
    var windtotal = 0
    array.forEach((element, index) => {
        windtotal = windtotal + element.wind.speed
        if (index==array.length-1) {
            let windavg = windtotal/array.length
            console.log(windavg)
            return windavg
        }
    });
}
function wind_gust (array){
    var gustarray = []
    array.forEach((element, index) => {
        let gustvalue = element.wind.gust
        gustarray.push(gustvalue)
        if (index==array.length-1) {
            gustarray.sort((a,b)=>a-b)
            //console.log(gustarray)
            console.log(gustarray[gustarray.length - 1])
            return (gustarray[gustarray.length - 1])
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
            //console.log(tempsarray)
            console.log(tempsarray[tempsarray.length - 1])
            return (tempsarray[tempsarray.length - 1])
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
            //console.log(tempsarray)
            console.log(tempsarray[tempsarray.length - 1])
            return (tempsarray[tempsarray.length - 1])
        }
    });
 }

function iconFind (array) {
    var iconarray = []
    array.forEach((element, index) => {
        let icon = element.weather[0].icon
        iconarray.push(icon)
        if (index==array.length-1) {
            mostfrequent(iconarray)
            console.log(mostfrequent(iconarray))
            return mostfrequent(iconarray)
        }
    });
}
function humidityMax (array) {
    var humidarray = []
    array.forEach((element, index) => {
        let humidvalue = element.main.humidity
        humidarray.push(humidvalue)
        if (index==array.length-1) {
            humidarray.sort((a,b)=>a-b)
            //console.log(humidarray)
            console.log(humidarray[humidarray.length - 1])
            return (humidarray[humidarray.length - 1])
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
  