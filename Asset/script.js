var APIKey = '9ef870d39d3f42dc1045c977c074e6bb';
var city = "New York";
// Grabs the current time and date
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS');

var cityList = [];
$('.search').on('click', function (event) {
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('.textVal').val().trim(); 
    if (city === "") {
        return;
    };
    cityList.push(city);

    localStorage.setItem('city', JSON.stringify(cityList));
    fiveForecastEl.empty();
    getHistory();
    getWeatherToday();
     
});

// Create buttons based on search

var conHistEl = $('.cityList');
function getHistory() {
    conHistEl.empty();

    for (let i = 0; i < cityList.length; i++) {
        var rowEl = $('<row>');
        var btnEl = $('<button>').text(`${cityList[i]}`);

        rowEl.addClass('row histBtnRow');
        btnEl.addClass('btn btn-outline-secondary histBtn');
        btnEl.attr('type', 'button');

        conHistEl.prepend(rowEl);
        rowEl.append(btnEl);
    }   if (!city) {
        return;
    }
    // Allows button to start search
    $('.histBtn').on("click", function (event) {
        event.preventDefault();
        city = $(this).text();
        fiveForecastEl.empty();
        getWeatherToday();
    });
};

// Grab the main 'Today' card body
var cardTodayBody = $('.cardBodyToday')
//Applies the weather data to the today card and then launches the five day forecast
function getWeatherToday() {
    var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

    $(cardTodayBody).empty();

    $.ajax({
        url: getUrlCurrent,
        method: 'GET',
    }).then(function (response) {
        
        $('.cardTodayCityName').text(response.name);
        $('.cardTodayDate').text(date);
        //Icons
        $('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
        // Temperature
        var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
        cardTodayBody.append(pEl);
        // Feels like
        var pElTemp = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
        cardTodayBody.append(pElTemp);
        // Humidity
        var pELHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
        cardTodayBody.append(pELHumid);
        // Wind speed
        var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
        cardTodayBody.append(pElWind);
        // Set the lat and long from the searched city
        var cityLongitude = response.coord.lon;
        var cityLatitude = response.coor.lat;

        var getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=hourly,dayly,minutely&appid=${APIKey}`;
        $.ajax({
            url: getUrlUvi,
            method: 'GET',
        }).then(function (response) {
            console.log("RESPONSE1: ", response);
            var pElUvi = $('<p>').text(`UV Index:`);
            var uviSpan = $('<span>').text(response.current.uvi);
            var uvi = response.current.uvi;
            pElUvi.append(uviSpan);
            cardTodayBody.append(pElUvi);
            // Set the UV index to match an exposure chart severity based on color
            if (uvi >= 0 && uvi <= 2) {
                uviSpan.attr('class', 'gren');
            } else if (uvi > 2 && uvi <= 5) {
                uviSpan.attr("class", "yellow")
            } else if (uvi > 5 && uvi <= 7) {
                uviSpan.attr("class", "orange")
            } else if (uvi > 7 && uvi <= 10) {
                uviSpan.attr("class", "red")
            } else {
                uviSpan.attr("class", "purple")
            }
        });
    });
     getFiveDayForecast();
};

var fiveForecastEl = $('.fiveForecast');

function getFiveDayForecast(fiveDayArray) {
     var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;

     $.ajax({
         url: getUrlFiveDay,
         method: 'GET'
     }).then(function (response) {
         console.log("RESPONSE2: ", response);
         var fiveDayArray = response.list;
     var myWeather = [];
        // Made an object that would allow for easier data read
        $.each(fiveDayArray, function (index, value) {
            testObj = {
                date: value.dt_txt.split(' ')[0],
                time: value.dt_txt.split(' ')[1],
                temp: value.main.feels_like,
                icon: value.weather[0].icon,
                humidity: value.main.humidity
            }

            if (value.dt_txt.split(' ')[1] === "12:00:00") {
                myWeather.push(testObj);
                console.log("MYWEATHER: ", myWeather)
            }
        })
        // Inject the card to the screen
        for (let i = 0; i < myWeather.length; i++) {
            var divElCard = $('<div>');
            divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
            divElCard.attr('style', 'max-width: 200px');
            var divElHeader = $('<div>');
            divElHeader.attr('class', 'card-header')
            var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
            var dateEl = $('<p>')
            dateEl.text(m);
            var divElBody = $('<div>');
            divElBody.attr('class', 'card-body');
            var divElIcon = $('<img>');
            divElIcon.attr('class', 'icons');
            divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
            // temp
            var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
            // Feels like
            var pElFeel = $('<p>').text(`Feels Like: ${myWeather[i].feels_like} °F`);
            // Humidity
            var pELHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);

            // Append date container into a div container
            divElHeader.append(dateEl);

            // Append contents into card container
            divElBody.append(divElIcon);
            divElBody.append(pElTemp);
            divElBody.append(pElFeel);
            divElBody.append(pELHumid);

            // Append date and card container into main container
            divElCard.append(divElHeader)
            divElCard.append(divElBody);

            // Append main contianer into parent container in the DOM
            fiveForecastEl.append(divElCard);
        }

     });

};

 function initload() {
     var citylistStore = JSON.parse(localStorage.getItem('city'));
     if (citylistStore !== null) {
         cityList = citylistStore
     }
     getHistory();
     getWeatherToday();
};

 initload();
