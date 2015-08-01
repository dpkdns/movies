var request=require('request');
var htmlparser=require('htmlparser');

var handler = new htmlparser.DefaultHandler(function (error, dom) {
    if (error)
    	console.log(error);
    else
    	console.log("Parse Success!!!!");
});
var parser = new htmlparser.Parser(handler);

var railways_pnr = function(res, pnr)
{
	var req = 
		{
			url : "http://www.indianrail.gov.in/cgi_bin/inet_pnstat_cgi_10521.cgi",
			form :
				{
					lccp_pnrno1 : "9876543211",
					answer : "54497",
					lccp_capinp_val : "54497"
				}
		}
		//http://www.indianrail.gov.in/valid.php
	request.post(req, function(error, response, body)
	{
		if (!error && response.statusCode == 200)
		{
			res.send(body);
		}
		else
		{
			console.log("Hello2");
			console.log(response.statusCode);
			res.send(error);
		}
	});
}

var movies = function(res, city)
{
	var url = "http://www.google.co.in/movies?near=" + city;
	request.get(url, function(error, response, body)
	{
		if (!error && response.statusCode == 200)
		{
			parser.parseComplete(body);
			//sys.puts(sys.inspect(handler.dom, false, null));
			var theater_elements = handler.dom[2].children[4].children[1].children[0].children;
			var theaters = [];
			for(var theater_index in theater_elements)
			{
				var movie_elements = theater_elements[theater_index].children[1].children[0].children;
				var movies = [];
				for(var movie_index in movie_elements)
				{
					var showtime_elements = movie_elements[movie_index].children[2].children;
					var showtimes = [];
					var index = 0;
					for(var showtime_index in showtime_elements)
					{
						showtimes[showtime_index] = showtime_elements[showtime_index].children[2].raw;
					}
					movies[movie_index] =
								{
									name : movie_elements[movie_index].children[0].children[0].children[0].raw,
									type : movie_elements[movie_index].children[1].children[0].raw,
									showtime : showtimes
								};

				}
				theaters[theater_index] =
								{
									name : theater_elements[theater_index].children[0].children[0].children[0].children[0].raw,
									address : theater_elements[theater_index].children[0].children[1].children[0].raw,
									movies : movies
								};
			}
			res.header('Content-Type', 'application/json').header('Access-Control-Allow-Origin', '*').send(theaters);
    		//res.send(body);
		}
	});
};

module.exports = {movies : movies, railways_pnr : railways_pnr};