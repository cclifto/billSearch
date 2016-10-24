
console.log($)
console.log(Backbone)

	
	var inputNode = document.querySelector('input'),
		billsContainer = document.querySelector('.bills-container'),
		baseUrl = "https://congress.api.sunlightfoundation.com/bills/search?apikey=149a2a8730aa4936bab76017c47d8dab&callback=?"

var billsToHTML = function(billsArray){
	var htmlString = ''
	for(var i = 0; i < billsArray.length; i++){
		console.log(billsArray[i])
		var billDetails = billsArray[i]
		// if (billDetails.short_title) {
		// 	var title = billDetails.short_title
		// }
		// else {
		// 	var title = billDetails.bill_id
		// } ternary syntax below replaces all this logic
		htmlString += '<div class="bill">'
		htmlString += '<h2>' + (billDetails.short_title ? billDetails.short_title : billDetails.bill_id) + '</h2>'
		htmlString += '<h3>' + billDetails.official_title + '</h3>'
		htmlString += '<h5>' + billDetails.sponsor.first_name + " " + billDetails.sponsor.last_name + '</h5>'
		htmlString += '<h6>Introduced On: ' + billDetails.introduced_on + '</h6>'
		htmlString += '<h6>Last Action At: ' + billDetails.last_action_at + '</h6>'
		htmlString += '<h6><a href="' + billDetails.urls.govtrack +'">Click here to read bill</a></h6>'
		htmlString += '<h6>'+ billDetails.bill_id + '</h6>'  
// <a href="/" target="_blank">The home page will open in another tab.</a>
		htmlString += '</div>'
		//we should build the full htmlString and then write to innerHTML
		//only once
	}
	return htmlString
}

var houseResponseHandler = function(apiResponse){
	console.log(apiResponse.results)
	var billsArray = apiResponse.results,
		houseColNode = document.querySelector(".house-bills"),
		htmlString = ""

	htmlString += 	'<h1>House Bills</h1>'
	htmlString += 	billsToHTML(billsArray)
	houseColNode.innerHTML = htmlString
}

var senateResponseHandler = function(apiResponse){
	console.log(apiResponse.results)
	var billsArray = apiResponse.results,
		senateColNode = document.querySelector(".senate-bills"),
		htmlString = ""

	htmlString += 	'<h1>Senate Bills</h1>'
	htmlString += 	billsToHTML(billsArray)
	senateColNode.innerHTML = htmlString
}

var fetchSenateBills = function(searchQuery) {
	var url = baseUrl + '&chamber=senate&query=' + searchQuery
	var promise = $.getJSON(url)
	return promise
}

var fetchHouseBills = function(searchQuery) {
	var url = baseUrl + '&chamber=house&query=' + searchQuery
	var promise = $.getJSON(url)
	return promise
}

var search = function(event){
	if(event.keyCode === 13){
		var searchQuery = event.target.value
		location.hash = "search/" + searchQuery
		event.target.value = ""
	}

}

var makeColumns = function(){
	billsContainer.innerHTML = "<div class='bill-col senate-bills'></div>"
	billsContainer.innerHTML += "<div class='bill-col house-bills'></div>"
}

//CONTROLLER
var BillRouter = Backbone.Router.extend({
	routes:{
		"home": "handleHome",
		"search/:term": "handleSearch",
		"*default": "handleDefault"
	},
	handleHome: function(){
		billsContainer.innerHTML = "<h1>Welcome to bill search!</h1>"

	},
	handleSearch: function(term) {
		//MODEL
		console.log("running handleSearch")
		//here we request data that we need
		var housePromise = fetchHouseBills(term),
			senatePromise = fetchSenateBills(term)

		//VIEW
		//sets up two empty divs for senate/house bill columns
		makeColumns()
		//builds html of each column from received data
		housePromise.then(houseResponseHandler)
		senatePromise.then(senateResponseHandler)
	},
	handleDefault: function() {
		location.hash = "home"
	},
	initialize: function(){
		Backbone.history.start()
	}
})
var router = new BillRouter()

inputNode.addEventListener('keydown', search)

