// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: city;
// v1.5.2 coded by Saudumm (https://twitter.com/saudumm)
// GitHub: https://github.com/Saudumm/scriptable-CaschysBlog

/*  WIDGET PARAMETERS: you can long press on the widget on your homescreen and edit parameters
 - example: small|https://www.stadt-bremerhaven.de|Caschys Blog|background.jpg
 - parameter order has to be: widget size, site url, site name, background image
 - parameters have to be separated by |
 - You can omit parameters, for example background image: small|https://www.stadt-bremerhaven.de|Caschys Blog
 - you can just set "small", "medium" or "large" as a parameter
 - parameters that are not set will be set by the standard widget config
 */

/*  STANDARD WIDGET CONFIG: standard config below can be overwritten by widget parameters
 WIDGET_SIZE: small, medium, large
 SITE_URL: address (URL) of the website you want to fetch posts from
 SITE_NAME: name of the website to display in the widget
 BG_IMAGE_NAME: CASE SENSITIVE! filename of the custom background image, set to none if you don't want a custom image
 - Note: custom background image files have to be in the Scriptable iCloud Files directory (same as the script js file)
 */
var WIDGET_SIZE = 'small';
var SITE_URL = 'https://www.stadt-bremerhaven.de';
var SITE_NAME = 'Caschys Blog';
var BG_IMAGE_NAME = "none";

/*  COLOR CONFIG: You can edit almost all colors of your widget
 SHOW_NEWS_IMAGES: true = display images next to the news headlines; set to false if you don't want images next to news
 - Note: combining SHOW_NEWS_IMAGES = true + WIDGET_SIZE = small will ignore BG_GRADIENT_COLOR values in small config widgets
 BG_IMAGE_GRADIENT: gradient over the background image
 BG_GRADIENT: widget background; true = use gradient; false = single background color
 BG_COLOR: background color value if BG_GRADIENT = false
 BG_GRADIENT_COLOR_TOP: gradient color at the top
 BG_GRADIENT_COLOR_BTM: gradient color at the bottom
 BG_GRADIENT_OVERLAY_TOP: gradient background image overlay color top
 BG_GRADIENT_OVERLAY_BTM: gradient background image overlay color bottom
 FONT_COLOR_SITENAME: font color of the website name (SITE_NAME)
 FONT_COLOR_POST_DATE: font color of the date/time label
 FONT_COLOR_HEADLINE: font color of the news headline label
 */
const SHOW_NEWS_IMAGES = true;
const BG_IMAGE_GRADIENT = true;
var BG_GRADIENT = false;
const BG_COLOR = new Color("#1c1c1e");
var BG_GRADIENT_COLOR_TOP = new Color("#222222");
var BG_GRADIENT_COLOR_BTM = new Color("#444444");
const BG_GRADIENT_OVERLAY_TOP = new Color('#1c1c1e', 0.3);
const BG_GRADIENT_OVERLAY_BTM = new Color('#1c1c1e', 1.0);
const FONT_COLOR_SITENAME = Color.white();
const FONT_COLOR_POST_DATE = Color.gray();
const FONT_COLOR_HEADLINE = Color.white();

// DO NOT CHANGE ANYTHING BELOW!
// Unless you know what you're doing.
// Unlike me, I don't know what I'm doing.
if (args.widgetParameter) {
	let widgetParameter = args.widgetParameter.split("|");
	if (widgetParameter.length >= 1) { WIDGET_SIZE = widgetParameter[0]; }
	if (widgetParameter.length >= 2) { SITE_URL = widgetParameter[1]; }
	if (widgetParameter.length >= 3) { SITE_NAME = widgetParameter[2]; }
	if (widgetParameter.length >= 4) { BG_IMAGE_NAME = widgetParameter[3]; }
}

var NUMBER_OF_POSTS = 2;
switch (WIDGET_SIZE) {
	case 'small':
		NUMBER_OF_POSTS = 1;
		break;
	case 'medium':
		NUMBER_OF_POSTS = 2;
		break;
	case 'large':
		NUMBER_OF_POSTS = 5;
		break;
}

// JSON URL of WP Posts (WordPress Standard)
const JSON_API_URL = SITE_URL+"/wp-json/wp/v2/posts";

let widget = await createWidget();

if (!config.runsInWidget) {
	switch (WIDGET_SIZE) {
		case 'small':
			await widget.presentSmall();
			break;
		case 'medium':
			await widget.presentMedium();
			break;
		case 'large':
			await widget.presentLarge();
			break;
	}
}

Script.setWidget(widget);
Script.complete();

async function createWidget(items) {
	const data = await getData();
	const list = new ListWidget();
	
	// display name of the website
	const siteName = list.addText(SITE_NAME.toUpperCase());
	siteName.font = Font.heavyMonospacedSystemFont(13);
	siteName.textColor = FONT_COLOR_SITENAME;
	
	list.addSpacer();
	
	if (data) {
		if (NUMBER_OF_POSTS == 1) {
			// load widget background image (if SHOW_NEWS_IMAGES = true or BG_IMAGE_NAME is set)
			if (SHOW_NEWS_IMAGES == true && BG_IMAGE_NAME == "none") {
				list.backgroundImage = await getImage(data.arrNewsThumbnails[0]);
				
				// draw gradient over background image for better readability
				BG_GRADIENT = true;
				BG_GRADIENT_COLOR_TOP = BG_GRADIENT_OVERLAY_TOP;
				BG_GRADIENT_COLOR_BTM = BG_GRADIENT_OVERLAY_BTM;
				
				// small shadow outline on SITE_NAME for better readability
				siteName.shadowRadius = 1;
				siteName.shadowColor = Color.black();
			}
			
			const postStack = list.addStack();
			postStack.layoutVertically();
			
			const labelDateTime = postStack.addText(convertDateString(data.arrNewsDateTimes[0]));
			labelDateTime.font = Font.heavyMonospacedSystemFont(12);
			labelDateTime.textColor = FONT_COLOR_POST_DATE;
			labelDateTime.lineLimit = 1
			labelDateTime.minimumScaleFactor = 0.5
			
			const labelHeadline = postStack.addText(data.arrNewsTitles[0]);
			labelHeadline.font = Font.heavyMonospacedSystemFont(12);
			labelHeadline.textColor = FONT_COLOR_HEADLINE;
			labelHeadline.lineLimit = 3;
			
			list.url = data.arrNewsURLs[0];
			
		} else {
			
			let arrStackRow = [];
			arrStackRow.length = NUMBER_OF_POSTS;
			let arrStackCol = [];
			arrStackCol.length = NUMBER_OF_POSTS;
			let arrLblPostDateTime = [];
			arrLblPostDateTime.length = NUMBER_OF_POSTS;
			let arrLblPostHeadline = [];
			arrLblPostHeadline.length = NUMBER_OF_POSTS;
			let arrLblPostIMG = [];
			arrLblPostIMG.length = NUMBER_OF_POSTS;
			
			let i;
			for (i = 0; i < NUMBER_OF_POSTS; i++) {
				arrStackRow[i] = list.addStack();
				arrStackRow[i].layoutHorizontally();
				arrStackRow[i].url = data.arrNewsURLs[i];
				
				arrStackCol[i] = arrStackRow[i].addStack();
				arrStackCol[i].layoutVertically();
				
				arrLblPostDateTime[i] = arrStackCol[i].addText(convertDateString(data.arrNewsDateTimes[i]));
				arrLblPostDateTime[i].font = Font.heavyMonospacedSystemFont(12);
				arrLblPostDateTime[i].textColor = FONT_COLOR_POST_DATE;
				arrLblPostDateTime[i].lineLimit = 1
				arrLblPostDateTime[i].minimumScaleFactor = 0.5
				
				arrLblPostHeadline[i] = arrStackCol[i].addText(data.arrNewsTitles[i]);
				arrLblPostHeadline[i].font = Font.heavyMonospacedSystemFont(12);
				arrLblPostHeadline[i].textColor = FONT_COLOR_HEADLINE;
				arrLblPostHeadline[i].lineLimit = 2;
				
				if (SHOW_NEWS_IMAGES == true) {
					arrStackRow[i].addSpacer();
					arrLblPostIMG[i] = await getImage(data.arrNewsThumbnails[i]);
					arrLblPostIMG[i] = arrStackRow[i].addImage(arrLblPostIMG[i]);
					arrLblPostIMG[i].imageSize = new Size(45,45);
					arrLblPostIMG[i].cornerRadius = 8;
					arrLblPostIMG[i].rightAlignImage();
				}
				
				if (i < NUMBER_OF_POSTS-1) {
					list.addSpacer();
				}
			}
		}
	} else {
		const error_msg = list.addText("No data found");
		error_msg.font = Font.regularMonospacedSystemFont(12);
		error_msg.textColor = FONT_COLOR_HEADLINE;
	}
	
	// widget background (single color or gradient)
	if (BG_IMAGE_NAME != "none") {
		let imageLocalURL = await getLocalImage(BG_IMAGE_NAME);
		if (imageLocalURL != "not found") {
			let customBackgroundImage = await Image.fromFile(imageLocalURL);
			list.backgroundImage = customBackgroundImage;
			
			if (BG_IMAGE_GRADIENT == true) {
				// draw gradient over background image for better readability
				const gradient = new LinearGradient();
				gradient.locations = [0, 1];
				gradient.colors = [BG_GRADIENT_OVERLAY_TOP,BG_GRADIENT_OVERLAY_BTM];
				list.backgroundGradient = gradient;
			}
		} else {
			list.backgroundColor = BG_COLOR;
		}
	} else if (BG_GRADIENT == true) {
		const gradient = new LinearGradient();
		gradient.locations = [0, 1];
		gradient.colors = [BG_GRADIENT_COLOR_TOP, BG_GRADIENT_COLOR_BTM];
		list.backgroundGradient = gradient;
	} else {
		list.backgroundColor = BG_COLOR;
	}
	
	return list;
}

async function getData() {
	try {
		let loadedJSON = await new Request(JSON_API_URL).loadJSON();
		
		let arrNewsDateTimes = [];
		arrNewsDateTimes.length = NUMBER_OF_POSTS;
		let arrNewsTitles = [];
		arrNewsTitles.length = NUMBER_OF_POSTS;
		let arrNewsURLs = [];
		arrNewsURLs.length = NUMBER_OF_POSTS;
		let arrNewsThumbnails = [];
		arrNewsThumbnails.length = NUMBER_OF_POSTS;
		
		if (NUMBER_OF_POSTS >= 1) {
			arrNewsDateTimes[0] = loadedJSON[0].date;
			
			arrNewsTitles[0] = loadedJSON[0].title.rendered;
			arrNewsTitles[0] = formatHeadline(arrNewsTitles[0]);
			arrNewsURLs[0] = loadedJSON[0].guid.rendered;
			
			if (SHOW_NEWS_IMAGES == true) {
				if (WIDGET_SIZE == 'small') {
					arrNewsThumbnails.push("none")
					arrNewsThumbnails[0] = SITE_URL+"/wp-json/wp/v2/media/"+loadedJSON[0].featured_media;
					arrNewsThumbnails[0] = await new Request(arrNewsThumbnails[0]).loadJSON();
					arrNewsThumbnails[0] = arrNewsThumbnails[0].media_details.sizes.medium_large.source_url;
					arrNewsThumbnails[0] = encodeURI(arrNewsThumbnails[0]);
				} else {
					arrNewsThumbnails[0] = await getMediaURL(loadedJSON[0].featured_media);
					arrNewsThumbnails[0] = encodeURI(arrNewsThumbnails[0]);
				}
			}
			
			if (NUMBER_OF_POSTS >= 2) {
				let i;
				for (i = 1; i < NUMBER_OF_POSTS; i++) {
					arrNewsDateTimes[i] = loadedJSON[i].date;
					
					arrNewsTitles[i] = loadedJSON[i].title.rendered;
					arrNewsTitles[i] = formatHeadline(arrNewsTitles[i]);
					
					arrNewsURLs[i] = loadedJSON[i].guid.rendered;
					
					if (SHOW_NEWS_IMAGES == true) {
						arrNewsThumbnails[i] = await getMediaURL(loadedJSON[i].featured_media);
						arrNewsThumbnails[i] = encodeURI(arrNewsThumbnails[i]);
					}
				}
			}
		}
		
		const result = {
			arrNewsDateTimes: arrNewsDateTimes,
			arrNewsTitles: arrNewsTitles,
			arrNewsURLs: arrNewsURLs,
			arrNewsThumbnails: arrNewsThumbnails
		};
		
		return result;
	} catch (e) {
		return null;
	}
}

function formatHeadline(strHeadline) {
	strHeadline = strHeadline.replace("&quot;", '"');
	strHeadline = strHeadline.replace("&amp;", "&");
	strHeadline = strHeadline.replace("&lt;", "<");
	strHeadline = strHeadline.replace("&gt;", ">");
	strHeadline = strHeadline.replace("&#034;", '"');
	strHeadline = strHeadline.replace("&#038;", "&");
	strHeadline = strHeadline.replace("&#060;", "<");
	strHeadline = strHeadline.replace("&#062;", ">");
	strHeadline = strHeadline.replace("&#338;", "Œ");
	strHeadline = strHeadline.replace("&#339;", "œ");
	strHeadline = strHeadline.replace("&#352;", "Š");
	strHeadline = strHeadline.replace("&#353;", "š");
	strHeadline = strHeadline.replace("&#376;", "Ÿ");
	strHeadline = strHeadline.replace("&#710;", "ˆ");
	strHeadline = strHeadline.replace("&#732;", "˜");
	strHeadline = strHeadline.replace("&#8211;", "–");
	strHeadline = strHeadline.replace("&#8212;", "—");
	strHeadline = strHeadline.replace("&#8216;", "‘");
	strHeadline = strHeadline.replace("&#8217;", "’");
	strHeadline = strHeadline.replace("&#8218;", "‚");
	strHeadline = strHeadline.replace("&#8220;", "“");
	strHeadline = strHeadline.replace("&#8221;", "”");
	strHeadline = strHeadline.replace("&#8222;", "„");
	strHeadline = strHeadline.replace("&#8224;", "†");
	strHeadline = strHeadline.replace("&#8225;", "‡");
	strHeadline = strHeadline.replace("&#8240;", "‰");
	strHeadline = strHeadline.replace("&#8249;", "‹");
	strHeadline = strHeadline.replace("&#8250;", "›");
	strHeadline = strHeadline.replace("&#8364;", "€");
	
	return strHeadline;
}

function convertDateString(strDate) {
	let date_conv = new Date(strDate);
	let dateTimeLocal = date_conv.toLocaleString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})
	return dateTimeLocal
}

async function getImage(url) {
	let req = new Request(url);
	return await req.loadImage();
}

async function getMediaURL(featuredMedia) {
	let featuredMediaJSONURL = SITE_URL+"/wp-json/wp/v2/media/"+featuredMedia;
	let loadedMediaJSON = await new Request(featuredMediaJSONURL).loadJSON();
	let mediaURL = loadedMediaJSON.media_details.sizes.thumbnail.source_url;
	return mediaURL;
}

async function getLocalImage(imageName) {
	var fm = FileManager.iCloud();
	let dir = fm.documentsDirectory()
	let backgroundImagePath = fm.joinPath(dir, imageName)
	
	if (fm.fileExists(backgroundImagePath) == true) {
		return backgroundImagePath;
	} else {
		return "not found";
	}
}
