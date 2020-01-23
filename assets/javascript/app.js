
// This array holds then zip for Chicago and every suburb directly served by the CTA. We'll use it later to verify that the user has entered a zipcode near the CTA.
var chicagoMetroZips = ["60601", "60602", "60603", "60604", "60605", "60606", "60607", "60608", "60609", "60610", "60611", "60612", "60613", "60614", "60615", "60616", "60617", "60618", "60619", "60620", "60621", "60622", "60623", "60624", "60625", "60626", "60628", "60629", "60630", "60631", "60632", "60633", "60634", "60636", "60637", "60638", "60639", "60640", "60641", "60642", "60643", "60644", "60645", "60646", "60647", "60649", "60651", "60652", "60653", "60654", "60655", "60656", "60657", "60659", "60660", "60661", "60664", "60666", "60668", "60669", "60670", "60673", "60674", "60675", "60677", "60678", "60680", "60681", "60682", "60684", "60685", "60686", "60687", "60688", "60689", "60690", "60691", "60693", "60694", "60695", "60696", "60697", "60699", "60701", "60706", "60707", "60803", "60804", "60805", "60827", "60130", "60201", "60202", "60203", "60204", "60208", "60076", "60077", "60301", "60302", "60303", "60304", "60501", "60804", "60402", "60546", "60018", "60019", "60091"]
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
    if (trainchoice == "blue") {
        PullDown(blueLineInfo);
        $("#station-submit").removeClass("hide");
        $("#stationmenu").removeClass("hide");
        if ($("#train-submit").attr("class") != "hide") {
            $("#train-submit").addClass("hide");
        }
    } else if (trainchoice == "red") {
        PullDown(redLineInfo);
        $("#station-submit").removeClass("hide");
        $("#stationmenu").removeClass("hide");
        if ($("#train-submit").attr("class") != "hide") {
            $("#train-submit").addClass("hide");
        }
    } else if (trainchoice == "org") {
        PullDown(orangeLineInfo);
        $("#station-submit").removeClass("hide");
        $("#stationmenu").removeClass("hide");
        if ($("#train-submit").attr("class") != "hide") {
            $("#train-submit").addClass("hide");
        }
    } else if (trainchoice == "brn") {
        PullDown(brownLineInfo);
        $("#station-submit").removeClass("hide");
        $("#stationmenu").removeClass("hide");
        if ($("#train-submit").attr("class") != "hide") {
            $("#train-submit").addClass("hide");
        }
    } else if (trainchoice == "g") {
        PullDown(greenLineInfo);
        $("#station-submit").removeClass("hide");
        $("#stationmenu").removeClass("hide");
        if ($("#train-submit").attr("class") != "hide") {
            $("#train-submit").addClass("hide");
        }
    } else {
        $("#train-submit").removeClass("hide");
        if ($("#station-submit").attr("class") != "hide") {
            $("#station-submit").addClass("hide");
        }
        if ($("#stationmenu").attr("class") != "hide") {
            $("#stationmenu").addClass("hide");
        }
    }
})

$(".submitButton").on("click", function (event) {
    event.preventDefault();
    // console.log(this);
    var whichButton = ($(this).attr("id"));
    if (whichButton === "standardSubmit") {
        zipCode = $("#inputFormID").val().trim();
        trainchoice = $("#trainmenu").val();
        // console.log(zipCode);
        apiAndTextMaker();
    } else {
        var station = $("#stationmenu").val().toString();
        trainchoice = $("#trainmenu").val();
        if (trainchoice == "blue") {
            zipCode = blueLineInfo[station].zip;
        } else if (trainchoice == "red") {
            zipCode = redLineInfo[station].zip;
        } else if (trainchoice == "org") {
            zipCode = orangeLineInfo[station].zip;
        } else if (trainchoice == "brn") {
            zipCode = brownLineInfo[station].zip;
        } else if (trainchoice == "g") {
            zipCode = greenLineInfo[station].zip;
        }
        apiAndTextMaker();
    }
});

function apiAndTextMaker() {
    if (chicagoMetroZips.includes(zipCode)) {
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



    } else {
        // This piece of code asks the user to input a different zip if what they entered isn't found in our zipcode array.
        $("#inputFormID").val("");
        $("#inputFormID").attr("placeholder", "Please enter a valid CTA Zipcode")
    }
}