// This array holds types of weather bad enough to trigger a work from home recommendation.
var badWeather = ["Rain", "Thunderstorm", "Snow", "Ash", "Squall", "Tornado"];
// Establishing some global variables to use in later code.
var commuteRec;
var currentWeather;
var futureWeather;
var ctaInfo;
var FTemp;
var IFTemp;
var zipCode;
var trainchoice;

//Based on converter found on w3schools
function temperatureConverter(valNum) {
    valNum = parseFloat(valNum);
    FTempFloat = ((valNum - 273.15) * 1.8) + 32;
    return parseInt(FTempFloat);

}

// The items in this function are related to Materilize functionality.
$(document).ready(function () {
    $('.slider').slider();
    $('.modal').modal();
    $('select').formSelect();
});

// This function generates the pulldown menu of stations the user can select, based on the data in trainLineData associated with the train line they chose.
function PullDown(array) {
    $("#stationmenu").empty();
    for (let i = 0; i < array.length; i++) {
        let answerValue = i;
        let answerText = array[i].name;
        $("#stationmenu").append("<option value='" + answerValue + "'>" + answerText + "</option>")
    }
};

$("#trainmenu").on("change", function (event) {
    event.preventDefault();
    trainchoice = $("#trainmenu").val();
    switch (trainchoice) {
        case "blue":
            PullDown(blueLineInfo);
            break;
        case "red":
            PullDown(redLineInfo);
            break;
        case "org":
            PullDown(orangeLineInfo);
            break;
        case "brn":
            PullDown(brownLineInfo);
            break;
        case "g":
            PullDown(greenLineInfo);
            break;
        case "p":
            PullDown(purpleLineInfo);
            break;
        case "pink":
            PullDown(pinkLineInfo);
            break;
        case "y":
            PullDown(yellowLineInfo);
            break;
    }
    $("#station-submit").removeClass("hide");
    $("#stationmenu").removeClass("hide");
})

$(".submitButton").on("click", function (event) {
    event.preventDefault();
    var station = $("#stationmenu").val().toString();
    trainchoice = $("#trainmenu").val();
    // With this switch, we're assigning the zipcode of the train station selected as the one we will use for grabbing weather info.
    switch (trainchoice) {
        case "blue":
            zipCode = blueLineInfo[station].zip;
            break;
        case "red":
            zipCode = redLineInfo[station].zip;
            break;
        case "org":
            zipCode = orangeLineInfo[station].zip;
            break;
        case "brn":
            zipCode = brownLineInfo[station].zip;
            break;
        case "g":
            zipCode = greenLineInfo[station].zip;
            break;
        case "p":
            zipCode = purpleLineInfo[station].zip;
            break;
        case "pink":
            zipCode = pinkLineInfo[station].zip;
            break;
        case "y":
            zipCode = yellowLineInfo[station].zip;
            break;
    }
    apiAndTextMaker();
});

function apiAndTextMaker() {
    // First, we check the status of the train line the user selected, to see if there are any alerts.
    var queryURL = "https://cors-anywhere.herokuapp.com/https://www.transitchicago.com/api/1.0/routes.aspx?routeid=" + trainchoice + "&outputType=JSON";
    // console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (CTAresponse) {
        ctaInfo = CTAresponse;
        // Next we do our API call to Openweather's current weather API. Our API calls are nested so javascript doesn't attempt to display new text to the DOM until all our data has come back from the calls.
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&appid=4df0823f371a314fac922d45729a9495";
        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function (currentResponse) {
            currentWeather = currentResponse;
            //Since Openweather returns temperature in Kelvin, we need to convert it to Fahrenheit.
            FTemp = temperatureConverter(currentWeather.main.temp);
            // Here we determine whether the user should commute, based on weather conditions, temperature, and CTA route status.
            if (ctaInfo) {
                if ((badWeather.includes(currentWeather.weather[0].main)) || (FTemp < 32) || (ctaInfo.CTARoutes.RouteInfo.RouteStatus !== ("Normal Service" || "Planned Service"))) {
                    commuteRec = "Work from home if you can.";
                } else {
                    commuteRec = "Enjoy your commute.";
                }
            }
            // Here we make out API call to Openweather's 5 day/3 hour forecast API.
            var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&appid=4df0823f371a314fac922d45729a9495";
            $.ajax({
                url: fiveDayQueryURL,
                method: "GET"
            }).then(function (futureResponse) {
                futureWeather = futureResponse;
                futureCommuteRecArray = [];
                $("#futureWeatherDisplay").empty();
                for (var i = 0; i < futureWeather.list.length; i++) {
                    // Again, need to convert to Fahrenheit.
                    IFTemp = temperatureConverter(futureWeather.list[i].main.temp);
                    var displayTime = moment(futureWeather.list[i].dt_txt).format("MMMM Do YYYY, h:mm:ss a");
                    // Here we determine our recommendation for future commute conditions. This function DOESN'T include CTA status, since we can't predict train conditions that far ahead.
                    if ((badWeather.includes(futureWeather.list[i].weather[0].main)) || (IFTemp < 32)) {
                        commuteFutureRec = "Probably work from home.";
                    } else {
                        commuteFutureRec = "Commute's looking good.";
                    }
                    // Here we write our future data to the DOM to display in its own modal.
                    $("#futureWeatherDisplay").append("<tr><td>" + displayTime + "</td><td>" + IFTemp + " °F" + "</td><td>" + futureWeather.list[i].weather[0].description + "</td><td>" + commuteFutureRec + "</td></tr>")
                }
                $("#weatherInfo").empty();
                // Here we write current commute conditions to the table on the DOM.
                $("#weatherInfo").append("<tr><td>" + FTemp + " °F" + "</td><td>" + currentWeather.weather[0].description + "</td><td>" + ctaInfo.CTARoutes.RouteInfo.RouteStatus + "</td><td>" +
                    commuteRec + "</td></tr>");
            })
        })
    })
}