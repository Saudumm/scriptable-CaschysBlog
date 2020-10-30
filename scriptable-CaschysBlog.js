// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: city;
// v1.4 coded by Saudumm

// WIDGET PARAMETER: small|https://www.stadt-bremerhaven.de|Caschys Blog|background.jpg
// parameter order has to be: widget size, site url, site name, background image
// parameters have to be separated by |
// You can omit parameters, for example background image: small|https://www.stadt-bremerhaven.de|Caschys Blog
// or you can just set "small", "medium" or "large" as parameter
// parameters that are not set will be set by the standard widget config

// STANDARD WIDGET CONFIG -> can be overwritten by parameters
var WIDGET_SIZE = 'small'; // small, medium, large // can be overwritten with widget parameters
var SITE_URL = 'https://www.stadt-bremerhaven.de'; // address of the website to fetch posts from
var SITE_NAME = 'Caschys Blog'; // name to display in the widget
var BACKGROUND_IMAGE_NAME = "none"; // CASE SENSITIVE!!! filename of the custom background image, set to none if you don't want a custom image
var BACKGROUND_IMAGE_GRADIENT = true; // gradient over the background image
// custom background images have to be in the Scriptable iCloud Files directory (same as the script js file)

// COLOR CONFIG
const POST_IMAGES = true; // set to false if you don't want images
// Note: combining POST_IMAGES = true + WIDGET_SIZE = small will ignore BACKGROUND_GRADIENT_COLOR values in small widgets
var BACKGROUND_GRADIENT = false; // widget background; true = gradient, false = single background color
var BACKGROUND_COLOR = new Color("#1c1c1e"); // color value if BACKGROUND_GRADIENT = false
var BACKGROUND_GRADIENT_COLOR_TOP = new Color("#48484a"); // gradient color top
var BACKGROUND_GRADIENT_COLOR_BTM = new Color("#2c2c2e"); // gradient color bottom
const FONT_COLOR_SITENAME = Color.white(); // font color website name (SITE_NAME)
const FONT_COLOR_HEADLINE = Color.white(); // font color for headlines
const FONT_COLOR_POST_DATE = Color.gray(); // font color for date/time

// DO NOT CHANGE
// JSON URL for Posts (WordPress Standard)
if (args.widgetParameter) {
    let widgetParameter = args.widgetParameter.split("|");
    if (widgetParameter.length >= 1) { WIDGET_SIZE = widgetParameter[0]; }
    if (widgetParameter.length >= 2) { SITE_URL = widgetParameter[1]; }
    if (widgetParameter.length >= 3) { SITE_NAME = widgetParameter[2]; }
    if (widgetParameter.length >= 4) { BACKGROUND_IMAGE_NAME = widgetParameter[3]; }
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

    const siteName = list.addText(SITE_NAME.toUpperCase());
    siteName.font = Font.heavyMonospacedSystemFont(13);
    siteName.textColor = FONT_COLOR_SITENAME;

    list.addSpacer();
    
    if (data) {
        if (NUMBER_OF_POSTS == 1) {
            // load widget background image (if POST_IMAGES = true or BACKGROUND_IMAGE_NAME is set)
            if (POST_IMAGES == true && BACKGROUND_IMAGE_NAME == "none") {
                list.backgroundImage = await getImage(data.post1BG);
                
                // draw gradient over background image for better readability
                BACKGROUND_GRADIENT = true;
                BACKGROUND_GRADIENT_COLOR_TOP = new Color('#000000', 0.25);
                BACKGROUND_GRADIENT_COLOR_BTM = new Color('#000000', 1);
       
                // small shadow outline on SITE_NAME for better readability
                siteName.shadowRadius = 1;
                siteName.shadowColor = Color.black();
            }
            
            const postStack = list.addStack();
            postStack.layoutVertically();

            const labelPost1DateTime = postStack.addText(convertDateString(data.post1DateTime));
            labelPost1DateTime.font = Font.heavyMonospacedSystemFont(12);
            labelPost1DateTime.textColor = FONT_COLOR_POST_DATE;
            labelPost1DateTime.lineLimit = 1
            labelPost1DateTime.minimumScaleFactor = 0.5
            
            const labelPost1Headline = postStack.addText(data.post1Title);
            labelPost1Headline.font = Font.heavyMonospacedSystemFont(12);
            labelPost1Headline.textColor = FONT_COLOR_HEADLINE;
            labelPost1Headline.lineLimit = 3;
            
            list.url = data.post1URL;
            
        } else if (NUMBER_OF_POSTS >= 2) {
            // row for post 1
            const stackRow1 = list.addStack();
            stackRow1.layoutHorizontally();
            stackRow1.url = data.post1URL;

            const stackColumn1 = stackRow1.addStack();
            stackColumn1.layoutVertically();

            const labelPost1DateTime = stackColumn1.addText(convertDateString(data.post1DateTime));
            labelPost1DateTime.font = Font.heavyMonospacedSystemFont(12);
            labelPost1DateTime.textColor = FONT_COLOR_POST_DATE;
            labelPost1DateTime.lineLimit = 1
            labelPost1DateTime.minimumScaleFactor = 0.5

            const labelPost1Headline = stackColumn1.addText(data.post1Title);
            labelPost1Headline.font = Font.heavyMonospacedSystemFont(12);
            labelPost1Headline.textColor = FONT_COLOR_HEADLINE;
            labelPost1Headline.lineLimit = 2;
        
            if (POST_IMAGES == true) {
                stackRow1.addSpacer();
                var post1IMG = await getImage(data.post1Thumbnail);
                post1IMG = stackRow1.addImage(post1IMG);
                post1IMG.imageSize = new Size(45,45);
                post1IMG.cornerRadius = 8;
                post1IMG.rightAlignImage();
            }
            list.addSpacer();

            // row for post 2
            const stackRow2 = list.addStack();
            stackRow2.layoutHorizontally();
            stackRow2.url = data.post2URL;

            const stackColumn2 = stackRow2.addStack();
            stackColumn2.layoutVertically();

            const labelPost2DateTime = stackColumn2.addText(convertDateString(data.post2DateTime));
            labelPost2DateTime.font = Font.heavyMonospacedSystemFont(12);
            labelPost2DateTime.textColor = FONT_COLOR_POST_DATE;
            labelPost2DateTime.lineLimit = 1
            labelPost2DateTime.minimumScaleFactor = 0.5

            const labelPost2Headline = stackColumn2.addText(data.post2Title);
            labelPost2Headline.font = Font.heavyMonospacedSystemFont(12);
            labelPost2Headline.textColor = FONT_COLOR_HEADLINE;
            labelPost2Headline.lineLimit = 2;

            if (POST_IMAGES == true) {
                stackRow2.addSpacer();
                var post2IMG = await getImage(data.post2Thumbnail);
                post2IMG = stackRow2.addImage(post2IMG);
                post2IMG.imageSize = new Size(45,45);
                post2IMG.cornerRadius = 8;
                post2IMG.rightAlignImage();
            }
            
            if (NUMBER_OF_POSTS == 5) {
                list.addSpacer();

                // row for post 3
                const stackRow3 = list.addStack();
                stackRow3.layoutHorizontally();
                stackRow3.url = data.post3URL;

                const stackColumn3 = stackRow3.addStack();
                stackColumn3.layoutVertically();

                const labelPost3DateTime = stackColumn3.addText(convertDateString(data.post3DateTime));
                labelPost3DateTime.font = Font.heavyMonospacedSystemFont(12);
                labelPost3DateTime.textColor = FONT_COLOR_POST_DATE;
                labelPost3DateTime.lineLimit = 1
                labelPost3DateTime.minimumScaleFactor = 0.5

                const labelPost3Headline = stackColumn3.addText(data.post3Title);
                labelPost3Headline.font = Font.heavyMonospacedSystemFont(12);
                labelPost3Headline.textColor = FONT_COLOR_HEADLINE;
                labelPost3Headline.lineLimit = 2;

                if (POST_IMAGES == true) {
                    stackRow3.addSpacer();
                    var post3IMG = await getImage(data.post3Thumbnail);
                    post3IMG = stackRow3.addImage(post3IMG);
                    post3IMG.imageSize = new Size(45,45);
                    post3IMG.cornerRadius = 8;
                    post3IMG.rightAlignImage();
                }
                
                list.addSpacer();
                
                // row for post 4
                const stackRow4 = list.addStack();
                stackRow4.layoutHorizontally();
                stackRow4.url = data.post4URL;

                const stackColumn4 = stackRow4.addStack();
                stackColumn4.layoutVertically();

                const labelPost4DateTime = stackColumn4.addText(convertDateString(data.post4DateTime));
                labelPost4DateTime.font = Font.heavyMonospacedSystemFont(12);
                labelPost4DateTime.textColor = FONT_COLOR_POST_DATE;
                labelPost4DateTime.lineLimit = 1
                labelPost4DateTime.minimumScaleFactor = 0.5

                const labelPost4Headline = stackColumn4.addText(data.post4Title);
                labelPost4Headline.font = Font.heavyMonospacedSystemFont(12);
                labelPost4Headline.textColor = FONT_COLOR_HEADLINE;
                labelPost4Headline.lineLimit = 2;

                if (POST_IMAGES == true) {
                    stackRow4.addSpacer();
                    var post4IMG = await getImage(data.post4Thumbnail);
                    post4IMG = stackRow4.addImage(post4IMG);
                    post4IMG.imageSize = new Size(45,45);
                    post4IMG.cornerRadius = 8;
                    post4IMG.rightAlignImage();
                }

                list.addSpacer();
                
                // row for post 5
                const stackRow5 = list.addStack();
                stackRow5.layoutHorizontally();
                stackRow5.url = data.post5URL;

                const stackColumn5 = stackRow5.addStack();
                stackColumn5.layoutVertically();

                const labelPost5DateTime = stackColumn5.addText(convertDateString(data.post5DateTime));
                labelPost5DateTime.font = Font.heavyMonospacedSystemFont(12);
                labelPost5DateTime.textColor = FONT_COLOR_POST_DATE;
                labelPost5DateTime.lineLimit = 1
                labelPost5DateTime.minimumScaleFactor = 0.5

                const labelPost5Headline = stackColumn5.addText(data.post5Title);
                labelPost5Headline.font = Font.heavyMonospacedSystemFont(12);
                labelPost5Headline.textColor = FONT_COLOR_HEADLINE;
                labelPost5Headline.lineLimit = 2;

                if (POST_IMAGES == true) {
                    stackRow5.addSpacer();
                    var post5IMG = await getImage(data.post5Thumbnail);
                    post5IMG = stackRow5.addImage(post5IMG);
                    post5IMG.imageSize = new Size(45,45);
                    post5IMG.cornerRadius = 8;
                    post5IMG.rightAlignImage();
                }
            }
        }
    } else {
        const error_msg = list.addText("No data found");
        error_msg.font = Font.systemFont(10);
    }
    
    // widget background (single color or gradient)
    if (BACKGROUND_IMAGE_NAME != "none") {
        let imageLocalURL = await getLocalImage(BACKGROUND_IMAGE_NAME);
        if (imageLocalURL != "not found") {
            let customBackgroundImage = await Image.fromFile(imageLocalURL);
            list.backgroundImage = customBackgroundImage;
            
            if (BACKGROUND_IMAGE_GRADIENT == true) {
                // draw gradient over background image for better readability
                const gradient = new LinearGradient();
                gradient.locations = [0, 1];
                gradient.colors = [
                   new Color('#000000', 0.25),
                   new Color('#000000', 1)
                ];
                list.backgroundGradient = gradient;
            }
        } else {
            list.backgroundColor = BACKGROUND_COLOR;
        }
    } else if (BACKGROUND_GRADIENT == true) {
        const gradient = new LinearGradient();
        gradient.locations = [0, 1];
        gradient.colors = [
            BACKGROUND_GRADIENT_COLOR_TOP,
            BACKGROUND_GRADIENT_COLOR_BTM
        ];
        list.backgroundGradient = gradient;
    } else {
        list.backgroundColor = BACKGROUND_COLOR;
    }
    
    return list;
}

async function getData() {
    try {
        let loadedJSON = await new Request(JSON_API_URL).loadJSON();
        
        let post1Title, post2Title, post3Title, post4Title, post5Title;
        let post1DateTime, post2DateTime, post3DateTime, post4DateTime, post5DateTime;
        let post1ThumbnailURL, post2ThumbnailURL, post3ThumbnailURL, post4ThumbnailURL, post5ThumbnailURL;
        let post1URL, post2URL, post3URL, post4URL, post5URL;
        let post1BG;
        
        if (NUMBER_OF_POSTS >= 1) {
            post1Title = loadedJSON[0].title.rendered;
            post1Title = formatHeadline(post1Title);
            if (POST_IMAGES == true) {
                post1ThumbnailURL = await getMediaURL(loadedJSON[0].featured_media);
                post1ThumbnailURL = encodeURI(post1ThumbnailURL);
            }
            post1URL = loadedJSON[0].guid.rendered;
            post1DateTime = loadedJSON[0].date;
            
            if (WIDGET_SIZE == 'small') {
                let featuredMediaJSONURL = SITE_URL+"/wp-json/wp/v2/media/"+loadedJSON[0].featured_media;
                let loadedMediaJSON = await new Request(featuredMediaJSONURL).loadJSON();
                post1BG = loadedMediaJSON.media_details.sizes.medium_large.source_url;
                post1ThumbnailURL = encodeURI(post1BG);
            }
            
            if (NUMBER_OF_POSTS >= 2) {
                post2Title = loadedJSON[1].title.rendered;
                post2Title = formatHeadline(post2Title);
                post2DateTime = loadedJSON[1].date;
                if (POST_IMAGES == true) {
                    post2ThumbnailURL = await getMediaURL(loadedJSON[1].featured_media);
                    post2ThumbnailURL = encodeURI(post2ThumbnailURL);
                }
                post2URL = loadedJSON[1].guid.rendered;
                
                if (NUMBER_OF_POSTS == 5) {
                    post3Title = loadedJSON[2].title.rendered;
                    post3Title = formatHeadline(post3Title);
                    post3DateTime = loadedJSON[2].date;
                    if (POST_IMAGES == true) {
                        post3ThumbnailURL = await getMediaURL(loadedJSON[2].featured_media);
                        post3ThumbnailURL = encodeURI(post3ThumbnailURL);
                    }
                    post3URL = loadedJSON[2].guid.rendered;
                    
                    post4Title = loadedJSON[3].title.rendered;
                    post4Title = formatHeadline(post4Title);
                    post4DateTime = loadedJSON[3].date;
                    if (POST_IMAGES == true) {
                        post4ThumbnailURL = await getMediaURL(loadedJSON[3].featured_media);
                        post4ThumbnailURL = encodeURI(post4ThumbnailURL);
                    }
                    post4URL = loadedJSON[3].guid.rendered;
                    
                    post5Title = loadedJSON[4].title.rendered;
                    post5Title = formatHeadline(post5Title);
                    post5DateTime = loadedJSON[4].date;
                    if (POST_IMAGES == true) {
                        post5ThumbnailURL = await getMediaURL(loadedJSON[4].featured_media);
                        post5ThumbnailURL = encodeURI(post5ThumbnailURL);
                    }
                    post5URL = loadedJSON[4].guid.rendered;
                }
            }
        }
        
        const result = {
            post1Title: post1Title,
            post2Title: post2Title,
            post3Title: post3Title,
            post4Title: post4Title,
            post5Title: post5Title,
            post1DateTime: post1DateTime,
            post2DateTime: post2DateTime,
            post3DateTime: post3DateTime,
            post4DateTime: post4DateTime,
            post5DateTime: post5DateTime,
            post1Thumbnail: post1ThumbnailURL,
            post2Thumbnail: post2ThumbnailURL,
            post3Thumbnail: post3ThumbnailURL,
            post4Thumbnail: post4ThumbnailURL,
            post5Thumbnail: post5ThumbnailURL,
            post1URL: post1URL,
            post2URL: post2URL,
            post3URL: post3URL,
            post4URL: post4URL,
            post5URL: post5URL,
            post1BG: post1BG
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
    let dateTimeLocal = date_conv.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
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
