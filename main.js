/**@type {string[]} */
var get = {},
    /**@type {number} */
    percentage = 0,
    /**@type {string | number} */
    participantId,
    /**@type {number} */
    updateRate,
    /**@type {Date} */
    donationsSince,
    /**@type {number} */
    donationGoal,
    /**@type {number} */
    containerWidth,
    /**@type {number} */
    containerTop,
    /**@type {string} */
    sign = "$",
    /**@type {string[]} */
    query = [];

function parseDonationsSince(param) {
    if (param) {
        const yyyymmdd = param.split("-");
        return new Date(yyyymmdd[0], parseInt(yyyymmdd[1]) - 1, yyyymmdd[2]);
    } else return null;
}

function init() {
    // Get options from url
    if (document.location.toString().indexOf('?') !== -1) {
        query = document.location.toString().replace(/^.*?\?/, '').replace(/#.*$/, '').split('&');

        for (let i = 0; i < query.length; i++) {
            var aux = decodeURIComponent(query[i]).split('=');
            get[aux[0]] = aux[1];
        }
    }

    const title = {
        text: get ['title'] || "FUNDRAISING GOAL",
        size: get ['titleSize'] || "60",
        letterSpacing: get ['titleLetterSpacing'] || "8",
        top: get ['titleTop'] || "-10",
        left: get ['titleLeft'] || "80",
        color: get ['titleColor'] || "ffe9a8",
        outlineColor: get ['titleOutlineColor'] || "000000",
        outlineWidth: get ['titleOutlineWidth'] || "1.5"
    };
    const stats = {
        size: get ['statsSize'] || "60",
        letterSpacing: get ['statsLetterSpacing'] || "8",
        top: get ['statsTop'] || "180",
        color: get ['statsColor'] || "bdef64",
        outlineColor: get ['statsOutlineColor'] || "000000",
        outlineWidth: get ['statsOutlineWidth'] || "1.5"
    };

    // Get options and set default values
    participantId = get['participantId'] || '247547';
    donationsSince = parseDonationsSince(get['donationsSince']);
    donationGoal = get['donationGoal'] || 0;
    updateRate = get['updateRate'] || 30;
    containerWidth = get['containerWidth'] || 1280;
    containerTop = get['containerTop'] || '0';
    sign = get['sign'] || '$';

    // Get elements
    let jtitle = $("#title");
    let jstats = $("#stats");

    // Setup layout
    $("#container").width(containerWidth);
    $("#container").height(300 * (containerWidth / 1280));
    $("#full").css("top", containerTop);
    $("#empty").css("top", containerTop);
    jtitle.text(title.text);
    jtitle.css("font-size", title.size + "px");
    jtitle.css("letter-spacing", title.letterSpacing + "px");
    jtitle.css("top", title.top);
    jtitle.css("left", title.left);
    jtitle.css("color", title.color);
    jtitle.css("-webkit-text-stroke", title.outlineWidth + "px #" + title.outlineColor);
    jstats.css("font-size", stats.size + "px");
    jstats.css("letter-spacing", stats.letterSpacing + "px");
    jstats.css("top", stats.top);
    jstats.css("color", stats.color);
    jstats.css("-webkit-text-stroke", stats.outlineWidth + "px #" + stats.outlineColor);
}

function usd(x) {
    return sign + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function jgetData() {
    const url = donationsSince && donationGoal > 0 ?
        `https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participantDonations&participantID=${participantId}&format=json` :
        `https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=${participantId}&format=json`;

    $.ajax({
        url: url,
        type: "GET",
        success: (data) => {
            let raisedAmount,
                goalAmount;

            if (donationsSince && donationGoal > 0) {
                goalAmount = Math.max(donationGoal, 1);
                raisedAmount = 0;
                data.forEach((donationData) => {
                    if (new Date(donationData.createdOn) >= donationsSince)
                        raisedAmount += donationData.donationAmount;
                });
            } else {
                goalAmount = Math.max(data.fundraisingGoal, 1);
                raisedAmount = data.totalRaisedAmount;
            }
            percentage = Math.min(Math.max(raisedAmount / goalAmount, 0), 1);
            $("#full").width(Math.ceil(containerWidth * percentage));
            $("#empty").width(Math.floor(containerWidth * (1 - percentage)));
            $("#full").css("background-size", `${containerWidth}px auto`);
            $("#empty").css("background-size", `${containerWidth}px auto`);
            $("#stats").text(`${usd(raisedAmount)} / ${usd(goalAmount)}`);
            console.log(`Updated donations at: ${new Date()}`);

            setTimeout(jgetData, updateRate * 1000);
        },
        error: (data) => {
            console.error(data);
            setTimeout(jgetData, 10000); // 10sec retry
        }
    });
}

$(document).ready(() => {
    init();
    jgetData();
});