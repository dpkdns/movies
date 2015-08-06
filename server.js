var express=require('express');
var google=require('./google.js');
var app = express();

app.get('/movies/:city', function(req,res) {
	google.movies(res, req.params.city);
});

app.get('/railways/pnr/:pnr', function(req, res) {
	google.railways_pnr(res, req.params.pnr);
})

app.listen(process.env.PORT || 8080);
