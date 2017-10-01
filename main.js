var oReq = new XMLHttpRequest();
var data;
var get = {};
var percentage = 0;
var container;
var full;
var empty;
var title;
var stats;
var participantId;
var updateRate;
var donationsSince;
var donationGoal;
var containerWidth;
var containerTop;
var titleText;
var titleSize;
var titleLetterSpacing;
var titleTop;
var titleLeft;
var titleColor;
var titleOutlineColor;
var titleOutlineWidth;
var statsSize;
var statsLetterSpacing;
var statsTop;
var statsColor;
var statsOutlineColor;
var statsOutlineWidth;

function usd(x) 
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseDonationsSince(param)
{
    if (param)
    {
        var yyyymmdd = param.split("-");
        return new Date(yyyymmdd[0], parseInt(yyyymmdd[1]) - 1, yyyymmdd[2]);
    }
    return null;
}

function init()
{
    // Get options from url
    if(document.location.toString().indexOf('?') !== -1) 
    {
        var query = document.location.toString().replace(/^.*?\?/, '').replace(/#.*$/, '').split('&');

        for(var i=0, l=query.length; i<l; i++) 
        {
           var aux = decodeURIComponent(query[i]).split('=');
           get[aux[0]] = aux[1];
        }
    }
    
    // Get options and set default values
    participantId = get['participantId'] || "247547";
    donationsSince = parseDonationsSince(get['donationsSince']);
    donationGoal = get['donationGoal'] || 0;
    updateRate = get['updateRate'] || 30;
    containerWidth = get['containerWidth'] || 1280;
    containerTop = get['containerTop'] || "0";
    titleText = get['title'] || "FUNDRAISING GOAL";
    titleSize = get['titleSize'] || "60";
    titleLetterSpacing = get['titleLetterSpacing'] || "8";
    titleTop = get['titleTop'] || "-10";
    titleLeft = get['titleLeft'] || "80";
    titleColor = get['titleColor'] || "ffe9a8";
    titleOutlineColor = get['titleOutlineColor'] || "000000";
    titleOutlineWidth = get['titleOutlineWidth'] || "1.5";
    statsSize = get['statsSize'] || "60";
    statsLetterSpacing = get['statsLetterSpacing'] || "8";
    statsTop = get['statsTop'] || "180";
    statsColor = get['statsColor'] || "bdef64";
    statsOutlineColor = get['statsOutlineColor'] || "000000";
    statsOutlineWidth = get['statsOutlineWidth'] || "1.5";
    
    // Get elements
    container = $("#container");
    full = $("#full");
    empty = $("#empty");
    title = $("#title");
    stats = $("#stats");
    
    // Setup layout
    container.width(containerWidth);
    container.height(300 * (containerWidth / 1280));
    full.css("top", containerTop);
    empty.css("top", containerTop);
    title.text(titleText);
    title.css("font-size", titleSize + "px");
    title.css("letter-spacing", titleLetterSpacing + "px");
    title.css("top", titleTop);
    title.css("left", titleLeft);
    title.css("color", titleColor);
    title.css("-webkit-text-stroke", titleOutlineWidth + "px #" + titleOutlineColor);
    stats.css("font-size", statsSize + "px");
    stats.css("letter-spacing", statsLetterSpacing + "px");
    stats.css("top", statsTop);
    stats.css("color", statsColor);
    stats.css("-webkit-text-stroke", statsOutlineWidth + "px #" + statsOutlineColor);
    
}

function handleResponse()
{
    var raisedAmount;
    var goalAmount;
    
    data = JSON.parse(this.responseText);
    
    if (donationsSince && donationGoal > 0)
    {
        goalAmount = Math.max(donationGoal, 1);
        raisedAmount = 0;
        data.forEach(function(donationData)
        {
            var date = new Date(donationData.createdOn);
            
            if (date >= donationsSince)
            {
                raisedAmount += donationData.donationAmount;
            }
        });
    }
    else
    {
        goalAmount = Math.max(data.fundraisingGoal, 1);
        raisedAmount = data.totalRaisedAmount;
    }
    percentage = Math.min(Math.max(raisedAmount / goalAmount, 0), 1);
    full.width(Math.ceil(containerWidth * percentage));
    empty.width(Math.floor(containerWidth * (1 - percentage)));
    full.css("background-size", containerWidth + "px auto");
    empty.css("background-size", containerWidth + "px auto");
    stats.text("$" + usd(raisedAmount) + " / $" + usd(goalAmount));
    console.log("Updated donations at: " + Date.now())
    
    window.setTimeout(function() { getData() }, updateRate * 1000);
}

function getData()
{
    var url;
    
    if (donationsSince && donationGoal > 0)
    {
        url = "https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participantDonations&participantID=" + participantId + "&format=json";
    }
    else
    {
        url = "https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=" + participantId + "&format=json";
    }
    
    oReq.open("GET", url);
    oReq.send();
}

$().ready(function()
{
    init();
    oReq.addEventListener("load", handleResponse);
    getData();
});