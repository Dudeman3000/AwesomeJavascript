function ajsCodeTestEval(ajsCodeDiv) {
    try {
        var codeHtml = $(ajsCodeDiv).html();
        if (typeof codeHtml != "string" || codeHtml == null) {
            $.LogStr("AwesomeJavascriptDisplayAndTesting.js - ajsCodeTestEval() - unable to get codeHtml");
            return;
        }
        if (codeHtml.Trim() == "") {
            $.LogStr("AwesomeJavascriptDisplayAndTesting.js - ajsCodeTestEval() - unable to get codeHtml");
            return;
        }
        var appendToElementId = $(ajsCodeDiv).attr("id");
        if (typeof appendToElementId != "string" || appendToElementId == null || appendToElementId.Trim() == "") {
            $.LogStr("AwesomeJavascriptDisplayAndTesting.js - ajsCodeTestEval() - unable to get appendToElementId");
            return;
        }
        if (typeof document.getElementById(appendToElementId) != "object") {
            $.LogStr("AwesomeJavascriptDisplayAndTesting.js - ajsCodeTestEval() - appendToElementId does not specify an existing DOM element");
            return;
        }
        /* end required */
        var codeTitle = $(ajsCodeDiv).attr('ajscodetitle');
        if (typeof codeTitle == "undefined" || codeTitle == null || (typeof codeTitle == "string" && (codeTitle != "" || (typeof codeTitle.Trim == "function" && codeHtml.Trim() == "")))) {
            codeTitle = "";
        }
        
        // codeHtml = codeHtml.ReplaceAll("amp;", "");
        // codeHtml = codeHtml.RemoveHtml();
        // alert(codeHtml);
        codeHtml = codeHtml.RemoveHtml("code");
        codeHtml = codeHtml.ReplaceAll("&lt;", "<");
        codeHtml = codeHtml.ReplaceAll("&gt;", ">");
        codeHtml = codeHtml.ReplaceAll("<bold>", "<span class=\"ajsTestOutputBold\">").ReplaceAll("</bold>", "</span>");
        codeHtml = codeHtml.ReplaceAll("<unexpected>", "<span class=\"ajsTestOutputUnexpected\">").ReplaceAll("</unexpected>", "</span>");

        // alert(codeHtml);

        var jsStr = "";
        if (codeHtml.Contains("output")) {
            jsStr = "var output = [];";
            jsStr += codeHtml;
            jsStr += "var testDiv = $('<div></div>').addClass(\"ajsTestOutput\");";
            jsStr += "$(testDiv).css(\"display\",\"none\");";
            // jsStr += "$(testDiv).append($('<div></div>').addClass(\"ajsTestOutputTitle\").html('" + codeTitle + " Output'));";
            jsStr += "for (var i = 0; i < output.length; i++) { $(testDiv).append($('<div></div>').html(output[i]).addClass(\"ajsTestOutputContent\")); }";
            jsStr += "$(testDiv).insertAfter($('#" + appendToElementId + "'));";
            jsStr += "$(testDiv).slideDown(500);";
        } else {
            jsStr = codeHtml;
            jsStr += "var testDiv = $('<div></div>').addClass(\"ajsTestOutput\");";
            jsStr += "$(testDiv).css(\"display\",\"none\");";
            jsStr += "$(testDiv).append($('<div></div>').html('<b>Evaluation Complete</b>').addClass(\"ajsTestOutputContent\"));";
            jsStr += "$(testDiv).insertAfter($('#" + appendToElementId + "'));";
            jsStr += "$(testDiv).slideDown(500);";
        }
        
        // alert(jsStr);

        try {
            eval(jsStr);
        } catch (evalExc) {
            var errorDiv = $("<div></div>").attr("id", "ajsCodeEvalErrorDiv");
            $(errorDiv).append($("<div></div>").html("Error evaluating code"));
            $(errorDiv).append($("<div></div>").html($.LogExc(evalExc)));
            if (typeof evalExc.message != "undefined") {
                $(errorDiv).append($("<div></div>").html(evalExc.message));
            }
            $(errorDiv).append($("<div></div>").html(jsStr).css("margin-top", "20px"));
            $(ajsCodeDiv).after($(errorDiv)); 
        }
    } catch (exc) {
        $.LogExc(exc);
    }
}

$(document).ready(function () {

    $("head").prepend($("<style></style>").attr("type", "text/css").html(
        ".ajsCode { font-family: Arial, Helvetica; font-style: italic; font-size: 11px; background-color: #fff; margin: 5px 20px; padding: 5px; border: 1px solid #000; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; }"
        + ".ajsCode code { margin:3px 5px 2px 15px; padding: 0px; display: block; clear: both; text-indent:-10px; }"
        + ".ajsCode code.important { margin:5px 5px 5px 15px; font-size: 12px; font-style: normal; font-weight: bolder; text-indent:-10px; }"
        + ".ajsCodeTitle { margin: 10px 0px 5px 0px; font-size: 16px; font-weight: bold; position:relative; left:-15px; }"
        + ".ajsCodeTest code { }"
        + "div.ajsTestOutput { background-color: #fff; margin: 5px 20px; padding: 7px 5px; border: 1px solid #000; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; }"
        + "div.ajsTestOutput div.ajsTestOutputTitle{ font-size: 13px; font-weight: bold; text-decoration: underline; margin: 0px; padding: 0px; }"
        + "div.ajsTestOutput div.ajsTestOutputContent { font-size:11px; margin:3px 10px 3px 10px;}"
        + ".ajsTestOutputBold { font-size:12px; font-weight:bold; margin:3px 0px 0px 0px; }"
        + ".ajsTestOutputUnexpected {font-size: 13px; font-weight:bold; color:#f00; margin:3px 0px 0px 0px;}"
        + "#ajsCodeEvalErrorDiv { padding:20px 30px; background-color: #fff; font-size:13px; font-weight:bold; color:#f00; border: 1px solid #000; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; }"
        ));


    $.each($(".ajsCode"), function (jsCodeDivIndex, ajsCodeDiv) {
        try {
            var title = $(ajsCodeDiv).attr("ajscodetitle");
            if (typeof title == "string" && title.Trim() != "") {
                var titleDiv = $("<div></div>").addClass("ajsCodeTitle").html(title);
                $(titleDiv).insertBefore($(ajsCodeDiv));
            }
        } catch (exc) {
            $.LogExc(exc);
        }
    });

    $.each($(".ajsCodeTest"), function (jsCodeDivIndex, ajsCodeDiv) {
        var evalButton = document.createElement("input");
        evalButton.setAttribute("onclick", "ajsCodeTestEval($(this).parent().prevAll('.ajsCodeTest'))");
        $(evalButton).attr("type", "button").attr("value", "Evaluate Javascript");

        var evalButtonDiv = $("<div></div>").css("text-align", "center").append(evalButton);
        // $.LogObj(ajsCodeDiv);
        $(ajsCodeDiv).after(evalButtonDiv);
        // ajsCodeDiv.appendChild(evalButton);
    });

    $.each($(".ajsCodeForCopy"), function (jsCodeDivIndex, ajsCodeDiv) {
        var copyText = $(ajsCodeDiv).attr("ajscodecopytext");
        if (copyText == null || copyText.Trim() == "") { copyText == "Copy Code"; }
        var copyButton = $("<input></input>").attr("type", "button").attr("value", copyText).addClass("ajsCodeForCopyButton");
        var copyDiv = $("<div></div>").append(copyButton);
        $(copyButton).attr("onclick", "$(this).parent().prev('.ajsCodeForCopy').slideDown(400);$(this).fadeOut(400);");
        $(ajsCodeDiv).parent().append(copyDiv);
    });

    //        $.each($(".codeTextArea"), function (codeTextAreaIndex, codeTextArea) {
    //            try {
    //                //$.LogObj(codeTextArea);
    //                var codeStr = $(codeTextArea).prev().html();
    //                //                while (codeStr.Contains("  ")) {
    //                //                    codeStr = codeStr.ReplaceAll("  ", " ");
    //                //                }
    //                //                codeStr = codeStr.replace("\t", "");
    //                // codeTextArea.innerHTML = codeTextArea.innerHTML.replace("                ", "");
    //                $(codeTextArea).html(codeStr);
    //                $(codeTextArea).css("font-size", "10px");

    //                var inputButton = document.createElement("input");
    //                $(inputButton).attr("type", "button");
    //                $(inputButton).attr("value", "Evaluate Javascript");
    //                $(inputButton).attr("onclick", "try{eval($(this).parent('div').prev('textarea').html());}catch(exc) { if (typeof exc.message == 'string') { alert(exc.message); } }");
    //                var inputDiv = document.createElement("div");
    //                $(inputDiv).append(inputButton);

    //                $(codeTextArea).parent().append(inputDiv);

    //                $(codeTextArea).trigger("onkeyup");

    //            } catch (eachCodeTextAreaExc) {
    //                $.LogExc(eachCodeTextAreaExc);
    //            }
    //        });
});