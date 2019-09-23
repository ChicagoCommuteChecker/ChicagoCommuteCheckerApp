var chicagoMetroZips = ["60601", "60602", "60603", "60604", "60605", "60606", "60607", "60608", "60609", "60610", "60611", "60612", "60613", "60614", "60615", "60616", "60617", "60618", "60619", "60620", "60621", "60622", "60623", "60624", "60625", "60626", "60628", "60629", "60630", "60631", "60632", "60633", "60634", "60636", "60637", "60638", "60639", "60640", "60641", "60642", "60643", "60644", "60645", "60646", "60647", "60649", "60651", "60652", "60653", "60654", "60655", "60656", "60657", "60659", "60660", "60661", "60664", "60666", "60668", "60669", "60670", "60673", "60674", "60675", "60677", "60678", "60680", "60681", "60682", "60684", "60685", "60686", "60687", "60688", "60689", "60690", "60691", "60693", "60694", "60695", "60696", "60697", "60699", "60701", "60706", "60707", "60803", "60804", "60805", "60827", "60130", "60201", "60202", "60203", "60204", "60208", "60076", "60077", "60301", "60302", "60303", "60304", "60501", "60804", "60402", "60546", "60018", "60019", "60091"]
var badWeather = ["shower rain", "rain", "thunderstorm", "snow"];
var commuteRec;
var currentWeather;
var futureWeather;
var ctaInfo;


function temperatureConverter(valNum) {
  valNum = parseFloat(valNum);
  document.getElementById("outputFahrenheit").innerHTML=((valNum-273.15)*1.8)+32;
}

$(document).ready(function () {
    $('.slider').slider();
    $('.modal').modal();
    $('select').formSelect();

});

$("#submitButton").on("click", function (event) {
    event.preventDefault();
    
    var zipCode = $("#inputFormID").val().trim();
    console.log(zipCode);
    if (chicagoMetroZips.includes(zipCode)) {
        var trainchoice = $("#trainmenu").val();
        var queryURL = "https://cors-anywhere.herokuapp.com/https://www.transitchicago.com/api/1.0/routes.aspx?routeid=" +trainchoice +"&outputType=JSON";
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(CTAresponse) {
          ctaInfo = CTAresponse;
          console.log(ctaInfo);
          var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&appid=4df0823f371a314fac922d45729a9495";
            $.ajax({
                url: weatherQueryURL,
                method: "GET"
            }).then(function (currentResponse) {
                currentWeather = currentResponse;
                console.log(currentWeather);
                if (ctaInfo) {
                    if ((badWeather.includes(currentWeather.weather[0].description)) || (currentWeather.main.temp > 273.15) || (ctaInfo.CTARoutes.RouteInfo.RouteStatus !== ("Planned Work" || "Normal Service"))) {
                        commuteRec = "Stay Home";
                    } else {
                        commuteRec = "Enjoy your commute";
                    } console.log(commuteRec);
                }
            })

            var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&appid=4df0823f371a314fac922d45729a9495";
            $.ajax({
                url: fiveDayQueryURL,
                method: "GET"
            }).then(function (futureResponse) {
                futureWeather = futureResponse;
                console.log(futureWeather);
            })
        })

        

    } else {
        console.log("I'm not in the array.")
        // Here we can put some sort of prompt asking the user to input a chicago zip
    }

});
