
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
		htmlString = '<h1>House Bills</h1>' + billsToHTML(billsArray)
	houseColumn.innerHTML = htmlString
}

var senateResponseHandler = function(apiResponse){
	console.log(apiResponse.results)
	var billsArray = apiResponse.results,
		htmlString = '<h1>Senate Bills</h1>' + billsToHTML(billsArray)
	senateColumn.innerHTML = htmlString
}

var fetchSenateBills = function(searchQuery) {
	var url = baseUrl + '&chamber=senate&query=' + searchQuery
	var promise = $.getJSON(url)
	promise.then(senateResponseHandler)
}

var fetchHouseBills = function(searchQuery) {
	var url = baseUrl + '&chamber=house&query=' + searchQuery
	var promise = $.getJSON(url)
	promise.then(houseResponseHandler)
}

var search = function(event){
	if(event.keyCode === 13){
		var searchQuery = event.target.value
		location.hash = searchQuery
		event.target.value = ""
	}

}

var BillRouter = Backbone.Router.extend({
	routes:{
		"*default": "handleHome",
		"search/:term": "handleSearch"
	},
	handleHome: function(){
		billsContainer.innerHTML = "<h1>Welcome to bill search!</h1>"

	},
	initialize: function(){
		Backbone.history.start()
	}
})
var router = new BillRouter()

inputNode.addEventListener('keydown', search)

