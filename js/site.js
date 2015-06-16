window.APP = window.APP || {};

APP.original = (function($) {
	//Global Variables
	var start = Date.now(),
		intervalId,
		$countdown = {},
		dataObj = {};

	// Twitter config
	var displaylimit = 15,
		twitterprofile = "holeintheroof",
		screenname = "Hole in the Roof",
		showdirecttweets = true,
		showretweets = true,
		showtweetlinks = true,
		showprofilepic = true,
		showtweetactions = false,
		showretweetindicator = true,
		refresh = 600,
		param;

	function init() {
		//start = Date.now();

		//$('.panel > ul').fadeOut();
		//$('#site-feed, #twitter-feed, #rss-feed').empty();			

		//getWeather();
		//getTweets();

		//intervalId = setInterval(countdown, 1000);   
		//$('.panel > ul').fadeIn();
	}

	function getWeather() {
		var weatherAPI = '80b00f4027fe90911adb23c75d8317c4',
			forcast = '//api.openweathermap.org/data/2.5/forecast/daily?q=Waco&units=imperial&cnt=7&APPID='+weatherAPI,
			daily = '//api.openweathermap.org/data/2.5/weather?q=Waco,us&units=imperial&APPID='+weatherAPI;

		$('.weather').fadeOut();
		$('#forcast, #weather').empty();

		//single day weather
		$.ajax({
			dataType: "jsonp",
			url: daily,
			success: weatherData
		});

		//7 day forcast
		$.ajax({
			dataType: "jsonp",
			url: forcast,
			success: forcastData
		});

		function weatherData(data) {
			function getWindDir(wind){
				var windDir = '';

				if ((wind > 22.5) && (wind <= 67.5)) {
					windDir = 'NE';
				}
				else if ((wind > 67.5) && (wind <= 112.5)) {
					windDir = 'E';
				}
				else if ((wind > 112.5) && (wind <= 157.5)) {
					windDir = 'SE';
				}
				else if ((wind > 157.5) && (wind <= 202.5)) {
					windDir = 'S';
				}
				else if ((wind > 202.5) && (wind <= 247.5)) {
					windDir = 'SW';
				}
				else if ((wind > 247.5) && (wind <= 292.5)) {
					windDir = 'W';
				}
				else if ((wind > 292.5) && (wind <= 337.51)) {
					windDir = 'NW';
				}
				else {
					windDir = 'N';
				}
				return windDir;
			}	


			$(data).each(function(){
				var icon = getWeatherIcon(this.weather[0].icon),
					day = getDay(this.dt, false),
					fulldate = getDay(this.dt, true),
					humidity = this.main.humidity,
					wind = Math.round(this.wind.speed),
					dir = getWindDir(this.wind.deg),
					clouds = this.clouds.all,
					sunrise = new Date(this.sys.sunrise*1000),
					sunset = new Date(this.sys.sunset*1000),
					sunriseTime = {
						hours: sunrise.getHours(),
						minutes: sunrise.getMinutes(),
						period: 'am'
					},
					sunsetTime = {
						hours: sunset.getHours(),
						minutes: sunset.getMinutes(),
						period: 'am'
					},
					temp = {
						now: Math.round(this.main.temp),
						hi: Math.round(this.main.temp_max),
						lo: Math.round(this.main.temp_min)
					};

				if(sunriseTime.hours >= 12) {
					sunriseTime.hours -= 12;
					sunriseTime.period = 'pm';
				}
				if(sunsetTime.hours >= 12) {
					sunsetTime.hours -= 12;
					sunsetTime.period = 'pm';
				}
				if(sunriseTime.hours == 0) {
					sunriseTime.hours = 12;
				}
				if(sunsetTime.hours == 0) {
					sunsetTime.hours = 12;
				}

				var sunriseFormatted = sunriseTime.hours + ':' + sunriseTime.minutes + sunriseTime.period,
					sunsetFormatted = sunsetTime.hours + ':' + sunsetTime.minutes + sunsetTime.period;

				var html = '<li>'+
					'<span class="icon-'+icon+'"></span>' +
					'<h3 class="forcast-day">'+day+'</h3>' +
					'<h5>'+fulldate+'</h5>' +
					'</li>' +
					'<li>' +
					'<p>Current Conditions: <strong>'+conditions+'</strong></p>' +
					'<p>Temperature: <strong>'+temp.now+'&deg;F</strong></p>'+
					'<p class="high-temp">High Temp: <strong><span></span>&deg;F</strong></p>'+
					'<p class="low-temp">Low Temp: <strong><span></span>&deg;F</strong></p>'+
					'<p>Humidity: <strong>'+humidity+'&#37;</strong></p>'+
					'</li>'+
					'<li>'+
					'<p>Wind: <strong>'+wind+' mph</strong></p>'+
					'<p>Wind Direction: <strong>'+dir+'</strong></p>'+
					'<p>Cloud Cover: <strong>'+clouds+'&#37;</strong></p>'+
					'<p>Sunrise: <strong>'+sunriseFormatted+'</strong></p>'+
					'<p>Sunset: <strong>'+sunsetFormatted+'</strong></p>'+
					'</li>';
				$('#weather').append(html);
			});
			appendTemp();
		}

		function forcastData(data){
			$(data.list).each(function(){	
				var icon = getWeatherIcon(this.weather[0].icon),
					day = getDay(this.dt, false),
					temp = Math.round(this.temp.max),
					html = '<li><span class="icon-'+icon+'"></span><h3 class="forcast-day">'+day+'</h3><h4 class="forcast-temp">'+temp+'</h4></li>';

				$('#forcast').append(html);
			});
		}

		function getWeatherIcon(conditions){
			var icon = 'weather1';

			switch(conditions){
				case '01d':
				case '01n':
					icon = 'weather1'
					break;
				case '02d':
				case '02n':
					icon = 'cloudy'
					break;
				case '03d':
				case '03n':
					icon = 'cloud46'
					break;
				case '04d':
				case '04n':
					icon = 'clouds11'
					break;
				case '09d':
				case '09n':
					icon = 'rain2'
					break;
				case '10d':
				case '10n':
					icon = 'rain2'
					break;
				case '11d':
				case '11n':
					icon = 'lightning'
					break;
				case '13d':
				case '13n':
					icon = 'snowing5'
					break;
				case '50d':
				case '50n':
					icon = 'fog1'
					break;
			}

			return icon;
		}

		function appendTemp() {
			var weatherAPI = '80b00f4027fe90911adb23c75d8317c4',
				forcast = '//api.openweathermap.org/data/2.5/forecast/daily?q=Waco&units=imperial&cnt=1&APPID='+weatherAPI;

			//1 day forcast
			$.ajax({
				dataType: "jsonp",
				url: forcast,
				async: false,
				success: function(data){
					var maxtemp = data.list[0].temp.max,
						mintemp = data.list[0].temp.min;
					$('.high-temp strong span').html(Math.round(maxtemp));
					$('.low-temp strong span').html(Math.round(mintemp));
				}
			});
		}
	}

	function animateWeather(){
		$("#top-panel > ul:first").show();
		$("#top-panel > ul:gt(0)").hide();

		setInterval(function() {
			$('#top-panel > ul:first')
				.fadeOut('slow')
				.next()
				.delay('slow')
				.fadeIn('slow')
				.end()
				.appendTo('#top-panel');
		}, 16000);
	}

	function getTweets() {
		$.getJSON('includes/get-tweets.php', function(feeds) {   
			var feedHTML = '';
			var displayCounter = 1;         
			for (var i=0; i<feeds.length; i++) {
				var tweetscreenname = feeds[i].user.name,
					tweetusername = feeds[i].user.screen_name,
					profileimage = feeds[i].user.profile_image_url_https,
					status = feeds[i].text,
					isaretweet = false,
					isdirect = false,
					tweetid = feeds[i].id_str;

				//If the tweet has been retweeted, get the profile pic of the tweeter
				if(typeof feeds[i].retweeted_status != 'undefined'){
					profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
					tweetscreenname = feeds[i].retweeted_status.user.name;
					tweetusername = feeds[i].retweeted_status.user.screen_name;
					tweetid = feeds[i].retweeted_status.id_str;
					status = feeds[i].retweeted_status.text; 
					isaretweet = true;
				};

				//Check to see if the tweet is a direct message
				if (feeds[i].text.substr(0,1) == "@") {
					isdirect = true;
				}

				//Generate twitter feed HTML based on selected options
				if (((showretweets == true) || ((isaretweet == false) && (showretweets == false))) && ((showdirecttweets == true) || ((showdirecttweets == false) && (isdirect == false)))) { 
					if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {             
						if (showtweetlinks == true) {
							status = addlinks(status);
						}

						feedHTML += '<li class="twitter-article" id="tw'+displayCounter+'">'; 										                 
						feedHTML += '<article class="tweet item"><div class="twitter-pic"><a href="https://twitter.com/'+tweetusername+'" target="_blank"><img src="'+profileimage+'"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></a></div>';
						feedHTML += '<div class="twitter-text"><p><span class="tweetprofilelink"><a href="https://twitter.com/'+tweetusername+'" target="_blank">@'+tweetusername+'</a></span><br/>'+status+'<br/><span class="tweet-time"><a href="https://twitter.com/'+tweetusername+'/status/'+tweetid+'" target="_blank">'+relative_time(feeds[i].created_at)+'</a></span></p>';

						if ((isaretweet == true) && (showretweetindicator == true)) {
							feedHTML += '<div id="retweet-indicator" class="icon">&#xf0b2;</div>';
						}						
						if (showtweetactions == true) {
							feedHTML += '<div id="twitter-actions"><div class="intent" id="intent-reply"><a href="https://twitter.com/intent/tweet?in_reply_to='+tweetid+'" title="Reply"></a></div><div class="intent" id="intent-retweet"><a href="https://twitter.com/intent/retweet?tweet_id='+tweetid+'" title="Retweet"></a></div><div class="intent" id="intent-fave"><a href="https://twitter.com/intent/favorite?tweet_id='+tweetid+'" title="Favourite"></a></div></div>';
						}

						feedHTML += '</div><div class="cl"></div></article>';
						feedHTML += '</li>';
						displayCounter++;
					}   
				}
			}

			$('#twitter-feed').html(feedHTML);

			//Add twitter action animation and rollovers
			if (showtweetactions == true) {				
				$('.twitter-article').hover(function(){
					$(this).find('#twitter-actions').css({'display':'block', 'opacity':0, 'margin-top':-20});
					$(this).find('#twitter-actions').animate({'opacity':1, 'margin-top':0},200);
				}, function() {
					$(this).find('#twitter-actions').animate({'opacity':0, 'margin-top':-20},120, function(){
						$(this).css('display', 'none');
					});
				});			

				//Add new window for action clicks
				$('#twitter-actions a').click(function(){
					var url = $(this).attr('href');
					window.open(url, 'tweet action window', 'width=580,height=500');
					return false;
				});
			}

		});/*.error(function(jqXHR, textStatus, errorThrown) {
			var error = "";
			if (jqXHR.status === 0) {
				error = 'Connection problem. Check file path and www vs non-www in getJSON request';
			} else if (jqXHR.status == 404) {
				error = 'Requested page not found. [404]';
			} else if (jqXHR.status == 500) {
				error = 'Internal Server Error [500].';
			} else if (exception === 'parsererror') {
				error = 'Requested JSON parse failed.';
			} else if (exception === 'timeout') {
				error = 'Time out error.';
			} else if (exception === 'abort') {
				error = 'Ajax request aborted.';
			} else {
				error = 'Uncaught Error.\n' + jqXHR.responseText;
			}	
			alert("error: " + error);
		});*/
	}

	function addlinks(data) {
		//Add link to all http:// links within tweets
		data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
			return '<a href="'+url+'"  target="_blank">'+url+'</a>';
		});

		//Add link to @usernames used within tweets
		data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
			return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
		});
		//Add link to #hastags used within tweets
		data = data.replace(/\B#([_a-z0-9]+)/ig, function(reply) {
			return '<a href="https://twitter.com/search?q='+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
		});
		return data;
	}

	function relative_time(time_value) {
		var values = time_value.split(" ");
		time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
		var parsed_date = Date.parse(time_value);
		var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
		var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
		var shortdate = time_value.substr(4,2) + " " + time_value.substr(0,3);
		delta = delta + (relative_to.getTimezoneOffset() * 60);

		if (delta < 60) {
			return '1m';
		} else if(delta < 120) {
			return '1m';
		} else if(delta < (60*60)) {
			return (parseInt(delta / 60)).toString() + 'm';
		} else if(delta < (120*60)) {
			return '1h';
		} else if(delta < (24*60*60)) {
			return (parseInt(delta / 3600)).toString() + 'h';
		} else if(delta < (48*60*60)) {
			//return '1 day';
			return shortdate;
		} else {
			return shortdate;
		}
	}

	function parseRSS(url, callback) {
		$.ajax({
			url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
			dataType: 'json',
			success: function(data) {
				callback(data.responseData.feed);
			},
			timeout: 20000,
			error: function(x, t, msg) {
				if(t==="timeout"){
					alert("Server timeout: RSS");
				}
			}
		});
	}

	function getDay(timestamp, returnFulldate){
		pubDate = new Date(timestamp * 1000);

		if(returnFulldate) {
			var monthname = new Array("January","Febuary","March","April","May","June","July","August","September","October","November","December");
			var formattedDate = monthname[pubDate.getMonth()] + ' ' + pubDate.getDate() + ', ' + pubDate.getFullYear();
			return formattedDate;
		}
		else {
			var weekday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
			var day = weekday[pubDate.getDay()];
			return day;
		}
	}

	function countdown() {
		var now = Date.now(),
			elapsed = parseInt(((now - start) / 1000), 10),
			mins = Math.floor((refresh - elapsed) / 60),
			secs = refresh - (mins * 60) - elapsed;

		secs = (secs < 10) ? "0" + secs : secs;

		if (elapsed > refresh) {
			clearInterval(intervalId);
			init();
		}
	}

	return {
		init: init
		//getMonitors: getMonitors,
		//animateWeather: animateWeather
	};

}(jQuery));

APP.global = (function($) {
	function init(){
		getLocationData();
		//getWeather(location);
	}

	function getLocationData(){
		var geocoder = new google.maps.Geocoder();

		if (navigator.geolocation) {
			if ( navigator && navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
			}
		}

		function getWeather(location) {
			var weatherAPI = '80b00f4027fe90911adb23c75d8317c4',
				daily = 'http://api.openweathermap.org/data/2.5/weather?lat='+location.latitude+'&lon='+location.longitude+',us&units=imperial&APPID='+weatherAPI;

			$.ajax({
				dataType: "jsonp",
				url: daily,
				success: weatherData
			});

			function weatherData(data) {
				$('.weather-icon').html('');
				$('.weather-temp').html('');
				$(data).each(function(){
					var icon = getWeatherIcon(this.weather[0].icon),
						day = getDay(this.dt, false),
						fulldate = getDay(this.dt, true),
						temp = Math.round(this.main.temp);

					$('.weather-icon').addClass('icon-'+icon);
					$('.weather-temp').html(temp+"&deg; F");
					console.log(temp);
				});

				function getDay(timestamp, returnFulldate){
					pubDate = new Date(timestamp * 1000);

					if(returnFulldate) {
						var monthname = new Array("January","Febuary","March","April","May","June","July","August","September","October","November","December");
						var formattedDate = monthname[pubDate.getMonth()] + ' ' + pubDate.getDate() + ', ' + pubDate.getFullYear();
						return formattedDate;
					}
					else {
						var weekday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
						var day = weekday[pubDate.getDay()];
						return day;
					}
				}

				function getWeatherIcon(conditions){
					var icon = 'weather1';

					switch(conditions){
						case '01d':
						case '01n':
							icon = 'weather1'
							break;
						case '02d':
						case '02n':
							icon = 'cloudy'
							break;
						case '03d':
						case '03n':
							icon = 'cloud46'
							break;
						case '04d':
						case '04n':
							icon = 'clouds11'
							break;
						case '09d':
						case '09n':
							icon = 'rain'
							break;
						case '10d':
						case '10n':
							icon = 'rain2'
							break;
						case '11d':
						case '11n':
							icon = 'lightning'
							break;
						case '13d':
						case '13n':
							icon = 'snowing5'
							break;
						case '50d':
						case '50n':
							icon = 'fog1'
							break;
					}

					return icon;
				}
			}
		}

		function geoSuccess(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			codeLatLng(lat, lng);
		}

		function geoError(err) {
			if ( err.code == 1 ) {
				console.log("The user denied the request for location information.");
			} else if ( err.code == 2 ) {
				console.log("Your location information is unavailable.");
			} else if ( err.code == 3 ) {
				console.log("The request to get your location timed out.");
			} else {
				console.log("An unknown error occurred while requesting your location.");
			}
		}

		function codeLatLng(lat, lng) {
			var latlng = new google.maps.LatLng(lat, lng),
				state,
				city,
				location = {latitude: lat, longitude: lng};

			geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						$(results[0].address_components).each(function(i){
							$(results[0].address_components[i].types).each(function(n){
								if (results[0].address_components[i].types[n] == "administrative_area_level_1") {									
									state = results[0].address_components[i].short_name;
								}
							});
						});

						$(results[0].address_components).each(function(i){
							$(results[0].address_components[i].types).each(function(n){
								if (results[0].address_components[i].types[n] == "locality") {									
									city = results[0].address_components[i].short_name;
								}
							});
						});

						$('.weather-location').html(city+", "+state);
						getWeather(location);
					} else {
						console.log("Location information could not be found.");
					}
				} else {
					console.log("Geocoder failed due to the following error: " + status);
				}
			});
		}
	}

	return {
		init: init
	}
}(jQuery));

APP.dashboard = (function($) {
	function init() {
		getLocation();
		getWeather(location);
	}

	function getLocation(){
		var geocoder = new google.maps.Geocoder();

		if (navigator.geolocation) {
			if ( navigator && navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
			}
		}

		function geoSuccess(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			codeLatLng(lat, lng);
		}

		function geoError(err) {
			if ( err.code == 1 ) {
				console.log("The user denied the request for location information.");
			} else if ( err.code == 2 ) {
				console.log("Your location information is unavailable.");
			} else if ( err.code == 3 ) {
				console.log("The request to get your location timed out.");
			} else {
				console.log("An unknown error occurred while requesting your location.");
			}
		}

		function codeLatLng(lat, lng) {
			var latlng = new google.maps.LatLng(lat, lng),
				state,
				city,
				location = [latitude = lat, longitude = lng];

			geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						$(results[0].address_components).each(function(i){
							$(results[0].address_components[i].types).each(function(n){
								if (results[0].address_components[i].types[n] == "administrative_area_level_1") {									
									state = results[0].address_components[i].short_name;
								}
							});
						});

						$(results[0].address_components).each(function(i){
							$(results[0].address_components[i].types).each(function(n){
								if (results[0].address_components[i].types[n] == "locality") {									
									city = results[0].address_components[i].short_name;
								}
							});
						});

						$('.weather-location').html(city+", "+state);
						//$('.weather-state').html(state);
					} else {
						console.log("Location information could not be found.");
					}
				} else {
					console.log("Geocoder failed due to the following error: " + status);
				}
			});
			return location;
		}
	}

	function getWeather(location) {
		var weatherAPI = '80b00f4027fe90911adb23c75d8317c4',
			daily = '//api.openweathermap.org/data/2.5/weather?lat='+location.latitude+'&lon='+location.longitude+',us&units=imperial&APPID='+weatherAPI,
			forcast = '//api.openweathermap.org/data/2.5/forecast/daily?lat='+location.latitude+'&lon='+location.longitude+',us&units=imperial&cnt=5&APPID='+weatherAPI;

		//current weather
		$.ajax({
			dataType: "jsonp",
			url: daily,
			success: weatherData
		});
		
		//7 day forcast
		$.ajax({
			dataType: "jsonp",
			url: forcast,
			success: forcastData
		});
		
		function getWeatherIcon(conditions){
				var icon = 'weather1';

				switch(conditions){
					case '01d':
					case '01n':
						icon = 'weather1'
						break;
					case '02d':
					case '02n':
						icon = 'cloudy'
						break;
					case '03d':
					case '03n':
						icon = 'cloud46'
						break;
					case '04d':
					case '04n':
						icon = 'clouds11'
						break;
					case '09d':
					case '09n':
						icon = 'rain'
						break;
					case '10d':
					case '10n':
						icon = 'rain2'
						break;
					case '11d':
					case '11n':
						icon = 'lightning'
						break;
					case '13d':
					case '13n':
						icon = 'snowing5'
						break;
					case '50d':
					case '50n':
						icon = 'fog1'
						break;
				}

				return icon;
			}

		function getDay(timestamp, returnFulldate){
			var pubDate = new Date(timestamp * 1000);

			if(returnFulldate) {
				var monthname = new Array("January","Febuary","March","April","May","June","July","August","September","October","November","December");
				var formattedDate = monthname[pubDate.getMonth()] + ' ' + pubDate.getDate() + ', ' + pubDate.getFullYear();
				return formattedDate;
			}
			else {
				var weekday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
				var day = weekday[pubDate.getDay()];
				return day;
			}
		}

		function weatherData(data) {
			var icon = '',
				day = '',
				fulldate = '',
				temp = '';
			
			$('.weather-icon').html('');
			$('.weather-temp').html('');
			$(data).each(function(){
				icon = getWeatherIcon(this.weather[0].icon),
				day = getDay(this.dt, false),
				fulldate = getDay(this.dt, true),
				temp = Math.round(this.main.temp);
				
				console.log(data);

				$('.weather-icon').addClass('icon-'+icon);
				$('.weather-temp').html(temp+"&deg; F");
			});
		}
		
		function forcastData(data){
			$('.forcast').html('');
			$(data.list).each(function(){
				var icon = getWeatherIcon(this.weather[0].icon),
					day = getDay(this.dt, false),
					temp = Math.round(this.temp.max),
					html = '<li><span class="forcast-icon icon-'+icon+'"></span><h3 class="forcast-day">'+day+'</h3><h4 class="forcast-temp">'+temp+'&deg;</h4></li>';

				$('.forcast').append(html);
			});
		}
	}

	return { 
		init: init
	}
}(jQuery));

APP.feed = (function($) {	
	function init(feed) {
		$('.feed-list').empty();
		parseRSS(feed, parseFeed);

		$(document).on('pagebeforeshow', function(){
			$('.feed-list').empty();
		});
	}

	function parseRSS(url, callback) {
		$.ajax({
			url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
			dataType: 'json',
			success: function(data) {
				callback(data.responseData.feed);
			},
			timeout: 20000,
			error: function(x, t, msg) {
				if(t==="timeout"){
					alert("Server timeout: RSS");
				}
			}
		});
	}

	function parseFeed(feedResponse) {
		$(feedResponse.entries).each(function(i){
			var feed = $('<li class="feed-item" data-link="'+ feedResponse.entries[i].link +'"><article class="article-item"><h3 class="article-title">'+ feedResponse.entries[i].title +'</h3><p class="article-date">'+ feedResponse.entries[i].publishedDate +'</p><p class="aritcle-content">'+ feedResponse.entries[i].contentSnippet +'</p></article></li>').hide();
			$('.feed-list').append(feed);
		});

		$('.feed-item').each(function(i){
			var feedObj = [];

			$(this).on('click', function(){
				var link = $(this).attr('data-link');
				window.open(link);
			});
		});

		$('.feed-list li').fadeIn();
	}

	return { init:init }
}(jQuery));


//Load Classes
$(document).on('pageshow', '#dashboard', function(){
	APP.dashboard.init();
});

$(document).on('pageshow', '#nextweb', function(){
	APP.global.init();
	APP.feed.init("http://feeds2.feedburner.com/thenextweb");
});

$(document).on('pageshow', '#techcrunch', function(){
	APP.global.init();
	APP.feed.init("http://feeds.feedburner.com/TechCrunch/");
});

$(document).on('pageshow', '#cnn', function(){
	APP.global.init();
	APP.feed.init("http://rss.cnn.com/rss/cnn_topstories.rss");
});
