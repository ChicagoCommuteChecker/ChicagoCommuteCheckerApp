$(".button").on("click", function() {

    var queryURL =  "https://www.transitchicago.com/api/1.0/routes.aspx?routeid=" +$(this).attr("id") +"&outputType=JSON"
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
    })
  })

  


