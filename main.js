var oReq = new XMLHttpRequest();
var data;
var updateRate;
var get = {};
var percentage = 0;
var container;
var containerWidth;
var containerTop;
var full;
var empty;
var title;
var stats;
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

function usd(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    
    // Set default option values
    containerWidth = get['containerWidth'] || 1280;
    containerTop = get['containerTop'] || "0";
    updateRate = get['updateRate'] || 10;
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
    console.log(top);
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
    data = JSON.parse(this.responseText);
    if (data.fundraisingGoal > 0)
    {
        percentage = data.totalRaisedAmount / data.fundraisingGoal;
    }
    else
    {
        percentage = 0;
    }
    
    percentage = Math.min(Math.max(percentage, 0), 1);
    full.width(Math.ceil(containerWidth * percentage));
    empty.width(Math.floor(containerWidth * (1 - percentage)));
    full.css("background-size", containerWidth + "px auto");
    empty.css("background-size", containerWidth + "px auto");
    stats.text("$" + usd(data.totalRaisedAmount) + " / $" + usd(data.fundraisingGoal));
    
    window.setTimeout(function() { getData() }, updateRate * 1000);
}

function getData()
{
    oReq.open("GET", "https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=247547&format=json");
    oReq.send();
}

$().ready(function()
{
    init();
    oReq.addEventListener("load", handleResponse);
    getData();
});