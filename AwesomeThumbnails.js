$(document).ready(function () {

    $("head").prepend($("<style></style>").attr("type", "text/css").html(".AwesomeThumbnail { max-height: 100px; max-width: 250px; min-width: 100px; cursor: pointer; border: solid 1px #353d47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; }"
                + "#AwesomeThumbnailHoverDisplay{ position: fixed; top: 20px; left: 20px; color: #fff; border: 1px solid #222; background: #353d47; padding: 3px 10px; z-index: 9999; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; }"
                + ".AwesomeThumbnailHoverTitle { font-size:15px; font-weight:bold; margin:3px 5px 5px 5px; }"
                + ".AwesomeThumbnailHoverImg { max-height:500px; max-width:800px; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; }"
                + ".AwesomeThumbnailHoverClickNote { font-size: 11px; margin:3px auto; font-weight:normal; }"
                + ".AwesomeThumbnailModalImgDiv { padding: 5px; }"
                + ".AwesomeThumbnailModalImg { max-height:650px; max-width:1000px; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px;  }"));


    var modalContainerDiv = document.createElement("div");
    $(modalContainerDiv).attr("id", "AwesomeThumbnailModalDiv").css("display", "none");
    $("body").append(modalContainerDiv);

    $(".AwesomeThumbnail").hover(function (e) {
        var imgSrc = $(this).attr("AwesomeThumbnailHoverSrc");
        if (typeof imgSrc != "string" || imgSrc == null || imgSrc.Trim() == "") { imgSrc = $(this).attr("src"); }
        if (typeof imgSrc != "string" || imgSrc == null || imgSrc.Trim() == "") { return; }

        var imgHoverTitle = $(this).attr("AwesomeThumbnailHoverTitle");
        if (typeof imgHoverTitle != "string" || imgHoverTitle == null || imgHoverTitle.Trim() == "") { imgHoverTitle = $(this).attr("AwesomeThumbnailTitle"); }
        if (typeof imgHoverTitle != "string" || imgHoverTitle == null || imgHoverTitle.Trim() == "") { imgHoverTitle = imgSrc.ReadAfterLastOf("/"); }
        if (typeof imgHoverTitle != "string" || imgHoverTitle == null) { imgHoverTitle = ""; }

        var previewImgDiv = $("<div id=\"AwesomeThumbnailHoverDisplay\"></div>").css("display", "none");
        if (imgHoverTitle.Trim() != "") { $(previewImgDiv).append($("<div></div>").addClass("AwesomeThumbnailHoverTitle").html(imgHoverTitle)); }

        $(previewImgDiv).append($("<img />").attr("src", imgSrc).attr("alt", "").addClass("AwesomeThumbnailHoverImg"));

        var clickNote = "";
        if (typeof Boxy == "function") { clickNote = "* click for modal"; }
        else if (typeof $.OpenWindow == "function") { clickNote = "* click for new window"; }
        if (clickNote.Trim() != "") { $(previewImgDiv).append($("<div></div>").addClass("AwesomeThumbnailHoverClickNote").html(clickNote)); }

        previewImgDiv.css("left", String(e.pageX + 20) + "px");

        $("body").append(previewImgDiv);

        $("#AwesomeThumbnailHoverDisplay").fadeIn(400);
    }, function () {
        $("#AwesomeThumbnailHoverDisplay").remove();
    });

    $.each($(".AwesomeThumbnail"), function (thumbnailIndex, thumbnailImg) {
        var imgSrc = $(thumbnailImg).attr("AwesomeThumbnailHoverSrc");
        if (typeof imgSrc != "string" || imgSrc == null || imgSrc.Trim() == "") { imgSrc = $(thumbnailImg).attr("src"); }
        if (typeof imgSrc != "string" || imgSrc == null || imgSrc.Trim() == "") { return; }

        var imgModalTitle = $(this).attr("AwesomeThumbnailModalTitle");
        if (typeof imgModalTitle != "string" || imgModalTitle == null || imgModalTitle.Trim() == "") { imgModalTitle = $(this).attr("AwesomeThumbnailTitle"); }
        if (typeof imgModalTitle != "string" || imgModalTitle == null || imgModalTitle.Trim() == "") { imgModalTitle = imgSrc.ReadAfterLastOf("/"); }
        if (typeof imgModalTitle != "string" || imgModalTitle == null) { imgModalTitle = ""; }

        if (typeof Boxy == "function") {
            $(thumbnailImg).attr("onclick", "$('#AwesomeThumbnailModalDiv').html('<div id=\"AwesomeThumbnailModalImgDiv\"><img "
                        + "src=\"" + imgSrc + "\" alt=\"\" class=\"AwesomeThumbnailModalImg\" "
                        // + "onclick=\"$.OpenWindow(\'" + imgSrc + "\',\'AwesomeThumbnailWindow\')\" "
                        // + "style=\"cursor:pointer;\" "
                        + " /></div>');"
                        + "var imgBoxy = new Boxy('#AwesomeThumbnailModalImgDiv', { \"title\" : \"" + imgModalTitle + "\" });"
                        + "$(\"#AwesomeThumbnailHoverDisplay\").remove();");
        } else if (typeof $.OpenWindow == "function") {
            $(thumbnailImg).attr("onclick", "$.OpenWindow('" + imgSrc + "','AwesomeThumbnailWindow')");
        }

        setTimeout(function () { $(thumbnailImg).show(); }, 500);

    });
});