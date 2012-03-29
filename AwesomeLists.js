


$(document).ready(function () {

    $(".AwesomeNavigationList").each(function (navListIndex, navList) {

        $(navList).children("li").each(function (listElemIndex, listElem) {
            $(listElem).children(".AwesomeListArrowDivRight").click(function () {
                if ($(this).attr("class") == "AwesomeListArrowDivRight") {
                    $(this).attr("class", "AwesomeListArrowDivDown");
                    $(this).nextAll("ul").slideDown(250);
                } else {
                    $(this).attr("class", "AwesomeListArrowDivRight");
                    $(this).nextAll("ul").slideUp(250);
                }
            });
        });

        $(navList).find("a").each(function (linkIndex, linkElem) {
            if (String(window.location).RemoveSuffix("/").EndsWith($(linkElem).attr("href").RemoveSuffix("/"))) {
                $(linkElem).parents("li").each(function (listElemIndex, listElem) {
                    if ($(listElem).children(".AwesomeListArrowDivRight").length > 0) {
                        var expandImg = $(listElem).children(".AwesomeListArrowDivRight")[0];
                        $(expandImg).trigger("click");
                        $(expandImg).next().addClass("selectedParent");
                    }
                });

                $(linkElem).addClass("selected");
            }
        });
    });

});
   