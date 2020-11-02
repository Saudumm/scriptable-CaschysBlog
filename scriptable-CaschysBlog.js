// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: city;
// v1.6.0 coded by Saudumm (https://twitter.com/saudumm)
// GitHub: https://github.com/Saudumm/scriptable-CaschysBlog

/*  WIDGET PARAMETERS: you can long press on the widget on your homescreen and edit parameters
 - example: small|https://www.stadt-bremerhaven.de|Caschys Blog|background.jpg|false|true
 - parameter order has to be: widget size, site url, site name, background image, blur background image, background image gradient
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
 BG_IMAGE_BLUR: true if you want background images to be blurred, false if not
 BG_IMAGE_GRADIENT: true = gradient over the background image, false = no gradient
*/
var WIDGET_SIZE = "small";
var SITE_URL = "https://www.stadt-bremerhaven.de";
var SITE_NAME = "Caschys Blog";
var BG_IMAGE_NAME = "none";
var BG_IMAGE_BLUR = "true";
var BG_IMAGE_GRADIENT = "true";

/*  COLOR CONFIG: You can edit almost all colors of your widget
 SHOW_POST_IMAGES: true = display images next to the post headlines; set to false if you don't want images next to posts
 - Note: combining SHOW_POST_IMAGES = true + WIDGET_SIZE = small will ignore BG_GRADIENT_COLOR values in small config widgets
 BG_GRADIENT: widget background; true = use gradient; false = single background color
 BG_COLOR: background color value if BG_GRADIENT = false
 BG_GRADIENT_COLOR_TOP: gradient color at the top
 BG_GRADIENT_COLOR_BTM: gradient color at the bottom
 BG_GRADIENT_OVERLAY_TOP: gradient background image overlay color top
 BG_GRADIENT_OVERLAY_BTM: gradient background image overlay color bottom
 FONT_COLOR_SITENAME: font color of the website name (SITE_NAME)
 FONT_COLOR_POST_DATE: font color of the date/time label
 FONT_COLOR_HEADLINE: font color of the post title
*/
const SHOW_POST_IMAGES = true;
var BG_GRADIENT = false;
const BG_COLOR = new Color("#1c1c1e");
var BG_GRADIENT_COLOR_TOP = new Color("#222222");
var BG_GRADIENT_COLOR_BTM = new Color("#444444");
const BG_GRADIENT_OVERLAY_TOP = new Color("#1c1c1e", 0.3);
const BG_GRADIENT_OVERLAY_BTM = new Color("#1c1c1e", 1.0);
const FONT_COLOR_SITENAME = Color.white();
const FONT_COLOR_POST_DATE = Color.gray();
const FONT_COLOR_HEADLINE = Color.white();

// DO NOT CHANGE ANYTHING BELOW!
// Unless you know what you're doing.
// Unlike me, I don't know what I'm doing.
if (args.widgetParameter) {
  let param = args.widgetParameter.split("|");
  if (param.length >= 1) {WIDGET_SIZE = param[0];}
  if (param.length >= 2) {SITE_URL = param[1];}
  if (param.length >= 3) {SITE_NAME = param[2];}
  if (param.length >= 4) {BG_IMAGE_NAME = param[3];}
  if (param.length >= 5) {BG_IMAGE_BLUR = param[4];}
  if (param.length >= 6) {BG_IMAGE_GRADIENT = param[5];}
}

// set the number of posts depending on WIDGET_SIZE
var POST_COUNT = 1;
switch (WIDGET_SIZE) {
  case "small":
    POST_COUNT = 1;
    break;
  case "medium":
    POST_COUNT = 2;
    break;
  case "large":
    POST_COUNT = 5;
    break;
}

// JSON URL of WP Posts (WordPress Standard)
const JSON_API_URL = SITE_URL+"/wp-json/wp/v2/posts";

// check directories
checkFileDirs()

// Create Widget
let widget = await createWidget();

if (!config.runsInWidget) {
  switch (WIDGET_SIZE) {
    case "small":
      await widget.presentSmall();
      break;
    case "medium":
      await widget.presentMedium();
      break;
    case "large":
      await widget.presentLarge();
      break;
  }
}

Script.setWidget(widget);
Script.complete();

// create the widget
// parameter: none
// result: an awesome widget
async function createWidget() {
  const postData = await getData();
  const list = new ListWidget();
  
  // display name of the website
  const siteName = list.addText(SITE_NAME.toUpperCase());
  siteName.font = Font.heavySystemFont(13);
  siteName.textColor = FONT_COLOR_SITENAME;
  
  list.addSpacer();
  
  if (postData) {
    if (POST_COUNT == 1) {
      // load widget background image (if SHOW_POST_IMAGES = true or BG_IMAGE_NAME is set)
      if (SHOW_POST_IMAGES == true && BG_IMAGE_NAME == "none") {
        let postBGImage = await loadPostImage(postData.arrPostIMGPaths[0]);
        if (BG_IMAGE_BLUR == "true") {postBGImage = await blurImage(postBGImage, 2, 2);}
        list.backgroundImage = postBGImage;
        
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
      
      const labelDateTime = postStack.addText(convertJSONDateString(postData.arrPostDates[0]));
      labelDateTime.font = Font.heavySystemFont(12);
      labelDateTime.textColor = FONT_COLOR_POST_DATE;
      labelDateTime.lineLimit = 1;
      labelDateTime.minimumScaleFactor = 0.5;
      
      const labelHeadline = postStack.addText(postData.arrPostTitles[0]);
      labelHeadline.font = Font.heavySystemFont(12);
      labelHeadline.textColor = FONT_COLOR_HEADLINE;
      labelHeadline.lineLimit = 3;
      
      list.url = postData.arrPostURLs[0];
    } else {
      let arrStackRow = [];
      arrStackRow.length = POST_COUNT;
      let arrStackCol = [];
      arrStackCol.length = POST_COUNT;
      let arrLblPostDate = [];
      arrLblPostDate.length = POST_COUNT;
      let arrLblPostTitle = [];
      arrLblPostTitle.length = POST_COUNT;
      let arrLblPostIMG = [];
      arrLblPostIMG.length = POST_COUNT;
      
      let i;
      for (i = 0; i < POST_COUNT; i++) {
        arrStackRow[i] = list.addStack();
        arrStackRow[i].layoutHorizontally();
        arrStackRow[i].url = postData.arrPostURLs[i];
        
        arrStackCol[i] = arrStackRow[i].addStack();
        arrStackCol[i].layoutVertically();
        
        arrLblPostDate[i] = arrStackCol[i].addText(convertJSONDateString(postData.arrPostDates[i]));
        arrLblPostDate[i].font = Font.heavySystemFont(12);
        arrLblPostDate[i].textColor = FONT_COLOR_POST_DATE;
        arrLblPostDate[i].lineLimit = 1;
        arrLblPostDate[i].minimumScaleFactor = 0.5;
        
        arrLblPostTitle[i] = arrStackCol[i].addText(postData.arrPostTitles[i]);
        arrLblPostTitle[i].font = Font.heavySystemFont(12);
        arrLblPostTitle[i].textColor = FONT_COLOR_HEADLINE;
        arrLblPostTitle[i].lineLimit = 2;
        
        if (SHOW_POST_IMAGES == true) {
          arrStackRow[i].addSpacer();
          arrLblPostIMG[i] = await loadSmallPostImage(postData.arrPostIMGPaths[i]);
          arrLblPostIMG[i] = await cropImage(arrLblPostIMG[i]);
          arrLblPostIMG[i] = arrStackRow[i].addImage(arrLblPostIMG[i]);
          arrLblPostIMG[i].imageSize = new Size(45,45);
          arrLblPostIMG[i].cornerRadius = 8;
          arrLblPostIMG[i].rightAlignImage();
        }
        
        if (i < POST_COUNT-1) {list.addSpacer();}
      }
    }
  } else {
    const err_msg = list.addText("Couldn't load data");
    err_msg.font = Font.regularSystemFont(12);
    err_msg.textColor = FONT_COLOR_HEADLINE;
  }
  
  // widget background (single color or gradient)
  if (BG_IMAGE_NAME != "none") {
    let bgImagePath = await loadBGImage(BG_IMAGE_NAME);
    if (bgImagePath != "not found") {
      let customBGImage
      if (BG_IMAGE_BLUR == "true") {
        let fm = await newFileManager();
        customBGImage = await fm.readImage(bgImagePath);
        customBGImage = await blurImage(customBGImage, 2, 4);
      } else {
        customBGImage = await Image.fromFile(bgImagePath);
      }
      list.backgroundImage = customBGImage;
      
      if (BG_IMAGE_GRADIENT == "true") {
        // draw gradient over background image for better readability
        const gradient = new LinearGradient();
        gradient.locations = [0, 1];
        gradient.colors = [BG_GRADIENT_OVERLAY_TOP, BG_GRADIENT_OVERLAY_BTM];
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

// get all the data for the widget - this is where the magic happens
// parameter: nothing at all
// result: a buttload of post data
async function getData() {
  try {
    let loadedJSON = await new Request(JSON_API_URL).loadJSON();
    
    let POSTS_TO_LOAD = 5;

    let arrPostDates = [];
    arrPostDates.length = POSTS_TO_LOAD;
    let arrPostTitles = [];
    arrPostTitles.length = POSTS_TO_LOAD;
    let arrPostURLs = [];
    arrPostURLs.length = POSTS_TO_LOAD;
    let arrPostIMGURLs = [];
    arrPostIMGURLs.length = POSTS_TO_LOAD;
    let arrPostIMGPaths = [];
    arrPostIMGPaths.length = POSTS_TO_LOAD;
    let arrPostFileNames = [];
    arrPostFileNames.length = POSTS_TO_LOAD;
    
    let i;
    for (i = 0; i < POSTS_TO_LOAD; i++) {
      arrPostDates[i] = loadedJSON[i].date;
      
      arrPostTitles[i] = loadedJSON[i].title.rendered;
      arrPostTitles[i] = formatPostTitle(arrPostTitles[i]);
      
      arrPostURLs[i] = loadedJSON[i].guid.rendered;
      
      if (SHOW_POST_IMAGES == true) {
        arrPostIMGURLs[i] = await getMediaURL(loadedJSON[i].featured_media);
        arrPostIMGPaths[i] = await getImagePath(arrPostIMGURLs[i], loadedJSON[i].id);
        arrPostFileNames[i] = await getFileName(arrPostIMGURLs[i], loadedJSON[i].id);
        await downloadPostImage(arrPostIMGPaths[i], arrPostIMGURLs[i]);
      }
    }
    
    if (SHOW_POST_IMAGES == true) {await cleanUpImages(arrPostFileNames);}
    
    const result = {
      arrPostDates: arrPostDates,
      arrPostTitles: arrPostTitles,
      arrPostURLs: arrPostURLs,
      arrPostIMGPaths: arrPostIMGPaths
    };
    
    return result;
  } catch (e) {
    return null;
  }
}

// format the post title and replace all html entities with characters
// parameter: string of the title
// result: string with the title, readable by a human
function formatPostTitle(strHeadline) {
  strHeadline = strHeadline.replaceAll("&quot;", '"');
  strHeadline = strHeadline.replaceAll("&amp;", "&");
  strHeadline = strHeadline.replaceAll("&lt;", "<");
  strHeadline = strHeadline.replaceAll("&gt;", ">");
  strHeadline = strHeadline.replaceAll("&#034;", '"');
  strHeadline = strHeadline.replaceAll("&#038;", "&");
  strHeadline = strHeadline.replaceAll("&#060;", "<");
  strHeadline = strHeadline.replaceAll("&#062;", ">");
  strHeadline = strHeadline.replaceAll("&#338;", "Œ");
  strHeadline = strHeadline.replaceAll("&#339;", "œ");
  strHeadline = strHeadline.replaceAll("&#352;", "Š");
  strHeadline = strHeadline.replaceAll("&#353;", "š");
  strHeadline = strHeadline.replaceAll("&#376;", "Ÿ");
  strHeadline = strHeadline.replaceAll("&#710;", "ˆ");
  strHeadline = strHeadline.replaceAll("&#732;", "˜");
  strHeadline = strHeadline.replaceAll("&#8211;", "–");
  strHeadline = strHeadline.replaceAll("&#8212;", "—");
  strHeadline = strHeadline.replaceAll("&#8216;", "‘");
  strHeadline = strHeadline.replaceAll("&#8217;", "’");
  strHeadline = strHeadline.replaceAll("&#8218;", "‚");
  strHeadline = strHeadline.replaceAll("&#8220;", "“");
  strHeadline = strHeadline.replaceAll("&#8221;", "”");
  strHeadline = strHeadline.replaceAll("&#8222;", "„");
  strHeadline = strHeadline.replaceAll("&#8224;", "†");
  strHeadline = strHeadline.replaceAll("&#8225;", "‡");
  strHeadline = strHeadline.replaceAll("&#8230;", "…");
  strHeadline = strHeadline.replaceAll("&#8240;", "‰");
  strHeadline = strHeadline.replaceAll("&#8249;", "‹");
  strHeadline = strHeadline.replaceAll("&#8250;", "›");
  strHeadline = strHeadline.replaceAll("&#8364;", "€");
  
  return strHeadline;
}

// convert the WordPress date and time to something a human can read
// parameter: string with date and time (from WordPress)
// result: a nicely formatted date and time
function convertJSONDateString(strDate) {
  let date_conv = new Date(strDate);
  let dateTimeLocal = date_conv.toLocaleString([], {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"})
  return dateTimeLocal
}

// get the featuredMedia image URL
// parameter: featureMedia ID
// result: encoded URL to the image file on the server
async function getMediaURL(featuredMedia) {
  let featuredMediaJSONURL = SITE_URL+"/wp-json/wp/v2/media/"+featuredMedia;
  let loadedMediaJSON = await new Request(featuredMediaJSONURL).loadJSON();
  let mediaURL = loadedMediaJSON.source_url;
  mediaURL = await encodeURI(mediaURL);
  return mediaURL;
}

// set the filename of the post image (site name + image id + file extension)
// parameter: url to the image, id of the image
// result: filename of the image
function getFileName(url, id) {
  let extension = /(?:\.([^.]+))?$/.exec(url)[0];
  let site_id = SITE_NAME.replace(/[^a-zA-Z]+/g, "").toLowerCase();
  return site_id+"-"+id+extension;
}

// set the complete file path for the image
// parameter: url to the image, id of the image
// result: local filepath of the image
function getImagePath(url, id) {
  let fm = newFileManager();
  
  let docDir = fm.documentsDirectory();
  let postImageDir = docDir+"/wordpress-widget-data/post-images";
  
  // set fileName
  let fileName = getFileName(url, id);
  // join path
  let path = fm.joinPath(postImageDir, fileName);
  
  return path;
}

// download the post image (if it doesn't already exist)
// parameter: path to the image, url to the image on the interwebs
// result: a nice and warm feeling
async function downloadPostImage(path, url) {
  let fm = newFileManager();
  
  let image;
  
  // check if file already exists
  if (fm.fileExists(path)) {
    await fm.downloadFileFromiCloud(path);
  } else {
    // download and store image
    let req = await new Request(url);
    let loadedImage = await req.load();
    
    await fm.write(path, loadedImage);
  }
  
  return;
}

// load post image from file path
// parameter: path to the image
// result: image
function loadPostImage(path) {
  let fm = newFileManager();
  if (fm.fileExists(path)) {
    fm.downloadFileFromiCloud(path);
    let image = fm.readImage(path);
    
    return image;
  }
}

// load post image from file path and resize it
// parameter: path to the image
// result: image
function loadSmallPostImage(path) {
  let fm = newFileManager();
  if (fm.fileExists(path)) {
    fm.downloadFileFromiCloud(path);
    let image = fm.readImage(path);
    image = resizeImage(image, 4);
    
    return image;
  }
}

// search for and load a local (or iCloud) background image
// parameter: filename of the image (case sensitive!)
// result: path to the image or "not found" if image doesn't exist
async function loadBGImage(imageName) {
  let fm = newFileManager();
  let docDir = fm.documentsDirectory();
  let bgImageDir = docDir+"/wordpress-widget-data/background-images";
  
  let bgImagePathDocDir = fm.joinPath(docDir, imageName)
  let bgImagePathBGDir = fm.joinPath(bgImageDir, imageName)
  
  if (fm.fileExists(bgImagePathDocDir)) {
    return bgImagePathDocDir;
  } else if (fm.fileExists(bgImagePathBGDir)) {
    return bgImagePathBGDir;
  } else {
    return "not found";
  }
}

// create a new FileManager (iCloud or local)
// parameter: nothing
// result: FileManager
function newFileManager() {
  let fm;
  try {
    fm = FileManager.iCloud();
  } catch(e) {
    fm = FileManager.local();
  }
  return fm;
}

// check if all folders are available and create them if needed
// parameter: none
// result: new directories if needed
function checkFileDirs() {
  // Create new FileManager and set data dir
  let fm = newFileManager();
  let docDir = fm.documentsDirectory();
  let postImageDir = docDir+"/wordpress-widget-data/post-images";
  let bgImageDir = docDir+"/wordpress-widget-data/background-images";
  
  if (!fm.fileExists(postImageDir)) {fm.createDirectory(postImageDir, true);}
  if (!fm.fileExists(bgImageDir)) {fm.createDirectory(bgImageDir, true);}
}

// cleanup post image files
// parameter: array with image filenames that are needed at the moment
// result: a nice and clean data folder
function cleanUpImages(arrFileNames) {
  let fm = newFileManager();
  let docDir = fm.documentsDirectory();
  let postImageDir = docDir+"/wordpress-widget-data/post-images";
  
  let arrFiles = fm.listContents(postImageDir);
 
  let site_id = SITE_NAME.replace(/[^a-zA-Z]+/g, "").toLowerCase();
  
  let arrFilesSite = [];
  
  for (i = 0; i < arrFiles.length; i++) {
    if (arrFiles[i].substring(0, site_id.length) === site_id) {arrFilesSite.push(arrFiles[i]);}
  }
  
  for (i = 0; i < arrFilesSite.length; i++) {
    if (!arrFileNames.includes(arrFilesSite[i])) {
      let path = fm.joinPath(postImageDir, arrFilesSite[i]);
      fm.remove(path);
    }
  }
}

// blur the background image
// parameter: image, downscale factor, strength of blur effect
// result: blurry image (well, it's better than nothing)
async function blurImage(img, resFactor, blurStrength) {
  /*
   A big THANK YOU to Mario Klingemann for the Blur Code and Max Zeryck for the WebView Code
   code taken and modified from: https://github.com/mzeryck/Widget-Blur
   Follow @mzeryck on Twitter: https://twitter.com/mzeryck
  */
  
  const js = `
    /*
     StackBlur - a fast almost Gaussian Blur For Canvas
     Version:   0.5
     Author:    Mario Klingemann
     Contact:   mario@quasimondo.com
     Website:   http://quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
     Twitter:   @quasimondo
     In case you find this class useful - especially in commercial projects -
     I am not totally unhappy for a small donation to my PayPal account
     mario@quasimondo.de
     Or support me on flattr:
     https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript
     Copyright (c) 2010 Mario Klingemann
     Permission is hereby granted, free of charge, to any person
     obtaining a copy of this software and associated documentation
     files (the "Software"), to deal in the Software without
     restriction, including without limitation the rights to use,
     copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the
     Software is furnished to do so, subject to the following
     conditions:
     The above copyright notice and this permission notice shall be
     included in all copies or substantial portions of the Software.
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     OTHER DEALINGS IN THE SOFTWARE.
    */
    var mul_table = [512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
                     454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
                     482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
                     437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
                     497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
                     320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
                     446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
                     329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
                     505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
                     399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
                     324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
                     268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
                     451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
                     385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
                     332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
                     289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
    
    var shg_table = [ 9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
                     17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
                     19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
                     20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
                     21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
                     21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
                     22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
                     22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
                     23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                     23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                     23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                     23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                     24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                     24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                     24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                     24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];
    
    function stackBlurCanvasRGB(id, top_x, top_y, width, height, radius) {
      if (isNaN(radius) || radius < 1) {return;}
      radius |= 0;
      
      var canvas  = document.getElementById(id);
      var context = canvas.getContext("2d");
      var imageData;
      
      try {
        imageData = context.getImageData(top_x, top_y, width, height);
      } catch(e) {
        alert("Cannot access image");
        throw new Error("unable to access image data: " + e);
      }
      
      var pixels = imageData.data;
      
      var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
      r_out_sum, g_out_sum, b_out_sum,
      r_in_sum, g_in_sum, b_in_sum,
      pr, pg, pb, rbs;
      
      var div = radius + radius + 1;
      var w4 = width << 2;
      var widthMinus1  = width - 1;
      var heightMinus1 = height - 1;
      var radiusPlus1  = radius + 1;
      var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
      
      var stackStart = new BlurStack();
      var stack = stackStart;
      for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i == radiusPlus1) var stackEnd = stack;
      }
      stack.next = stackStart;
      var stackIn = null;
      var stackOut = null;
      
      yw = yi = 0;
      
      var mul_sum = mul_table[radius];
      var shg_sum = shg_table[radius];
      
      for (y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
        
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        
        stack = stackStart;
        
        for (i = 0; i < radiusPlus1; i++) {
          stack.r = pr;
          stack.g = pg;
          stack.b = pb;
          stack = stack.next;
        }
        
        for (i = 1; i < radiusPlus1; i++) {
          p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
          r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
          g_sum += (stack.g = (pg = pixels[p+1])) * rbs;
          b_sum += (stack.b = (pb = pixels[p+2])) * rbs;
          
          r_in_sum += pr;
          g_in_sum += pg;
          b_in_sum += pb;
          
          stack = stack.next;
        }
        
        
        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
          pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
          pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
          pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
          
          r_sum -= r_out_sum;
          g_sum -= g_out_sum;
          b_sum -= b_out_sum;
          
          r_out_sum -= stackIn.r;
          g_out_sum -= stackIn.g;
          b_out_sum -= stackIn.b;
          
          p =  (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
          
          r_in_sum += (stackIn.r = pixels[p]);
          g_in_sum += (stackIn.g = pixels[p+1]);
          b_in_sum += (stackIn.b = pixels[p+2]);
          
          r_sum += r_in_sum;
          g_sum += g_in_sum;
          b_sum += b_in_sum;
          
          stackIn = stackIn.next;
          
          r_out_sum += (pr = stackOut.r);
          g_out_sum += (pg = stackOut.g);
          b_out_sum += (pb = stackOut.b);
          
          r_in_sum -= pr;
          g_in_sum -= pg;
          b_in_sum -= pb;
          
          stackOut = stackOut.next;
          yi += 4;
        }
        yw += width;
      }
      
      for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
        
        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        
        stack = stackStart;
        
        for (i = 0; i < radiusPlus1; i++) {
          stack.r = pr;
          stack.g = pg;
          stack.b = pb;
          stack = stack.next;
        }
        
        yp = width;
        
        for (i = 1; i <= radius; i++) {
          yi = (yp + x) << 2;
          
          r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
          g_sum += (stack.g = (pg = pixels[yi+1])) * rbs;
          b_sum += (stack.b = (pb = pixels[yi+2])) * rbs;
          
          r_in_sum += pr;
          g_in_sum += pg;
          b_in_sum += pb;
          
          stack = stack.next;
          
          if (i < heightMinus1) {yp += width;}
        }
        
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
          p = yi << 2;
          pixels[p]   = (r_sum * mul_sum) >> shg_sum;
          pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
          pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
          
          r_sum -= r_out_sum;
          g_sum -= g_out_sum;
          b_sum -= b_out_sum;
          
          r_out_sum -= stackIn.r;
          g_out_sum -= stackIn.g;
          b_out_sum -= stackIn.b;
          
          p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;
          
          r_sum += (r_in_sum += (stackIn.r = pixels[p]));
          g_sum += (g_in_sum += (stackIn.g = pixels[p+1]));
          b_sum += (b_in_sum += (stackIn.b = pixels[p+2]));
          
          stackIn = stackIn.next;
          
          r_out_sum += (pr = stackOut.r);
          g_out_sum += (pg = stackOut.g);
          b_out_sum += (pb = stackOut.b);
          
          r_in_sum -= pr;
          g_in_sum -= pg;
          b_in_sum -= pb;
          
          stackOut = stackOut.next;
          
          yi += width;
        }
      }
      
      context.putImageData(imageData, top_x, top_y);
    }
    
    function BlurStack() {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
      this.next = null;
    }
    
    // Set up the canvas
    const img = document.getElementById("blurImg");
    const canvas = document.getElementById("mainCanvas");
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const maxW = w / ${resFactor};
    const maxH = h / ${resFactor};
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = maxW;
    canvas.height = maxH;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, w, h);
    context.drawImage(img, 0, 0, maxW, maxH);
    
    // Get the image data from the context
    var imageData = context.getImageData(0,0,w,h);
    // Draw over the old image
    context.putImageData(imageData,0,0);
    // Blur the image
    stackBlurCanvasRGB("mainCanvas", 0, 0, w, h, ${blurStrength});
    // Return a base64 representation
    canvas.toDataURL();
  `;
  
  // Convert the images and create the HTML
  let blurImgData = Data.fromPNG(img).toBase64String();
  let html = `<img id="blurImg" src="data:image/png;base64,${blurImgData}" /><canvas id="mainCanvas" />`;
  
  // Make the web view and get its return value
  let view = new WebView();
  await view.loadHTML(html);
  let returnValue = await view.evaluateJavaScript(js);
  
  // Remove the data type from the string and convert to data
  let imageDataString = returnValue.slice(22);
  let imageData = Data.fromBase64String(imageDataString);
  
  // Convert to image before returning
  let imageFromData = Image.fromData(imageData);
  return imageFromData;
}

// resize the background image
// parameter: image, downscale factor
// result: resized image (duh)
async function resizeImage(img, resFactor) {
  const js = `
    // Set up the canvas
    const img = document.getElementById("resImg");
    const canvas = document.getElementById("mainCanvas");
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const maxW = w / ${resFactor};
    const maxH = h / ${resFactor};
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = maxW;
    canvas.height = maxH;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, w, h);
    context.drawImage(img, 0, 0, maxW, maxH);
    
    // Get the image data from the context
    var imageData = context.getImageData(0,0,w,h);
    // Draw over the old image
    context.putImageData(imageData,0,0);
    // Return a base64 representation
    canvas.toDataURL();
  `;
  
  // Convert the images and create the HTML
  let resImgData = Data.fromPNG(img).toBase64String();
  let html = `<img id="resImg" src="data:image/png;base64,${resImgData}" /><canvas id="mainCanvas" />`;
  
  // Make the web view and get its return value
  let view = new WebView();
  await view.loadHTML(html);
  let returnValue = await view.evaluateJavaScript(js);
  
  // Remove the data type from the string and convert to data
  let imageDataString = returnValue.slice(22);
  let imageData = Data.fromBase64String(imageDataString);
  
  // Convert to image before returning
  let imageFromData = Image.fromData(imageData);
  
  return imageFromData;
}

// crop the image to a rectangle (to be honest, it's a square)
// parameter: image
// result: square image
function cropImage(img) {
  let height = img.size.height;
  let width = img.size.width;
  
  let imgShortSide = Math.min(height, width);
  let imgLongSide = Math.max(height, width);
  
  if (imgShortSide != imgLongSide) {
    let imgCropTotal = imgLongSide - imgShortSide;
    let imgCropSide = Math.floor(imgCropTotal / 2);
    
    let rect;
    switch (imgShortSide) {
      case height:
        rect = new Rect(imgCropSide, 0, imgShortSide, imgShortSide);
        break;
      case width:
        rect = new Rect(0, imgCropSide, imgShortSide, imgShortSide);
        break;
    }
    
    let draw = new DrawContext();
    draw.size = new Size(rect.width, rect.height);
    
    draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y));
    img = draw.getImage();
  }
  
  return img;
}
