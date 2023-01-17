var geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
var apiKey = "349c7d3f61d7183379a35bc8f017e1ee";
//var apiKey = "b3394aa5da9ad83a9e8db42a82e93e76";
var userinput = "Sydney";
var lastsearch;
var searchbtn = document.getElementById("searchbtn")
var searchbox = document.getElementById("searchcontent")
var pastsearch = JSON.parse(localStorage.getItem("PreviousCities"))
function fillbutton(){
    if (pastsearch !== null ) {
    let reversed = pastsearch.reverse()
    reversed.forEach((element, i) => {
        $(`#btn-${i}`).html(`${element}`)
        $(`#btn-${i}`).removeClass("hidden")
    });}
}

function getlastsearch() {
    var previousCity = localStorage.getItem("lastsearch");
    if (previousCity !== null) {
    lastsearch = previousCity
    } else {
    lastsearch = "Sydney";
    localStorage.setItem("lastsearch", lastsearch)
    }
    }
    
getlastsearch()

function getCoords (cityName){
    console.log(cityName)
    fetch (`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        console.log(data)
 
        var lat = data[0].lat
        var lon = data[0].lon

        getWeather(lat, lon)
    })

}
function getWeather (lat, lon){
 fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
 .then(function (response){
    return response.json();
})
.then(function (data) {
    let day = 8
    var temp = data.list
    let cycle = 0
    //console.log(temp)
    var dayoneweather = temp.slice(0, 5)
    let maincard = createCard(dayoneweather)
    console.log(maincard)
    fillcard(maincard, "m")
    $(`#cityEl`).html(`Weather Dashboard: ${userinput}`)
    fillbutton()
    for (var index = 5; index < temp.length; index+= day) {
        let fourdayweather = temp.slice(index, index+8)
        //console.log(fourdayweather)
        let subcard = createCard(fourdayweather)
        console.log(subcard)
        fillcard(subcard, cycle)
        cycle++
    }
})
}
function fillcard(card, i){
        $(`#iconEl-${i}`).attr("src", `https://openweathermap.org/img/wn/${card.weathericon}@2x.png`)
        $(`#averageEl-${i}`).html(`Average temperature: ${card.temperature.toFixed(2)}°C`)
        $(`#maxEl-${i}`).html(`Maximum temperature: ${card.maximum.toFixed(2)}°C`)
        $(`#minEl-${i}`).html(`Minimun temperature: ${card.minimum.toFixed(2)}°C`)
        $(`#gustEl-${i}`).html(`Gust speed: ${card.gustspeed.toFixed(2)}m/s`)
        $(`#windEl-${i}`).html(`Wind speed: ${card.windspeed.toFixed(2)}m/s`)
        $(`#directionEl-${i}`).html(`Wind direction: ${card.winddirection}`)
        $(`#humidityEl-${i}`).html(`Humidity: ${card.dayhumidity.toFixed(2)}%`)
        $(`#dateEl-${i}`).html(`${card.weatherdate}`)
}

function createCard(array){
    //console.log(array)
    let average = avg(array)
    let max = max_temp(array)
    let min = min_temp(array)
    let wind = wind_speed(array)
    let gust = wind_gust(array)
    let direction = wind_direction(array)
    let icon = iconFind(array)
    let humid = humidityMax(array)
    let day = weatherDate(array)
    let card = 
        {
            temperature: average,
            maximum: max,
            minimum: min,
            windspeed: wind,
            gustspeed: gust,
            winddirection: direction,
            weathericon: icon,
            dayhumidity: humid,
            weatherdate: day
        }
    
    //console.log(card)
    return card
}
function avg (array){
    var temptotal = 0
    var tempavg;
    array.forEach((element, index) => {
        temptotal = temptotal + element.main.temp
        if (index==array.length-1) {
            tempavg = temptotal/array.length
            //console.log(tempavg)
        } 
    });
    return tempavg
}
function weatherDate(array){
    var date = new Date(array[1].dt*1000).toLocaleDateString("en-AU")
    //console.log(date)
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
    if (item !== "undefined"){
        console.log("item1")
        return item;
    } else {
    var item2 = array[(array.length/2).toFixed(0)]
    console.log("item2")
    return item2;
    }
}
function wind_direction (array){
    var degarray = []
    var result;
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
            result = mostfrequent(degarray)
            //console.log(mostfrequent(degarray))
        }
    }); return result
}
function wind_speed (array){
    var windtotal = 0
    var windavg
    array.forEach((element, index) => {
        windtotal = windtotal + element.wind.speed
        if (index==array.length-1) {
            windavg = windtotal/array.length
            //console.log(windavg)
            
        }
    }); return windavg
}
function wind_gust (array){
    var gustarray = []
    var gustmax
    array.forEach((element, index) => {
        let gustvalue = element.wind.gust
        gustarray.push(gustvalue)
        if (index==array.length-1) {
            gustarray.sort((a,b)=>a-b)
            //console.log(gustarray)
            gustmax = gustarray[gustarray.length - 1]
            
        }
    }); return gustmax
}
 function max_temp(array){
    var tempsarray = []
    var tempmax;
    array.forEach((element, index) => {
        let tempvalue = element.main.temp
        tempsarray.push(tempvalue)
        if (index==array.length-1) {
            tempsarray.sort((a,b)=>a-b)
            //console.log(tempsarray)
            tempmax = tempsarray[tempsarray.length - 1]
        }
    }); return tempmax
 }

 function min_temp(array){
    var tempsarray = []
    var tempmin;
    array.forEach((element, index) => {
        let tempvalue = element.main.temp
        tempsarray.push(tempvalue)
        if (index==array.length-1) {
            tempsarray.sort((a,b)=>b-a)
            //console.log(tempsarray)
           tempmin = tempsarray[tempsarray.length - 1]
        }
    }); return tempsarray[tempsarray.length - 1]
 }

function iconFind (array) {
    var iconarray = []
    var iconFinal
    array.forEach((element, index) => {
        let icon = element.weather[0].icon
        iconarray.push(icon)
        if (index==array.length-1) {
            iconFinal = mostfrequent(iconarray)
            //console.log(mostfrequent(iconarray))           
        }
    }); return iconFinal
}
function humidityMax (array) {
    var humidarray = []
    var humidfinal;
    array.forEach((element, index) => {
        let humidvalue = element.main.humidity
        humidarray.push(humidvalue)
        if (index==array.length-1) {
            humidarray.sort((a,b)=>a-b)
            //console.log(humidarray)
            humidfinal = humidarray[humidarray.length - 1]
        }
    }); return humidfinal
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
    if (previousCities.includes(search)){
        previousCities.remove(search)
        previousCities.push(search)
    } else {
        previousCities.push(search)
    }
    
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

function reSearch (){
    userinput = this.innerHTML
    citySelectFromSearch()
    location.reload
}
var searchbtn0 = document.getElementById("btn-0")
var searchbtn1 = document.getElementById("btn-1")
var searchbtn2 = document.getElementById("btn-2")
var searchbtn3 = document.getElementById("btn-3")
var searchbtn4 = document.getElementById("btn-4")
var searchbtn5 = document.getElementById("btn-5")
var searchbtn6 = document.getElementById("btn-6")
var searchbtn7 = document.getElementById("btn-7")
searchbtn0.addEventListener('click', reSearch);
searchbtn1.addEventListener('click', reSearch);
searchbtn2.addEventListener('click', reSearch);
searchbtn3.addEventListener('click', reSearch);
searchbtn4.addEventListener('click', reSearch);
searchbtn5.addEventListener('click', reSearch);
searchbtn6.addEventListener('click', reSearch);
searchbtn7.addEventListener('click', reSearch);