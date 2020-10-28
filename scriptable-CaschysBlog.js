// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: city;
// coded by Saudumm

// WIDGET CONFIG
// Grundkonfiguration, lässt sich durch Widget Parameter überschreiben
var WIDGET_SIZE = 'small' // small, medium, large

// COLOR CONFIG FÜR MEDIUM  UND LARGE WIDGET
const BACKGROUND_GRADIENT = false // Widget Hintergrund; true = Farbverlauf, false = einfarbig
const BACKGROUND_COLOR = "#1c1c1e" // Wird verwendet wenn BACKGROUND_GRADIENT = false
const BACKGROUND_GRADIENT_COLOR_TOP = "#48484a" // Farbverlauf Farbe oben
const BACKGROUND_GRADIENT_COLOR_BTM = "#2c2c2e" // Farbverlauf Farbe unten

// DO NOT CHANGE
// JSON URL für Posts (Wordpress Standard)
if (args.widgetParameter) {
    WIDGET_SIZE = args.widgetParameter
} else {
    WIDGET_SIZE = WIDGET_SIZE
}
var NUMBER_OF_POSTS = 2
switch (WIDGET_SIZE) {
    case 'small':
        NUMBER_OF_POSTS = 1;
        break
    case 'medium':
        NUMBER_OF_POSTS = 2;
        break
    case 'large':
        NUMBER_OF_POSTS = 5;
        break
}
const JSON_API_URL = "https://www.stadt-bremerhaven.de/wp-json/wp/v2/posts/?filter[category_name]=country&per_page="+NUMBER_OF_POSTS

let widget = await createWidget()

if (!config.runsInWidget) {
    switch (WIDGET_SIZE) {
        case 'small':
            await widget.presentSmall();
            break
        case 'medium':
            await widget.presentMedium();
            break
        case 'large':
            await widget.presentLarge();
            break
    }
}

Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
    const data = await getData()
    const list = new ListWidget()

    const siteName = list.addText('Caschys Blog'.toUpperCase());
    siteName.font = Font.heavyMonospacedSystemFont(13)

    list.addSpacer()
    
    if (data) {
        if (NUMBER_OF_POSTS == 1) {
            // Hintergrundbild laden
            list.backgroundImage = await getImage(data.post1BG);

            // Gradient über Hintergrundbild, damit Text lesbar wird
            const gradient = new LinearGradient()
            gradient.locations = [0, 1]
            gradient.colors = [
                new Color('1c1c1e', 0.4),
                new Color('1c1c1e', 0.9)
            ]
            list.backgroundGradient = gradient
   
            // Für bessere Lesbarkeit ein kleiner Schatten um den Seitennamen
            siteName.shadowRadius = 1
            siteName.shadowColor = Color.black()
            
            const postStack = list.addStack()
            postStack.layoutVertically()

            const labelPost1DateTime = postStack.addText(convertDateString(data.post1DateTime));
            labelPost1DateTime.font = Font.heavyMonospacedSystemFont(12)
            labelPost1DateTime.textColor = Color.lightGray()
            
            const labelPost1Headline = postStack.addText(data.post1Title)
            labelPost1Headline.font = Font.heavyMonospacedSystemFont(12)
            labelPost1Headline.lineLimit = 3;
            
            list.url = data.post1URL
            
        } else if (NUMBER_OF_POSTS >= 2) {
            // Reihe für Post 1
            const stackRow1 = list.addStack()
            stackRow1.layoutHorizontally()
            stackRow1.url = data.post1URL

            const stackColumn1 = stackRow1.addStack()
            stackColumn1.layoutVertically()

            const labelPost1DateTime = stackColumn1.addText(convertDateString(data.post1DateTime));
            labelPost1DateTime.font = Font.heavyMonospacedSystemFont(12)
            labelPost1DateTime.textColor = Color.gray()

            const labelPost1Headline = stackColumn1.addText(data.post1Title)
            labelPost1Headline.font = Font.heavyMonospacedSystemFont(12)
            labelPost1Headline.lineLimit = 2;
        
            stackRow1.addSpacer()
            var post1IMG = await getImage(data.post1Thumbnail);
            post1IMG = stackRow1.addImage(post1IMG)
            post1IMG.imageSize = new Size(65,45)
            post1IMG.cornerRadius = 8
            post1IMG.rightAlignImage();
        
            list.addSpacer()

            // Reihe für Post 2
            const stackRow2 = list.addStack()
            stackRow2.layoutHorizontally()
            stackRow2.url = data.post2URL

            const stackColumn2 = stackRow2.addStack()
            stackColumn2.layoutVertically()

            const labelPost2DateTime = stackColumn2.addText(convertDateString(data.post2DateTime));
            labelPost2DateTime.font = Font.heavyMonospacedSystemFont(12)
            labelPost2DateTime.textColor = Color.gray()

            const labelPost2Headline = stackColumn2.addText(data.post2Title)
            labelPost2Headline.font = Font.heavyMonospacedSystemFont(12)
            labelPost2Headline.lineLimit = 2;

            stackRow2.addSpacer()
            var post2IMG = await getImage(data.post2Thumbnail);
            post2IMG = stackRow2.addImage(post2IMG)
            post2IMG.imageSize = new Size(65,45)
            post2IMG.cornerRadius = 8
            post2IMG.rightAlignImage();
            
            if (NUMBER_OF_POSTS == 5) {
                list.addSpacer()

                // Reihe für Post 3
                const stackRow3 = list.addStack()
                stackRow3.layoutHorizontally()
                stackRow3.url = data.post3URL

                const stackColumn3 = stackRow3.addStack()
                stackColumn3.layoutVertically()

                const labelPost3DateTime = stackColumn3.addText(convertDateString(data.post3DateTime));
                labelPost3DateTime.font = Font.heavyMonospacedSystemFont(12)
                labelPost3DateTime.textColor = Color.gray()

                const labelPost3Headline = stackColumn3.addText(data.post3Title);
                labelPost3Headline.font = Font.heavyMonospacedSystemFont(12);
                labelPost3Headline.lineLimit = 2;

                stackRow3.addSpacer()
                var post3IMG = await getImage(data.post3Thumbnail);
                post3IMG = stackRow3.addImage(post3IMG)
                post3IMG.imageSize = new Size(65,45)
                post3IMG.cornerRadius = 8
                post3IMG.rightAlignImage();
                
                list.addSpacer()
                
                // Reihe für Post 4
                const stackRow4 = list.addStack()
                stackRow4.layoutHorizontally()
                stackRow4.url = data.post4URL

                const stackColumn4 = stackRow4.addStack()
                stackColumn4.layoutVertically()

                const labelPost4DateTime = stackColumn4.addText(convertDateString(data.post4DateTime));
                labelPost4DateTime.font = Font.heavyMonospacedSystemFont(12)
                labelPost4DateTime.textColor = Color.gray()

                const labelPost4Headline = stackColumn4.addText(data.post4Title)
                labelPost4Headline.font = Font.heavyMonospacedSystemFont(12)
                labelPost4Headline.lineLimit = 2

                stackRow4.addSpacer()
                var post4IMG = await getImage(data.post4Thumbnail);
                post4IMG = stackRow4.addImage(post4IMG)
                post4IMG.imageSize = new Size(65,45)
                post4IMG.cornerRadius = 8
                post4IMG.rightAlignImage();

                list.addSpacer()
                
                // Reihe für Post 5
                const stackRow5 = list.addStack()
                stackRow5.layoutHorizontally()
                stackRow5.url = data.post5URL

                const stackColumn5 = stackRow5.addStack()
                stackColumn5.layoutVertically()

                const labelPost5DateTime = stackColumn5.addText(convertDateString(data.post5DateTime));
                labelPost5DateTime.font = Font.heavyMonospacedSystemFont(12)
                labelPost5DateTime.textColor = Color.gray()

                const labelPost5Headline = stackColumn5.addText(data.post5Title)
                labelPost5Headline.font = Font.heavyMonospacedSystemFont(12)
                labelPost5Headline.lineLimit = 2

                stackRow5.addSpacer()
                var post5IMG = await getImage(data.post5Thumbnail);
                post5IMG = stackRow5.addImage(post5IMG)
                post5IMG.imageSize = new Size(65,45)
                post5IMG.cornerRadius = 8
                post5IMG.rightAlignImage();
            }
        }
    } else {
        const error_msg = list.addText("Keine Daten gefunden")
        error_msg.font = Font.systemFont(10)
    }
    
    // Hintergrund des Widget (Gradient oder einzelne Farbe)
    if (BACKGROUND_GRADIENT == true) {
        const gradient = new LinearGradient()
        gradient.locations = [0, 1]
        gradient.colors = [
            new Color(BACKGROUND_GRADIENT_COLOR_TOP),
            new Color(BACKGROUND_GRADIENT_COLOR_BTM)
        ]
        list.backgroundGradient = gradient
    } else {
        list.backgroundColor = new Color(BACKGROUND_COLOR)
    }
    
    return list
}

async function getData() {
    try {
        let loadedJSON = await new Request(JSON_API_URL).loadJSON();
        
        let post1Title, post2Title, post3Title, post4Title, post5Title
        let post1DateTime, post2DateTime, post3DateTime, post4DateTime, post5DateTime
        let post1ThumbnailURL, post2ThumbnailURL, post3ThumbnailURL, post4ThumbnailURL, post5ThumbnailURL
        let post1URL, post2URL, post3URL, post4URL, post5URL
        let post1BG
        
        if (NUMBER_OF_POSTS >= 1) {
            post1Title = loadedJSON[0].title.rendered;
            post1Title = post1Title.replace("&#8211;", "-");
            post1ThumbnailURL = loadedJSON[0].jetpack_featured_media_url;
            //post1ThumbnailURL = post1ThumbnailURL.replace('.jpg', '-720x407.jpg');
            post1BG = loadedJSON[0].jetpack_featured_media_url;
            post1URL = loadedJSON[0].guid.rendered;
            post1DateTime = loadedJSON[0].date;
            
            if (NUMBER_OF_POSTS >= 2) {
                post2Title = loadedJSON[1].title.rendered;
                post2Title = post2Title.replace("&#8211;", "-");
                post2DateTime = loadedJSON[1].date;
                post2ThumbnailURL = loadedJSON[1].jetpack_featured_media_url;
                //post2ThumbnailURL = post2ThumbnailURL.replace('.jpg', '-720x407.jpg');
                post2URL = loadedJSON[1].guid.rendered;
                
                if (NUMBER_OF_POSTS == 5) {
                    post3Title = loadedJSON[2].title.rendered;
                    post3Title = post3Title.replace("&#8211;", "-");
                    post3DateTime = loadedJSON[2].date;
                    post3ThumbnailURL = loadedJSON[2].jetpack_featured_media_url;
                    //post3ThumbnailURL = post3ThumbnailURL.replace('.jpg', '-720x407.jpg');
                    post3URL = loadedJSON[2].guid.rendered;
                    
                    post4Title = loadedJSON[3].title.rendered;
                    post4Title = post4Title.replace("&#8211;", "-");
                    post4DateTime = loadedJSON[3].date;
                    post4ThumbnailURL = loadedJSON[3].jetpack_featured_media_url;
                    //post4ThumbnailURL = post4ThumbnailURL.replace('.jpg', '-720x407.jpg');
                    post4URL = loadedJSON[3].guid.rendered;
                    
                    post5Title = loadedJSON[4].title.rendered;
                    post5Title = post5Title.replace("&#8211;", "-");
                    post5DateTime = loadedJSON[4].date;
                    post5ThumbnailURL = loadedJSON[4].jetpack_featured_media_url;
                    //post5ThumbnailURL = post5ThumbnailURL.replace('.jpg', '-720x407.jpg');
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

function convertDateString(strDate) {
    var date_conv = new Date(strDate)
    const date = ('0' + date_conv.getDate()).slice(-2);
    const month = ('0' + (date_conv.getMonth() + 1)).slice(-2);
    const year = date_conv.getFullYear();
    const hours = ('0' + date_conv.getHours()).slice(-2);
    const minutes = ('0' + date_conv.getMinutes()).slice(-2);
    //const seconds = ('0' + date_news1.getSeconds()).slice(-2);
    return `${date}.${month}.${year} - ${hours}:${minutes}`;
}

async function getImage(url) {
  let req = new Request(url)
  return await req.loadImage()
}
