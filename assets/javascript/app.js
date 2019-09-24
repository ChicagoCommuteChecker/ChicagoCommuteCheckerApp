var chicagoMetroZips = ["60601", "60602", "60603", "60604", "60605", "60606", "60607", "60608", "60609", "60610", "60611", "60612", "60613", "60614", "60615", "60616", "60617", "60618", "60619", "60620", "60621", "60622", "60623", "60624", "60625", "60626", "60628", "60629", "60630", "60631", "60632", "60633", "60634", "60636", "60637", "60638", "60639", "60640", "60641", "60642", "60643", "60644", "60645", "60646", "60647", "60649", "60651", "60652", "60653", "60654", "60655", "60656", "60657", "60659", "60660", "60661", "60664", "60666", "60668", "60669", "60670", "60673", "60674", "60675", "60677", "60678", "60680", "60681", "60682", "60684", "60685", "60686", "60687", "60688", "60689", "60690", "60691", "60693", "60694", "60695", "60696", "60697", "60699", "60701", "60706", "60707", "60803", "60804", "60805", "60827", "60130", "60201", "60202", "60203", "60204", "60208", "60076", "60077", "60301", "60302", "60303", "60304", "60501", "60804", "60402", "60546", "60018", "60019", "60091"]
var blueLineInfo = {
    OHare: {
        zip: 60666,
        stationIDs: [30171.30172]
    },
    Rosemont: {
        zip: 60018,
        stationIDs: [30159,30160]
    },
    Cumberland: {
        zip: 60631,
        stationIDs: [30044,30045]
    },
    HarlemOHare: {
        zip: 60656,
        stationIDs: [30145,30146]
    },
    JeffersonPark: {
        zip: 60630,
        stationIDs: [30247,30248]
    },
    Montrose: {
        zip: 60641,
        stationIDs: [30259,30260]
    },
    IrvingPark: {
        zip: 60613,
        stationIDs: [30107,30108]
    },
    Addison: {
        zip: 60618,
        stationIDs: [30239,30240]
    },
    Belmont: {
        zip: 60618,
        stationIDs: [30012,30013]
    },
    LoganSquare: {
        zip: 60647,
        stationIDs: [30197,30198]
    },
    California: {
        zip: 60647,
        stationIDs: [30111,30112]
    },
    WesternOHare: {
        zip: 60647,
        stationIDs: [30129,30130]
    },
    Damen: {
        zip: 60622,
        stationIDs: [30115,30116]
    },
    Division: {
        zip: 60622,
        stationIDs: [30062,30063]
    },
    Chicago: {
        zip: 60622,
        stationIDs: [30271,30272]
    },
    Grand: {
        zip: 60622,
        stationIDs: [30095,30096]
    },
    ClarkLake: {
        zip: 60601,
        stationIDs: [30375,30374]
    },
    Washington: {
        zip: 60602,
        stationIDs: [30072,30073]
    },
    Monroe: {
        zip: 60603,
        stationIDs: [30153,30154]
    },
    Jackson: {
        zip: 60604,
        stationIDs: [30014,30015]
    },
    LaSalle: {
        zip: 60605,
        stationIDs: [30261,30262]
    },
    Clinton: {
        zip: 60607,
        stationIDs: [30084,30085]
    },
    UICHalsted: {
        zip: 60607,
        stationIDs: [30068,30069]
    },
    Racine: {
        zip: 60607,
        stationIDs: [30092,30093]
    },
    IllMedDistrict: {
        zip: 60612,
        stationIDs: [30157,30158]
    },
    WesternForestPark: {
        zip: 60612,
        stationIDs: [30042,30043]
    },
    KedzieHoman: {
        zip: 60612,
        stationIDs: [30048,30049]
    },
    Pulaski: {
        zip: 60612,
        stationIDs: [30179,30180]
    },
    Cicero: {
        zip: 60644,
        stationIDs: [30187,30188]
    },
    Austin: {
        zip: 60304,
        stationIDs: [30001,30002]
    },
    OakPark: {
        zip: 60304,
        stationIDs: [30034,30035]
    },
    HarlemForestPark: {
        zip: 60130,
        stationIDs: [30189,30190]
    },
    ForestPark: {
        zip: 60130,
        stationIDs: [30076,30077]
    }
}
var badWeather = ["Rain", "Thunderstorm", "Snow", "Ash", "Squall", "Tornado"];
var commuteRec;
var currentWeather;
var futureWeather;
var ctaInfo;
var FTemp;
var futureCommuteRecArray = [];

//Based on converter found on w3schools
function temperatureConverter(valNum) {
  valNum = parseFloat(valNum);
  FTempFloat = ((valNum-273.15)*1.8)+32;
  FTemp = parseInt(FTempFloat);
// console.log(FTemp)
//   return FTemp
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
                temperatureConverter(currentWeather.main.temp);
                if (ctaInfo) {
                    if ((badWeather.includes(currentWeather.weather[0].main)) || (FTemp < 32) || (ctaInfo.CTARoutes.RouteInfo.RouteStatus !== ("Normal Service" || "Planned Service"))){
                        commuteRec = "Work from home if you can.";
                    } else {
                        commuteRec = "Enjoy your commute.";
                    } console.log(commuteRec);
                    console.log(ctaInfo.CTARoutes.RouteInfo.RouteStatus);
                } 
                
                var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&appid=4df0823f371a314fac922d45729a9495";
                $.ajax({
                    url: fiveDayQueryURL,
                    method: "GET"
                }).then(function (futureResponse) {
                    futureWeather = futureResponse;
                    console.log(futureWeather);
                    futureCommuteRecArray = [];
                    for (var i = 0; i < futureWeather.list.length; i++) {
                        var IFTemp = temperatureConverter(futureWeather.list[i].main.temp);
                        if ((badWeather.includes(futureWeather.list[i].weather[0].main)) || (IFTemp < 32)) {
                            commuteFutureRec = "Probably work from home.";
                            futureCommuteRecArray.push(commuteFutureRec);
                        } else {
                            commuteFutureRec = "Commute's looking good.";
                            futureCommuteRecArray.push(commuteFutureRec);
                        } 
                    } 
                    console.log(futureCommuteRecArray);

                    $("#weatherInfo").append("<tr><td>" + FTemp +"</td><td>" + currentWeather.weather[0].description + "</td><td>" + ctaInfo.CTARoutes.RouteInfo.RouteStatus + "</td><td>" +
                                  commuteRec + "</td></tr>");

                })
            })
        })

        

    } else {
        console.log("I'm not in the array.")
        // Here we can put some sort of prompt asking the user to input a chicago zip
    }

});
