$(document).ready(function(){

  $(".button").on("click", function() {

      var queryURL = "https://www.transitchicago.com/api/1.0/routes.aspx?routeid=" +$(this).attr("id") +"&outputType=JSON"
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
      })
    })

  // Note. We'll need to make the selector here match the html once it gets added.
  // $("#submitButton").on("clickl", function(){
    
  //   var weatherQueryURL = "api.openweathermap.org/data/2.5/weather?zip=94040,us"

  // })


})