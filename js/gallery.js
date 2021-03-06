// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function getQueryParams(qs) {
	qs = qs.split("+").join(" ");
	var params = {},
	tokens,
	re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])]
		= decodeURIComponent(tokens[2]);
	}
	return params;
}
var $_GET = getQueryParams(document.location.search);
console.log($_GET["json"]);

function swapPhoto() {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string
	mCurrentIndex++;
	console.log('swap photo');
	if (mCurrentIndex >= mImages.length) {
		mCurrentIndex = 0;
	}
	document.getElementById("photo").src = mImages[mCurrentIndex].img;
	document.getElementsByClassName("location")[0].innerHTML = "Location: " + mImages[mCurrentIndex].location;
	document.getElementsByClassName("description")[0].innerHTML = "Description: " + mImages[mCurrentIndex].description;
	document.getElementsByClassName("date")[0].innerHTML = "Date: " + mImages[mCurrentIndex].date;
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// Holds images data in array from JSON information
var imagesArr;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
if ($_GET["json"] == 'extra.json' || $_GET["json"] == 'images-short.json') {
	var mURL = './' + $_GET["json"];
}
else {
	var mURL = './images.json';
} 


// Holds data from images array
var lctn;
var desc;
var date;
var path;

mRequest.onreadystatechange = function() {
// Do something interesting if file is opened successfully
	if (mRequest.readyState == 4 && mRequest.status == 200) {
		try {
			// Let’s try and see if we can parse JSON
			mJson = JSON.parse(mRequest.responseText);
			// Let’s print out the JSON; It will likely show as "obj"
			console.log(mJson);
			imagesArr = mJson.images;
			for(img in imagesArr) {
				lctn = imagesArr[img].imgLocation;
				desc = imagesArr[img].description;
				date = imagesArr[img].date;
				path = imagesArr[img].imgPath;
				mImages.push(new GalleryImage(lctn, desc, date, path));
			}
			document.getElementById("photo").src = mImages[mCurrentIndex].img;
			document.getElementsByClassName("location")[0].innerHTML = "Location: " + mImages[mCurrentIndex].location;
			document.getElementsByClassName("description")[0].innerHTML = "Description: " + mImages[mCurrentIndex].description;
			document.getElementsByClassName("date")[0].innerHTML = "Date: " + mImages[mCurrentIndex].date;
			console.log(mImages);
		} catch(err) {
			console.log(err.message)
		}
	}
};
mRequest.open("GET",mURL, true);
mRequest.send();

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();
	
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

function GalleryImage(location, description, date, img) {
	//implement me as an object to hold the following data about an image:
	//1. location where photo was taken
	this.location = location;
	//2. description of photo
	this.description = description;
	//3. the date when the photo was taken
	this.date = date;
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
	this.img = img;
}

$(document).ready(function() {
	$("img.moreIndicator").click(function() {
		if ($("img.moreIndicator").hasClass("rot90")) {
			$("img.moreIndicator").addClass("rot270");
			$("img.moreIndicator").removeClass("rot90");
			$("div.details").slideDown();
		}
		else {
			$("img.moreIndicator").removeClass("rot270");
			$("img.moreIndicator").addClass("rot90");
			$("div.details").slideUp();
		}
	});	
	
	$("#nextPhoto").css("float", "right");

	$("#prevPhoto").click(function() {
		if (mCurrentIndex === 0) {
			mCurrentIndex = mImages.length - 2;
			swapPhoto();
		}
		else {
			mCurrentIndex = mCurrentIndex - 2;
			swapPhoto();
		}
	});

	$("#nextPhoto").click(function() {
		if (mCurrentIndex === (mImages.length - 1)) {
			mCurrentIndex = -1;
			swapPhoto();
		}
		else {
			swapPhoto();
		}
	});
});
