
/**************************************************************************************************
*** Awesome.js / AJS javscript utility object                  ************************************
*** by Mark McLaughlin - mcl(dot)mark[(at)]gmail|dot|com       ************************************
*** 2/24/2012                                                  ************************************
*** copyright Awesome Internet Solutions LLC                   ************************************
*** this is freeware, if you find a way to sell it, cut me in! ************************************
***************************************************************************************************/

/* tag list from: http://www.w3schools.com/html5/html5_reference.asp - 3/6/2012 */
/* some html tag usage stats here - http://www.codingforums.com/showthread.php?t=54578 */
/* COMMENTS! comment tags => "!--" => don't follow html / xml rules, will have to deal with them as a special case */
var ajsValidHtmlTags = [
    "br", "a", "td", "font", "tr", "img", "p", "span", "b", "center", "div",
    "option", "input", "object", "ul", "i", "iframe",
    "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio",
    "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "button",
    "canvas", "caption", "cite", "code", "col", "colgroup", "command",
    "datalist", "dd", "del", "details", "dfn", "dir", "dl", "dt",
    "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset",
    "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html",
    "ins", "keygen", "kbd", "label", "legend", "li", "link",
    "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript",
    "ol", "optgroup", "output", "params", "pre", "progress",
    "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small",
    "source", "strike", "strong", "style", "sub", "summary", "sup",
    "table", "tbody", "textarea", "tfoot", "th", "thead", "time", "title",
    "track", "tt", "u", "var", "video", "wbr"];
/*** end Html Tags ***/

/********************************************************************************************************
*** String Prototype Functions *************************************************************************
********************************************************************************************************/
/* Html Functions */

String.prototype.RemoveHtml = function (tagStrOrArray, includeEncodedTags) {
    if (typeof includeEncodedTags != "boolean") { includeEncodedTags = false; }
    try {
        var returnValue = "";
        var readStr = this.RemoveExcessWhiteSpace();
        var readStrLength = null;
        while (readStr.indexOf("<!--") != -1 && readStr.indexOf("<!--") < ((readStr.indexOf("-->") == -1) ? readStr.length + 1 : readStr.indexOf("-->"))) {
            if (readStrLength) { if (readStrLength == readStr.length) { break; } } /* if nothing removed w/ last loop iteration break to prevent infinite loop */
            readStrLength = readStr.length;
            var str = readStr.ReadUntil("<!--");
            returnValue += str;
            readStr = readStr.RemovePrefix(str);
            readStr = readStr.substring(readStr.indexOf("-->" + 3));
        }
        if (includeEncodedTags) {
            readStrLength = null;
            while (readStr.indexOf("&lt;!--") != -1 && readStr.indexOf("&lt;!--") < ((readStr.indexOf("--&gt;") == -1) ? readStr.length + 1 : readStr.indexOf("--&gt;"))) {
                if (readStrLength) { if (readStrLength == readStr.length) { break; } } /* if nothing removed w/ last loop iteration break to prevent infinite loop */
                readStrLength = readStr.length;
                var str = readStr.ReadUntil("&lt;!--");
                returnValue += str;
                readStr = readStr.RemovePrefix(str);
                readStr = readStr.substring(readStr.indexOf("--&lt;" + 6));
            }
        }
        returnValue += readStr; // add what's left of the readStr
        /* comments removed - comments don't follow xml / html rules - wanted to just get them removed - set / reset variables */
        readStr = returnValue;
        returnValue = "";
        readStrLength = null;
        var loopCount = 0;

        var HtmlTags = null;
        if (typeof tagStrOrArray != "undefined" && ((typeof tagStrOrArray == "string" || !$.IsNullOrWhiteSpace(tagStrOrArray) || (jQuery.isArray(tagStrOrArray) && tagStrOrArray.length > 0)))) {
            HtmlTags = new AwesomeHtmlTagSet(tagStrOrArray);
        } else {
            HtmlTags = $.Html.Tags;
        }

        while (readStr.Contains("&amp;")) { readStr = readStr.replace("&amp;", "&"); }
        while (readStr.Contains("&nbsp;")) { readStr = readStr.replace("&nbsp;", " "); }

        while (readStr != "" && loopCount < 5000) {
            if (readStrLength) { if (readStrLength == readStr.length) { break; } } /* if nothing removed w/ last loop iteration break to prevent infinite loop */
            readStrLength = readStr.length;

            var whiteSpaceCount = 0;
            while (readStr.length > 0 && readStr[0] == " " && whiteSpaceCount < 100) { if (whiteSpaceCount == 0) { returnValue += " "; } readStr = readStr.substring(1); whiteSpaceCount++; }

            if (readStr.StartsWithHtmlTag(includeEncodedTags, HtmlTags)) {
                readStr = readStr.RemoveHtmlTagPrefix(includeEncodedTags, HtmlTags);
            } else if (readStr.StartsWith("<") || (includeEncodedTags && readStr.StartsWith("&lt;"))) {
                if (readStr.StartsWith("<")) { returnValue += "<"; readStr = readStr.RemovePrefix("<"); }
                else { returnValue += "&lt;"; readStr = readStr.RemovePrefix("&lt;"); }
            } else if (!readStr.Contains("<") && (!includeEncodedTags || !readStr.Contains("&lt;"))) { /* done */
                returnValue += readStr;
                readStr = "";
                break;
            } else {
                var readToStr = "<";
                if (includeEncodedTags && readStr.indexOf("&lt;") != -1) {
                    var indexOfRegularOpen = (readStr.indexOf("<") == -1) ? readStr.length + 1 : readStr.indexOf("<");
                    if (readStr.indexOf("&lt;") < indexOfRegularOpen) { readToStr = "&lt;"; }
                }
                var str = readStr.ReadUntil(readToStr);
                returnValue += str;
                readStr = readStr.RemovePrefix(str);
            }

            whiteSpaceCount = 0;
            while (readStr.length > 0 && readStr[0] == " " && whiteSpaceCount < 100) { if (whiteSpaceCount == 0) { returnValue += " "; } readStr = readStr.substring(1); whiteSpaceCount++; }

            loopCount++;
        }

        if (readStr != "") { returnValue += readStr; if (typeof AJS == "object" && typeof AJS.LogStr == "function") { AJS.LogStr(this, "String.prototype.RemoveHtml", "failed to read through entire string"); } } /* something went wrong - append what's left of the readStr - log original value */

        return returnValue;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.RemoveHtmlTagPrefix = function (includeEncodedTags, awesomeHtmlTagSet) {
    if (typeof includeEncodedTags != "boolean") { includeEncodedTags = false; }
    if (typeof awesomeHtmlTagSet == "undefined") { awesomeHtmlTagSet = null; }
    try {
        var HtmlTags = (awesomeHtmlTagSet || $.Html.Tags);

        if (this.StartsWith("<!--") && this.Contains("-->")) { return this.substring(this.indexOf("-->") + 3); }
        if (includeEncodedTags && this.StartsWith("&lt;!--") && this.Contains("--&gt;")) { return this.substring(this.indexOf("--&gt;") + 6); }

        for (var i = 0; i < HtmlTags.CloseTags.length; i++) {
            if (this.StartsWith(HtmlTags.CloseTags[i], false)) { return this.RemovePrefix(HtmlTags.CloseTags[i], false); }
            if (includeEncodedTags && this.StartsWith(HtmlTags.CloseTagsEncoded[i], false)) { return this.RemovePrefix(HtmlTags.CloseTagsEncoded[i], false); }
        }
        for (var i = 0; i < HtmlTags.OpenTags.length; i++) {
            if (this.StartsWith(HtmlTags.OpenTags[i], false)) {
                if (HtmlTags.OpenTags[i].EndsWith(">")) { return this.RemovePrefix(HtmlTags.OpenTags[i], false); }
                else if (this.Contains(">")) { return this.substring(this.indexOf(">") + 1); }
            }
            if (includeEncodedTags && this.StartsWith(HtmlTags.OpenTagsEncoded[i], false)) {
                if (HtmlTags.OpenTagsEncoded[i].EndsWith("&gt;")) { return this.RemovePrefix(HtmlTags.OpenTagsEncoded[i], false); }
                else if (this.Contains("&gt;")) { return this.substring(this.indexOf("&gt;") + 4); }
            }
        }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.StartsWithHtmlTag = function (includeEncodedTags, awesomeHtmlTagSet) {
    if (typeof includeEncodedTags != "boolean") { includeEncodedTags = false; }
    if (typeof awesomeHtmlTagSet == "undefined") { awesomeHtmlTagSet = null; }
    try {
        var HtmlTags = (awesomeHtmlTagSet || $.Html.Tags);

        var returnValue = this.StartsWithAny($.merge(HtmlTags.OpenTags, ["<!--"]), false) || this.StartsWithAny(HtmlTags.CloseTags, false);
        if (!returnValue && includeEncodedTags) {
            returnValue = this.StartsWithAny($.merge(HtmlTags.OpenTagsEncoded, ["&lt;!--"]), false)
            || this.StartsWithAny(HtmlTags.CloseTagsEncoded, false);
        }
        return returnValue;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.StartsWithHtmlOpenTag = function (includeEncodedTags, awesomeHtmlTagSet) {
    if (typeof includeEncodedTags != "boolean") { includeEncodedTags = false; }
    if (typeof awesomeHtmlTagSet == "undefined") { awesomeHtmlTagSet = null; }
    try { /* is "<!--" an open tag?  I think that in the context that this function will be used, i.e. html parsing - <!-- should not be treated as an open tag */
        var HtmlTags = (awesomeHtmlTagSet || $.Html.Tags);

        var returnValue = this.StartsWithAny(HtmlTags.OpenTags, false);
        if (!returnValue && includeEncodedTags) { returnValue = this.StartsWithAny(HtmlTags.OpenTagsEncoded, false); }
        return returnValue;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.StartsWithHtmlCloseTag = function (includeEncodedTags, tagStrOrArray, awesomeHtmlTagSet) {
    if (typeof includeEncodedTags != "boolean") { includeEncodedTags = false; }
    if (typeof awesomeHtmlTagSet == "undefined") { awesomeHtmlTagSet = null; }
    try {
        var HtmlTags = (awesomeHtmlTagSet || $.Html.Tags);

        var returnValue = this.StartsWithAny(HtmlTags.CloseTags, false);
        if (!returnValue && includeEncodedTags) { returnValue = this.StartsWithAny(HtmlTags.CloseTagsEncoded, false); }
        return returnValue;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}


/*** end Html String prototype functions - begin non-Html functions ***/

String.prototype.AwesomeEquals = function (str, caseSensitive, trimValues) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    if (typeof trimValues != "boolean") { trimValues = false; }
    try {
        if (typeof str == "undefined" || str == null) { return false; }
        if (typeof str != "string") { try { str = String(str); } catch (strCastExc) { } }
        if (typeof str != "string") { return false; } /* end validation */
        if (caseSensitive && trimValues) { return (this.Trim() == str.Trim()); }
        else if (!caseSensitive && trimValues) { return (this.toLowerCase().Trim() == str.toLowerCase().Trim()); }
        else if (!caseSensitive) { return (this.toLowerCase() == str.toLowerCase()); }
        return (this == str);
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return onErrorReturnValue;
}

String.prototype.Contains = function (str, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof str == "undefined") { return false; }
        if (typeof str != "string") { try { str = String(str); } catch (stringConvertExc) { } }
        if (typeof str != "string" || str == "") { return false; } /* end validation */
        if (!caseSensitive) { return (this.toLowerCase().indexOf(str.toLowerCase()) != -1); }
        return (this.indexOf(str) != -1);
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.ContainsAll = function (strArray, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof strArray == "undefined" || strArray == null) { return false; }
        if (typeof strArray == "string") { return this.Contains(strArray, caseSensitive); } /* handle string parameter (array expected) */
        if (typeof jQuery == "object" && typeof jQuery.isArray == "function" && !jQuery.isArray(strArray)) { return false; } /* end validation */
        for (var i = 0; i < strArray.length; i++) { if (!this.Contains(strArray[i], caseSensitive)) { return false; } }
        return true;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.ContainsAny = function (strArray, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof strArray == "undefined" || strArray == null) { return false; }
        if (typeof strArray == "string") { return this.Contains(strArray, caseSensitive); } /* handle string parameter (array expected) */
        if (typeof jQuery == "object" && typeof jQuery.isArray == "function" && !jQuery.isArray(strArray)) { return false; } /* end validation */
        for (var i = 0; i < strArray.length; i++) { if (this.Contains(strArray[i], caseSensitive)) { return true; } }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.EndsWith = function (suffix, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof suffix == "undefined") { return false; }
        if (typeof suffix != "string") { try { suffix = String(suffix); } catch (stringConvertExc) { } }
        if (typeof suffix != "string" || suffix.Trim() == "") { return false; } /* end validation */
        if (this.length < suffix.length) { return false; }
        if ((caseSensitive && this.substring(this.length - suffix.length) == suffix)
            || (!caseSensitive && this.toLowerCase().substring(this.length - suffix.length) == suffix.toLowerCase())) { return true; }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.EndsWithAny = function (suffixArray, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof suffixArray == "undefined") { return false; }
        if (typeof suffixArray == "string") { return this.EndsWith(suffixArray, caseSensitive); }
        if (typeof suffixArray != "object") { return false; }
        if (typeof jQuery == "object" && typeof jQuery.isArray == "function" && !jQuery.isArray(suffixArray)) { return false; } /* end validation */
        for (var i = 0; i < suffixArray.length; i++) { if (this.EndsWith(suffixArray[i], caseSensitive)) { return true; } }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}



String.prototype.IsEmpty = function (replaceHtmlNbsp) {
    if (typeof replaceHtmlNbsp != "boolean") { replaceHtmlNbsp = false; }
    try {
        var compareStr = this;
        if (replaceHtmlNbsp) { compareStr = compareStr.RemoveAll("&nbsp;"); }
        compareStr = compareStr.replace(/\s/gm, "");
        return (compareStr == "");
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.IsWhiteSpace = String.prototype.IsEmpty;

String.prototype.EqualsAny = function (strArray, caseSensitive, trimValues) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    if (typeof trimValues != "boolean") { trimValues = true; }
    try {
        if (typeof strArray == "undefined" || strArray == null) { return false; }
        if (typeof strArray == "string") { return this.AwesomeEquals(strArray, caseSensitive, trimValues); } /* handle string parameter (array expected) */
        if (typeof jQuery == "object" && typeof jQuery.isArray == "function" && !jQuery.isArray(strArray)) { return false; } /* end validation */
        for (var i = 0; i < strArray.length; i++) { if (this.AwesomeEquals(strArray[i], caseSensitive, trimValues)) { return true; } }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.ReadAfterLastOf = function (readAfterStr, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof readAfterStr == "undefined") { return this; }
        if (typeof readAfterStr != "string") { try { readAfterStr = String(readAfterStr); } catch (stringConvertExc) { } }
        if (typeof readAfterStr != "string" || readAfterStr == "") { return this; } /* end validation */
        var startFromIndex = caseSensitive ? this.lastIndexOf(readAfterStr) : this.toLowerCase().lastIndexOf(readAfterStr.toLowerCase());
        startFromIndex += readAfterStr.length;
        if (startFromIndex <= 0) { return this; }
        return this.substring(startFromIndex);
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return "";
}

String.prototype.ReadUntil = function (untilStr, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof untilStr == "undefined") { return this; }
        if (typeof untilStr != "string") { try { untilStr = String(untilStr); } catch (stringConvertExc) { } }
        if (typeof untilStr != "string" || untilStr == "") { return this; } /* end validation */
        var untilStrIndex = caseSensitive ? this.indexOf(untilStr) : this.toLowerCase().indexOf(untilStr.toLowerCase());
        if (untilStrIndex <= 0) { return this; }
        return this.substring(0, untilStrIndex);
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return "";
}

String.prototype.RemoveAll = function (str, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof str == "undefined") { return this; }
        if (typeof str != "string") { try { prefix = String(str); } catch (stringConvertExc) { } }
        if (typeof str != "string" || str.Trim() == "") { return this; } /* end validation */
        return this.ReplaceAll(str, "");
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

/* \s => \t\v\f\n\r - http://www.devguru.com/technologies/ecmascript/quickref/regexp_special_characters.html */

String.prototype.RemoveAllWhiteSpace = function (includeHtmlNbsp) {
    if (typeof includeHtmlNbsp != "boolean") { includeHtmlNbsp = false; }
    try {
        var returnValue = this;
        if (includeHtmlNbsp) { returnValue = returnValue.RemoveAll("&nbsp;"); }
        returnValue = returnValue.replace(/\s/gm, "");
        return returnValue;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.RemoveExcessWhiteSpace = function (includeHtmlNbsp) {
    if (typeof includeHtmlNbsp != "boolean") { includeHtmlNbsp = false; }
    try {
        var returnValue = this;
        while (returnValue.Contains("  ")) { returnValue = returnValue.replace("  ", " "); }
        while (returnValue.Contains(" ")) { returnValue = returnValue.replace(" ", "_sp_"); }
        // returnValue = returnValue.ReplaceAll(" ", "_sp_");
        returnValue = returnValue.replace(/\s/gm, "");
        //        while (returnValue.Contains("_sp__sp_")) { returnValue = returnValue.ReplaceAll("_sp__sp_", "_sp_"); }
        //        returnValue = returnValue.ReplaceAll("_sp_", " ");
        while (returnValue.Contains("_sp__sp_")) { returnValue = returnValue.replace("_sp__sp_", "_sp_"); }
        while (returnValue.Contains("_sp_")) { returnValue = returnValue.ReplaceAll("_sp_", " "); }
        returnValue = returnValue.Trim();
        while (includeHtmlNbsp && returnValue.Contains("&nbsp;&nbsp;")) { returnValue = returnValue.ReplaceAll("&nbsp;&nbsp;", "&nbsp;"); }
        return returnValue;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.Remove = function (str) {
    try {
        if (typeof str == "undefined") { return this; }
        if (typeof str != "string") { try { str = String(str); } catch (stringConvertExc) { } }
        if (typeof str != "string" || str.Trim() == "") { return this; } /* end validation */
        return this.replace(str, "");
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.RemovePrefix = function (prefix, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof prefix == "undefined") { return this; }
        if (typeof prefix != "string") { try { prefix = String(prefix); } catch (stringConvertExc) { } }
        if (typeof prefix != "string" || prefix.Trim() == "") { return this; } /* end validation */
        if (this.StartsWith(prefix, caseSensitive)) { return this.substring(prefix.length); }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.RemovePrefixes = function (prefixArray, caseSensitive, removeFirstOnly) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    if (typeof removeFirstOnly != "boolean") { removeFirstOnly = true; }
    try {
        if (typeof prefixArray == "undefined") { return false; }
        if (typeof prefixArray == "string") { return this.RemovePrefix(prefixArray, caseSensitive); }
        if (typeof prefixArray != "object") { return false; }
        if (typeof jQuery == "object" && typeof jQuery.isArray == "function" && !jQuery.isArray(prefixArray)) { return false; } /* end validation */
        var sortHelper = new AwesomeSortHelper();
        sortHelper.SortStringsByLength(prefixArray, "desc");
        var self = this;
        for (var i = 0; i < prefixArray.length; i++) {
            var prefix = prefixArray[i];
            if (typeof prefix == "undefined" || prefix == "") { continue; }
            if (removeFirstOnly && this.StartsWith(prefix, caseSensitive)) { return this.RemovePrefix(prefix, caseSensitive); }
            else { self = self.RemovePrefix(prefix, caseSensitive); }
        }
        return self;
        if (this.EndsWith(prefix, caseSensitive)) { return this.substring(0, this.length - prefix.length); }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.RemoveSuffix = function (suffix, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof suffix == "undefined") { return this; }
        if (typeof suffix != "string") { try { suffix = String(suffix); } catch (stringConvertExc) { } }
        if (typeof suffix != "string" || suffix.Trim() == "") { return this; } /* end validation */
        if (this.EndsWith(suffix, caseSensitive)) { return this.substring(0, this.length - suffix.length); }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.RemoveSuffixes = function (suffixArray, caseSensitive, removeFirstOnly) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    if (typeof removeFirstOnly != "boolean") { removeFirstOnly = true; }
    try {
        if (typeof suffixArray == "undefined") { return false; }
        if (typeof suffixArray == "string") { return this.RemoveSuffix(suffixArray, caseSensitive); }
        if (typeof suffixArray != "object") { return false; }
        if (typeof jQuery == "object" && typeof jQuery.isArray == "function" && !jQuery.isArray(suffixArray)) { return false; } /* end validation */
        var sortHelper = new AwesomeSortHelper();
        sortHelper.SortStringsByLength(suffixArray, "desc");
        var self = this;
        for (var i = 0; i < suffixArray.length; i++) {
            var suffix = suffixArray[i];
            if (typeof suffix == "undefined" || suffix == "") { continue; }
            if (removeFirstOnly && this.EndsWith(suffix, caseSensitive)) { return this.RemoveSuffix(suffix, caseSensitive); }
            else { self = self.RemoveSuffix(suffix, caseSensitive); }
        }
        return self;
        if (this.EndsWith(suffix, caseSensitive)) { return this.substring(0, this.length - suffix.length); }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.ReplaceAll = function (oldVal, newVal) {
    if (typeof oldVal != "string" || typeof newVal != "string" || oldVal == "") { return; }
    if (oldVal == newVal) { return; }
    try {
        var returnVal = this;
        try { var replaceAllRegex = new RegExp(eval("/" + oldVal + "/gm")); return this.replace(replaceAllRegex, newVal); }
        catch (invalidRegExp) { /* if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(invalidRegExp); } */ }
        var loopCount = 0; /* hit a RegExp exception, do it the old fashioned way */
        while (returnVal.Contains(oldVal) && loopCount < 1000) { returnVal = returnVal.replace(oldVal, newVal); loopCount++; }
        return returnVal;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.StartsWith = function (prefix, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof prefix == "undefined") { return false; }
        if (typeof prefix != "string") { try { prefix = String(prefix); } catch (stringConvertExc) { } }
        if (typeof prefix != "string" || prefix.Trim() == "") { return false; } /* end validation */
        if (this.length < prefix.length) { return false; }
        if ((caseSensitive && this.substring(0, prefix.length) == prefix) || (!caseSensitive && this.toLowerCase().substring(0, prefix.length) == prefix.toLowerCase())) { return true; }
        return false;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

String.prototype.StartsWithAny = function (prefixArray, caseSensitive) {
    if (typeof caseSensitive != "boolean") { caseSensitive = true; }
    try {
        if (typeof prefixArray == "undefined") { return false; }
        if (typeof prefixArray == "string") { return this.StartsWith(prefixArray, caseSensitive); }
        if (typeof prefixArray != "object") { return false; }
        if (typeof jQuery == "object" && typeof jQuery.isArray == "function" && !jQuery.isArray(prefixArray)) { return false; } /* end validation */
        for (var i = 0; i < prefixArray.length; i++) { if (this.StartsWith(prefixArray[i], caseSensitive)) { return true; } }
        return false;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return false;
}

/* best regex according to this dude - http://blog.stevenlevithan.com/archives/faster-trim-javascript */

String.prototype.Trim = function (jQueryImplementation) {
    if (typeof jQueryImplementation != "boolean") { jQueryImplementation = false; }
    try {
        if (jQueryImplementation && typeof $ == "object" && typeof $.trim == "function") { return $.trim(this); }
        else { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); }
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
}

String.prototype.TrimBy = function (numChars) {
    try {
        if (typeof numChars != "number") { try { numChars = Number(numChars); } catch (numberConvertExc) { } }
        if (typeof numChars != "number" || numChars == 0) { return this; }
        if (this.length < numChars) { return ""; }
        return this.substring(0, this.length - numChars);
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return this;
};

/*** end string prototype functions ***/



/**************************************************************************************************
*** AJS Object Defintion **************************************************************************
***************************************************************************************************/

var AJS = new AwesomeJsBaseObject();

function AwesomeJsBaseObject() {

    var self = this;

    this.Environment = "live";
    this.AlertDebugInfo = false;

    this.SetDebugModeOn = function () { this.Environment = "test"; }
    this.SetDebugModeOff = function () { this.Environment = "live"; }

    this.SetDebugAlertsOn = function () { this.AlertDebugInfo = true; }
    this.SetDebugAlertsOff = function () { this.AlertDebugInfo = false; }

    this.SetDebugMode = function (debug) {
        if (typeof debug != "boolean") { this.Environment = "live"; return; }
        if (debug) { this.Environment = "test"; return; }
        this.Environment = "live";
    }

    this.Debug = function () {
        if (typeof this.Environment != "string") { return false; }
        if (this.Environment.toLowerCase() == "test" || this.Environment.toLowerCase() == "debug" || this.Environment.toLowerCase() == "qa") {
            return true;
        }
        return false;
    }

    this.DefaultDate = new Date(1900, 1, 1);

    /**************************************************************************************************/
    /*** Logging / Exception Handling ***/
    this.LoggingUrl = null;
    this.LogUsingQueryString = false;

    /*
    // , keyContains, valueContains
    if (typeof keyContains != "string") { keyContains = ""; }
    if (typeof valueContains != "string") { valueContains = ""; }
    */

    this.GetObjHtmlStr = function (obj, includeFunctionDefinitions) {
        return this.GetObjStr(obj, includeFunctionDefinitions).ReplaceAll("\n", "<br />");
    };

    this.GetObjStr = function (obj, includeFunctionDefinitions) {
        if (typeof obj == "undefined") { obj = "typeof obj == \"undefined\""; }
        if (typeof includeFunctionDefinitions != "boolean") { includeFunctionDefinitions = false; }
        var objStr = "";
        try {
            if (typeof obj == "undefined") { return "AJS.GetObjStr() - typeof obj == \"undefined\""; }

            if (typeof obj != "object") {
                objStr += "typeof obj = [" + String(typeof obj) + "]\n";
                try { objStr += "String(obj) == [" + String(obj) + "]"; } catch (exc) { }
            }

            var objProps = [];
            var objFunctionProps = [];

            $.each(obj, function (key, value) {
                try {
                    var valueStr = String(value);
                    if ($.IsFunction(value) && !includeFunctionDefinitions) { valueStr = "[FUNCTION]"; }

                    if ($.IsFunction(value)) { objFunctionProps.push(new AJS.PropertyValueContainer(String(key), valueStr)); }
                    else { objProps.push(new AJS.PropertyValueContainer(String(key), valueStr)); }

                } catch (exc) { }
            });

            this.SortObjects(objProps, "PropName");
            for (var i = 0; i < objProps.length; i++) { objStr += objProps[i].PropName + " : " + objProps[i].PropValue + "\n"; }

            $.SortObjects(objFunctionProps, "PropName");
            for (var i = 0; i < objFunctionProps.length; i++) { objStr += objFunctionProps[i].PropName + " : " + objFunctionProps[i].PropValue + "\n"; }

            return objStr;
        } catch (badExc) { AJS.LogStr(badExc.message || badExc.Message); } /* never want to get here */
        return objStr;
    }

    this.LogObj = this.LogObject = function (obj, msg, includeFunctionDefinitions) {
        if (typeof obj == "undefined") { obj = "typeof obj == \"undefined\""; }
        if (typeof msg != "string") { msg = ""; }
        if (typeof includeFunctionDefinitions != "boolean") { includeFunctionDefinitions = false; }
        // try {
        if (typeof obj == "string") { this.LogStr("AJS LogObj()\n" + obj); return; }
        if (typeof msg != "string" || msg == null) { msg = ""; }

        return this.LogStr(this.GetObjStr(obj), "AJS.LogObj()", msg);
        // } catch (badExc) { /* never want to get here */ /* alert("AJS.GetObjStr() - badExc"); */ }
    }

    this.LogExc = function (excObj, msg, appendToElement) {
        if (typeof excObj == "undefined") { excObj = "typeof excObj == \"undefined\""; }
        if (typeof msg != "string") { msg = ""; }
        if (typeof appendToElement == "undefined") { appendToElement = null; }
        // try {
        if (typeof excObj == "string") { this.LogStr(excObj, "AJS.LogExc()"); return; }
        if (typeof excObj == "undefined" || excObj == null) { return; }
        var excPropertyValues = "Javascript Exception__nl";
        var excStr = "";
        if (typeof excObj.toString != "undefined" && this.IsFunction(excObj.toString)) { excStr += excObj.toString() + "\n"; }
        else if (typeof excObj.ToString != "undefined" && this.IsFunction(excObj.toString)) { excStr += excObj.ToString() + "\n"; }
        if (typeof excObj.Message != "undefined" && !this.IsNullOrWhiteSpace(excObj.Message)) { excStr += "Message = [" + excObj.Message + "]\n"; }
        else if (typeof excObj.message != "undefined" && !this.IsNullOrWhiteSpace(excObj.message)) { excStr += "message = [" + excObj.message + "]\n"; }
        if (typeof excObj.Source != "undefined" && !this.IsNullOrWhiteSpace(excObj.Source)) { excStr += "Source = [" + excObj.Source + "]\n"; }
        else if (typeof excObj.source != "undefined" && !this.IsNullOrWhiteSpace(excObj.source) == null) { excStr += "source = [" + excObj.source + "]\n"; }
        if (typeof excObj.Line != "undefined" && !this.IsNullOrWhiteSpace(excObj.Line) == null) { excStr += "Line = [" + excObj.Line + "]\n"; }
        else if (typeof excObj.line != "undefined" && !this.IsNullOrWhiteSpace(excObj.line) == null) { excStr += "line = [" + excObj.line + "]\n"; }
        if (typeof excObj.LineText != "undefined" && !this.IsNullOrWhiteSpace(excObj.LineText) == null) { excStr += "LineText = [" + excObj.LineText + "]\n"; }
        else if (typeof excObj.lineText != "undefined" && !this.IsNullOrWhiteSpace(excObj.lineText) == null) { excStr += "lineText = [" + excObj.lineText + "]\n"; }
        /*** exclude some exceptions ***/
        if (excStr.Contains("prompt abort")) { return; }
        excStr += this.GetObjStr(excObj);
        return this.LogStr(excStr, "AJS.LogExc()", msg, appendToElement);
        // } catch (badExc) { /* never want to get here */ /* alert("AJS.GetObjStr() - badExc"); */ }
    }

    /*** all logging functions eventually hit this function to log to the server and append info to the DOM ***/
    this.LogStr = function (logStr, title, msg, appendToElement) {
        // try {
        if (typeof logStr != "string" || this.IsNullOrWhiteSpace(logStr)) { return; }
        if (typeof appendToElement == "undefined") { appendToElement = null; }
        if (typeof msg == "string" && !AJS.IsNullOrWhiteSpace(msg)) { logStr = "Message: " + msg + "\n" + logStr; }
        if (typeof title == "string" && !AJS.IsNullOrWhiteSpace(title)) { logStr = title + "\n" + logStr; }
        if (this.AlertDebugInfo) { alert(logStr); }
        if (!this.IsNullOrWhiteSpace(this.LoggingUrl)) {
            try {
                if (this.LoggingUrl.EndsWith("?")) {
                    var logStrDelimited = logStr;
                    logStrDelimited = logStrDelimited.ReplaceAll("\n", "|");
                    var logImg = document.createElement("img");
                    var logUrl = this.LoggingUrl + "&msg=" + encodeURI(logStr);
                    $(logImg).attr("src", logUrl);
                    $(logImg).attr("style", "height:1px;width:1px;display:none;");
                    if (document.body != null) { document.body.appendChild(logImg); }
                } else {
                    $.ajax({
                        url: this.LoggingUrl,
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        data: "{ \"msg\" : \"" + logStr + "\" }",
                        success: null,
                        error: function (xhr, ajaxOptions, thrownError) { }
                    });
                }
            } catch (logToServerExc) { /* badExc - never want to be here */ }
        }
        /* append to document */
        logStr = logStr.ReplaceAll("<", "&lt;").ReplaceAll(">", "&gt;");
        logStr = logStr.ReplaceAll("\n", "<br />");
        var logDiv = $("<div>" + logStr + "</div>");
        if (this.Debug()) { $(logDiv).attr("style", "color:#000; background-color:#fff; margin:20px; padding:20px; border:solid 1px #000;"); }
        else { $(logDiv).attr("style", "display:none; color:#000; background-color:#fff; margin:20px; padding:20px; border:solid 1px #000;"); }
        if (document.body != null) {
            if (appendToElement != null) { $(appendToElement).append(logDiv); }
            else { $("body").append(logDiv); }
        } else {
            $(document).ready(function () {
                $.LogStr(logStr, title, msg, appendToElement);
            });
        }
        return logStr;
        // } catch (badExc) { /* never want to get here */ /* alert("AJS.LogStr() - badExc"); */ }
    };

    /*** End Logging / Exception Handling ***/
    /**************************************************************************************************/
    /*** object property functions ***/

    this.ConventionalIdPropertyAppendages = ["Id", "ID", "id"];
    this.ConventionalNamePropertyAppendages = ["DisplayName", "displayName", "displayname", "Name", "name", "Text", "text", "Str", "str"];
    this.ConventionalPropertyAppendages = [];
    this.ConventionalPropertyAppendages = $.merge(this.ConventionalPropertyAppendages, this.ConventionalIdPropertyAppendages);
    this.ConventionalPropertyAppendages = $.merge(this.ConventionalPropertyAppendages, this.ConventionalNamePropertyAppendages);

    this.NumericStringZeroEquivalents = ["NULL", "NA", "N/A", ""];
    this.DateStringNullEquivalents = ["NULL", "NA", "N/A", ""];

    $(document).ready(function () { /*** important that these arrays are sorted by string length desc ***/
        AJS.Sort.SortStringsByLength(AJS.ConventionalPropertyAppendages, "desc");
        AJS.Sort.SortStringsByLength(AJS.ConventionalIdPropertyAppendages, "desc");
        AJS.Sort.SortStringsByLength(AJS.ConventionalNamePropertyAppendages, "desc");
        AJS.Sort.SortStringsByLength(AJS.NumericStringZeroEquivalents, "desc");
    });

    /*** end convention string lists ***/

    /*** AwesomeObjectInfo / GetObjectInfo - end other object property functions***/

    this.PropertyValueContainer = function (propName, propValue) {
        this.PropName = propName;
        this.PropValue = propValue;
    }

    this.AwesomeObjectInfo = function () {

        this.typeName = null;
        this.primaryKeyPropName = null;
        this.primaryTextPropName = null;

        this.setTypeName = function (typeNameParam) {
            if (AJS.IsNullOrWhiteSpace(this.typeName)) {
                if (typeof typeNameParam == "undefined") { AJS.LogExc("AJS.AwesomeObjectInfo.setTypeName() - typeof typeNameParam == \"undefined\""); return; }
                if (AJS.IsNullOrWhiteSpace(typeNameParam)) { return; } /*** null is an expected parameter - also ignore empty str  ***/
                this.typeName = typeNameParam;
            }
        };

        this.TypeNamePlural = function () {
            try {
                if ($.IsNullOrWhiteSpace(this.typeName)) { return ""; }
                var s = this.typeName;
                if (!this.typeName.toLowerCase().EndsWith("s")) {
                    if (this.typeName.toLowerCase().EndsWith("y")) {
                        s = s.RemoveSuffixes("y", false, true);
                        s += "ies";
                    }
                }
                return s;
            } catch (exc) { AJS.LogExc(exc); }
        };


        this.setPrimaryKeyPropName = function (primaryKeyPropNameParam) {
            if (AJS.IsNullOrWhiteSpace(this.primaryKeyPropName)) {
                if (typeof primaryKeyPropNameParam == "undefined") { AJS.LogExc("AJS.AwesomeObjectInfo.setPrimaryKeyPropName() - typeof primaryKeyPropNameParam == \"undefined\""); return; }
                if (AJS.IsNullOrWhiteSpace(primaryKeyPropNameParam)) { return; } /*** null is an expected parameter - also ignore empty str  ***/
                this.primaryKeyPropName = primaryKeyPropNameParam;
            }
        };

        this.setPrimaryTextPropName = function (primaryTextPropNameParam) {
            if (AJS.IsNullOrWhiteSpace(this.primaryTextPropName)) {
                if (typeof primaryTextPropNameParam == "undefined") { AJS.LogExc("AJS.AwesomeObjectInfo.setPrimaryTextPropName() - typeof primaryTextPropNameParam == \"undefined\""); return; }
                if (AJS.IsNullOrWhiteSpace(primaryTextPropNameParam)) { return; } /*** null is an expected parameter - also ignore empty str ***/
                this.primaryTextPropName = primaryTextPropNameParam;
            }
        };

        /*** property lists ***/

        this.propNames = [];


        /***/
        this.numericPropNames = [];

        this.numericPropMinValues = [];
        this.GetNumericMinValue = function (propName) {
            var minValues = AJS.SearchObjects(this.numericPropMinValues, propName, "PropName", false, true, false);
            if (minValues.length > 0) { return minValues[0].PropValue; }
            return null;
        }
        this.SetNumericMinValue = function (propName, propValue) {
            var minValues = AJS.SearchObjects(this.numericPropMinValues, propName, "PropName", false, true, false);
            if (minValues.length > 0 && propValue < minValues[0].PropValue) { minValues[0].PropValue = propValue; }
            else { this.numericPropMinValues.push(new AJS.PropertyValueContainer(propName, propValue)); }
        }

        this.numericPropMaxValues = [];
        this.GetNumericMaxValue = function (propName) {
            var maxValues = AJS.SearchObjects(this.numericPropMaxValues, propName, "PropName", false, true, false);
            if (maxValues.length > 0) { return maxValues[0].PropValue; }
            return null;
        }
        this.SetNumericMaxValue = function (propName, propValue) {
            var maxValues = AJS.SearchObjects(this.numericPropMaxValues, propName, "PropName", false, true, false);
            if (maxValues.length > 0 && propValue > maxValues[0].PropValue) { maxValues[0].PropValue = propValue; }
            else { this.numericPropMaxValues.push(new AJS.PropertyValueContainer(propName, propValue)); }
        }

        this.numericPropMaxDecimalLengths = [];
        this.IsDecimal = function (propName) {
            var isDecimalValues = AJS.SearchObjects(this.numericPropMaxDecimalLengths, propName, "PropName", false, true, false);
            if (isDecimalValues.length > 0) { return (isDecimalValues[0].PropValue > 0); }
            return false;
        }
        this.SetDecimalLength = function (propName, decimalLength) {
            var maxDecimalLengths = AJS.SearchObjects(this.numericPropMaxDecimalLengths, propName, "PropName", false, true, false);
            if (maxDecimalLengths.length > 0 && decimalLength > maxDecimalLengths[0].PropValue) { maxDecimalLengths[0].PropValue = decimalLength; }
            else { this.numericPropMaxDecimalLengths.push(new AJS.PropertyValueContainer(propName, decimalLength)); }
        }
        /***/

        this.numericStringPropNames = [];

        /***/

        this.stringPropNames = [];

        this.stringPropMinLengths = [];
        this.GetStringMinLength = function (propName) {
            var minLengths = AJS.SearchObjects(this.stringPropMinLengths, propName, "PropName", false, true, false);
            if (minLengths.length > 0) { return minLengths[0].PropValue; }
            return null;
        }
        this.SetStringMinLength = function (propName, propValue) {
            var minLengths = AJS.SearchObjects(this.stringPropMinLengths, propName, "PropName", false, true, false);
            if (minLengths.length > 0 && propValue.length < minLengths[0].PropValue) { minLengths[0].PropValue = propValue.length; }
            else { this.stringPropMinLengths.push(new AJS.PropertyValueContainer(propName, propValue.length)); }
        }

        this.stringPropMaxLengths = [];
        this.GetStringMaxLength = function (propName) {
            var maxLengths = AJS.SearchObjects(this.stringPropMaxLengths, propName, "PropName", false, true, false);
            if (maxLengths.length > 0) { return maxLengths[0].PropValue; }
            return null;
        }
        this.SetStringMaxLength = function (propName, propValue) {
            var maxLengths = AJS.SearchObjects(this.stringPropMaxLengths, propName, "PropName", false, true, false);
            if (maxLengths.length > 0 && propValue.length > maxLengths[0].PropValue) { maxLengths[0].PropValue = propValue.length; }
            else { this.stringPropMaxLengths.push(new AJS.PropertyValueContainer(propName, propValue.length)); }
        }

        this.upperCaseStrings = [];
        this.invalidUpperCaseStrings = [];

        /***/

        this.datePropNames = [];
        this.arrayPropNames = [];
        this.objectPropNames = [];



        this.multipleTypePropertyNames = [];

        this.sometimesNumericPropNames = [];
        this.sometimesDatePropNames = [];
        this.sometimesArrayPropNames = [];
        this.sometimesObjectPropNames = [];
        this.sometimesStringPropNames = [];

        this.sometimesUndefinedPropNames = [];

        this.sometimesNullPropNames = [];
        this.alwaysNullPropNames = [];

        /*** maintain arrays of prop names that have been removed from value type / value category arrays - these invalid arrays validate add() parameters ***/

        this.invalidNumericPropNames = [];
        this.invalidDatePropNames = [];
        this.invalidArrayPropNames = [];
        this.invalidObjectPropNames = [];
        this.invalidStringPropNames = [];

        /*** store the first values of each type to determine if mult values exist for this property ***/
        this.firstPropValues = [];
        this.singleValuePropNames = [];
        this.duplicateValuePropNames = [];

        this.GetFirstPropValue = function (propName) {
            for (var i = 0; i < this.initialPropValues; i++) { if (this.firstPropValues[i].propName == propName) { return this.firstPropValues[i].propValue; } }
            return null;
        }

        /*** add / remove to prop name array functions ***/

        this.ValidatePropNameListAssignments = function (propName, propValue) {

            var propNameExistsInOtherLists = false;

            /*** resolve date props from string props later ***/
            // if ($.IsDate(propValue)) { propValue = String(propValue); }

            if (!AJS.IsNumber(propValue) && this.numericPropNames.Contains(propName)) {
                propNameExistsInOtherLists = true;
                this.removeNumericPropName(propName);
                if (!this.sometimesNumericPropNames.Contains(propName)) { sometimesNumericPropNames.push(); }
                if (!this.multipleTypePropertyNames.Contains(propName)) { multipleTypePropertyNames.push(); }
            }

            if (!AJS.IsDate(propValue) && this.datePropNames.Contains(propName)) {
                propNameExistsInOtherLists = true;
                this.removeDatePropName(propName);
                if (!this.sometimesDatePropNames.Contains(propName)) { sometimesDatePropNames.push(); }
                if (!this.multipleTypePropertyNames.Contains(propName)) { multipleTypePropertyNames.push(); }
            }

            if (!AJS.IsArray(propValue) && this.arrayPropNames.Contains(propName)) {
                propNameExistsInOtherLists = true;
                this.removeArrayPropName(propName);
                if (!this.sometimesArrayPropNames.Contains(propName)) { sometimesArrayPropNames.push(); }
                if (!this.multipleTypePropertyNames.Contains(propName)) { multipleTypePropertyNames.push(); }
            }

            if (!AJS.IsObject(propValue) && this.objectPropNames.Contains(propName)) {
                propNameExistsInOtherLists = true;
                this.removeObjectPropName(propName);
                if (!this.sometimesArrayPropNames.Contains(propName)) { sometimesArrayPropNames.push(); }
                if (!this.multipleTypePropertyNames.Contains(propName)) { multipleTypePropertyNames.push(); }
            }

            if (!AJS.IsString(propValue) && this.stringPropNames.Contains(propName)) {
                propNameExistsInOtherLists = true;
                this.removeStringPropName(propName);
                if (!this.sometimesArrayPropNames.Contains(propName)) { sometimesArrayPropNames.push(); }
                if (!this.multipleTypePropertyNames.Contains(propName)) { multipleTypePropertyNames.push(); }
            }

            return propNameExistsInOtherLists;
        }

        this.addProp = function (propName, propValue, objIndex, numObjs) {

            if (typeof propName == "undefined") { AJS.LogExc("AJS.AwesomeObjectInfo.addProp() - typeof propName == \"undefined\""); return; }
            if (typeof propValue == "undefined") { AJS.LogExc("AJS.AwesomeObjectInfo.addProp() - typeof propValue == \"undefined\""); return; }
            /* end validation */

            if (propValue == null && !this.sometimesNullPropNames.Contains(propName)) { this.sometimesNullPropNames.push(propName); return; }

            /*** resolve date props from string props later ***/
            if (AJS.IsDate(propValue)) { propValue = String(propValue); }

            if (objIndex < 10 || objIndex > (numObjs - 10)) {
                if (AJS.IsNumber(propValue) && !this.sometimesNumericPropNames.Contains(propName)) { this.sometimesNumericPropNames.push(propName); }
                else if (AJS.IsString(propValue) && !this.sometimesStringPropNames.Contains(propName)) { this.sometimesStringPropNames.push(propName); }
                else if (AJS.IsArray(propValue) && !this.sometimesArrayPropNames.Contains(propName)) { this.sometimesArrayPropNames.push(propName); }
                else if (AJS.IsObject(propValue) && !this.sometimesObjectPropNames.Contains(propName)) { this.sometimesObjectPropNames.push(propName); }
            }

            if (AJS.IsNumber(propValue) && !this.invalidNumericPropNames.Contains(propName)) {

                if (objIndex < 50 || objIndex > (numObjs - 25)) {
                    this.SetNumericMinValue(propName, propValue);
                    this.SetNumericMaxValue(propName, propValue);
                }

                if (objIndex < 15 || objIndex > (numObjs - 15)) {
                    this.SetDecimalLength(propName, String(propValue).ReadAfterLastOf(".").length);
                }

                if (objIndex < 5 && !this.numericPropNames.Contains(propName)) { this.numericPropNames.push(propName); }

            } else if (AJS.IsString(propValue) && !this.invalidStringPropNames.Contains(propName)) {

                if (objIndex < 50 || objIndex > (numObjs - 25)) {
                    this.SetStringMinLength(propName, propValue);
                    this.SetStringMaxLength(propName, propValue);
                }

                if (objIndex < 15 || objIndex > (numObjs - 15)) {
                    if (!this.invalidUpperCaseStrings.Contains(propName)) {
                        if (propValue.toUpperCase() == propValue) {
                            if (!this.upperCaseStrings.Contains(propName)) { this.upperCaseStrings.push(propName); }
                        } else {
                            this.invalidUpperCaseStrings.push(propName);
                            if (this.upperCaseStrings.Contains(propName)) { this.upperCaseStrings.Remove(propName); }
                        }
                    }
                }

                if (objIndex < 5 && !this.stringPropNames.Contains(propName)) { this.stringPropNames.push(propName); }

            } else if (AJS.IsArray(propValue) && !this.invalidArrayPropNames.Contains(propName)) {
                if (objIndex < 5 && !this.arrayPropNames.Contains(propName)) { this.arrayPropNames.push(propName); }
            } else if (AJS.IsObject(propValue) && !this.invalidObjectPropNames.Contains(propName)) {
                if (objIndex < 5 && !this.objectPropNames.Contains(propName)) { this.objectPropNames.push(propName); }
            }

            if (objIndex < 10) {
                this.ValidatePropNameListAssignments(propName, propValue);
            }
        };

        this.removeNumericPropName = function (propName) {
            if (typeof propName != "string" || AJS.IsNullOrWhiteSpace(propName)) { return; }
            if (!this.invalidNumericPropNames.Contains(propName)) { this.invalidNumericPropNames.push(propName); } else { return; }
            this.numericPropNames.Remove(numericPropName);
        };

        this.removeArrayPropName = function (propName) {
            if (typeof propName != "string" || AJS.IsNullOrWhiteSpace(propName)) { return; }
            if (!this.invalidArrayPropNames.Contains(propName)) { this.invalidArrayPropNames.push(propName); } else { return; }
            this.arrayPropNames.Remove(numericPropName);
        };

        this.removeObjectPropName = function (propName) {
            if (typeof propName != "string" || AJS.IsNullOrWhiteSpace(propName)) { return; }
            if (!this.invalidObjectPropNames.Contains(propName)) { this.invalidObjectPropNames.push(propName); } else { return; }
            this.objectPropNames.Remove(numericPropName);
        };

        this.removeStringPropName = function (propName) {
            if (typeof propName != "string" || AJS.IsNullOrWhiteSpace(propName)) { return; }
            if (!this.invalidStringPropNames.Contains(propName)) { this.invalidStringPropNames.push(propName); } else { return; }
            this.stringPropNames.Remove(numericPropName);
        };

        this.toString = function () {
            try {
                var logStr =
                    "Type Name : " + (this.typeName || "null") + "\n"
                    + "Type Name (Plural) : " + this.TypeNamePlural() + "\n"
                    + "Primary Key Property Name : " + (this.primaryKeyPropName || "null") + "\n"
                    + "Primary Text Property Name : " + (this.primaryTextPropName || "null") + "\n";

                if (this.propNames.length > 0) {
                    logStr += "Property Names : ";
                    $.each(this.propNames, function (propIndex, propName) {
                        logStr += propName + ", ";
                    });
                    logStr = logStr.TrimBy(2);
                    logStr += "\n";
                }

                if (this.numericPropNames.length > 0) {
                    logStr += "Numeric Properties :";
                    for (var i = 0; i < this.numericPropNames.length; i++) {
                        var propName = this.numericPropNames[i];
                        logStr += "\n<b>" + propName + "</b>";
                        var minValue = this.GetNumericMinValue(propName);
                        if (minValue != null) { logStr += " - Min Value: " + String(minValue); }
                        var maxValue = this.GetNumericMaxValue(propName);
                        if (maxValue != null) { logStr += " - Max Value: " + String(maxValue); }
                        logStr += " - IsDecimal = " + String(this.IsDecimal(propName));
                    };
                    logStr += "\n\n";
                }
                if (this.stringPropNames.length > 0) {
                    logStr += "String Properties :";
                    for (var i = 0; i < this.stringPropNames.length; i++) {
                        var propName = this.stringPropNames[i];
                        logStr += "\n<b>" + propName + "</b>";
                        var minLength = this.GetStringMinLength(propName);
                        if (minLength != null) { logStr += " - Min Length: " + String(minLength); }
                        var maxLength = this.GetStringMaxLength(propName);
                        if (maxLength != null) { logStr += " - Max Length: " + String(maxLength); }
                        if (this.upperCaseStrings.Contains(propName)) { logStr += " - UPPERCASE"; }
                    }
                    logStr + "\n\n";
                }
                if (this.numericStringPropNames.length > 0) { logStr += "Numeric String Properties :"; $.each(this.numericStringPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.datePropNames.length > 0) { logStr += "Date Properties :"; $.each(this.datePropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.arrayPropNames.length > 0) { logStr += "Array Properties :"; $.each(this.arrayPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.objectPropNames.length > 0) { logStr += "Object Properties :"; $.each(this.objectPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }

                if (this.sometimesUndefinedPropNames.length > 0) { logStr += "Properties Not Defined By All Objects :"; $.each(this.sometimesUndefinedPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.alwaysNullPropNames.length > 0) { logStr += "Properties That Are Always Null :"; $.each(this.alwaysNullPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.sometimesNullPropNames.length > 0) { logStr += "Properties That Sometimes Null :"; $.each(this.sometimesNullPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }

                if (this.singleValuePropNames.length > 0) { logStr += "Properties With Unique Value :"; $.each(this.singleValuePropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.duplicateValuePropNames.length > 0) { logStr += "Properties With Duplicate Values :"; $.each(this.duplicateValuePropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }

                if (this.multipleTypePropertyNames.length > 0) { logStr += "Properties That Have Multiple Value Types :"; $.each(this.multipleTypePropertyNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }

                if (this.sometimesNumericPropNames.length > 0) { logStr += "Sometimes Numeric :"; $.each(this.sometimesNumericPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.sometimesStringPropNames.length > 0) { logStr += "Sometimes String :"; $.each(this.sometimesStringPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.sometimesArrayPropNames.length > 0) { logStr += "Sometimes Array :"; $.each(this.sometimesArrayPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }
                if (this.sometimesObjectPropNames.length > 0) { logStr += "Sometimes Object :"; $.each(this.sometimesObjectPropNames, function (propIndex, propName) { logStr += propName + ", "; }); logStr = logStr.TrimBy(2) + "\n"; }

                return logStr;
            }
            catch (exc) { AJS.LogExc(exc); }
            return "";
        };

        this.toHtmlString = function () {
            try {
                var htmlStr = this.toString();
                htmlStr = htmlStr.replace("Type Name :", "<b style=\"margin-right:10px;\">Type Name :</b>");
                htmlStr = htmlStr.replace("Type Name (Plural) :", "<b style=\"margin-right:10px;\">Type Name (Plural) :</b>");
                htmlStr = htmlStr.replace("Primary Key Property Name :", "<b style=\"margin-right:10px;\">Primary Key Property Name :</b>");
                htmlStr = htmlStr.replace("Primary Text Property Name :", "<b style=\"margin-right:10px;\">Primary Text Property Name :</b>");

                htmlStr = htmlStr.replace("Property Names :", "<br /><b style=\"margin-right:10px;\">Property Names :</b>");
                htmlStr = htmlStr.replace("Numeric Properties :", "<br /><b style=\"margin-right:10px; text-decoration:underline;\">Numeric Properties :</b>");
                htmlStr = htmlStr.replace("String Properties :", "<b style=\"margin-right:10px; text-decoration:underline;\">String Properties :</b>");
                htmlStr = htmlStr.replace("Numeric String Properties :", "<b style=\"margin-right:10px;\">Numeric String Properties :</b>");
                htmlStr = htmlStr.replace("Date Properties :", "<br /><b style=\"margin-right:10px;\">Date Properties:</b>");
                htmlStr = htmlStr.replace("Property Names :", "<br /><b style=\"margin-right:10px;\">Property Names :</b>");
                htmlStr = htmlStr.replace("Array Properties :", "<br /><b style=\"margin-right:10px;\">Array Properties :</b>");
                htmlStr = htmlStr.replace("Object Properties :", "<br /><b style=\"margin-right:10px;\">Object Properties :</b>");

                htmlStr = htmlStr.replace("Properties Not Defined By All Objects:", "<br /><b style=\"margin-right:10px;\">Properties Not Defined By All Objects:</b>");
                htmlStr = htmlStr.replace("Properties That Are Always Null :", "<b style=\"margin-right:10px;\">Properties That Are Always Null :</b>");
                htmlStr = htmlStr.replace("Properties That Sometimes Null :", "<b style=\"margin-right:10px;\">Properties That Sometimes Null :</b>");

                htmlStr = htmlStr.replace("Properties With Unique Value :", "<br /><b style=\"margin-right:10px;\">Properties With Unique Value :</b>");
                htmlStr = htmlStr.replace("Properties With Duplicate Values :", "<b style=\"margin-right:10px;\">Properties With Duplicate Values :</b>");
                htmlStr = htmlStr.replace("Properties That Have Multiple Value Types :", "<b style=\"margin-right:10px;\">Properties That Have Multiple Value Types :</b>");

                htmlStr = htmlStr.replace("Sometimes Numeric :", "<br /><b style=\"margin-right:10px;\">Sometimes Numeric :</b>");
                htmlStr = htmlStr.replace("Sometimes String :", "<b style=\"margin-right:10px;\">Sometimes String :</b>");
                htmlStr = htmlStr.replace("Sometimes Array :", "<b style=\"margin-right:10px;\">Sometimes Array :</b>");
                htmlStr = htmlStr.replace("Sometimes Object :", "<b style=\"margin-right:10px;\">Sometimes Object :</b>");

                htmlStr = htmlStr.ReplaceAll("\n", "<br />");

                return htmlStr;
            }
            catch (exc) {
                AJS.LogExc(exc);
            }
            return "";
        }

        this.IsPopulated = function () {
            try { return !AJS.IsNullOrWhiteSpace(this.typeName) && !AJS.IsNullOrWhiteSpace(this.primaryKeyPropName) && !AJS.IsNullOrWhiteSpace(this.primaryTextPropName); }
            catch (exc) { AJS.LogExc(exc); }
            return false;
        }
    }

    this.GetObjectInfo = function (objOrObjArray) {
        var objInfo = new this.AwesomeObjectInfo();

        try {
            if (typeof objOrObjArray != "object" || objOrObjArray == null) { this.LogExc("GetObjectInfo() - parameter is null"); return null; }
            var obj = null;
            var objArray = null;
            if (this.IsArray(objOrObjArray)) { if (objOrObjArray.length == 0) { return; } objArray = objOrObjArray; obj = objOrObjArray[0]; }
            else { obj = objOrObjArray; objArray = []; objArray.push(obj); }
            if (typeof obj != "object" || obj == null) { this.LogExc("GetObjectInfo() - obj is null - could not resolve obj from parameter"); return null; }
            if (typeof objArray != "object" || objArray == null) { this.LogExc("GetObjectInfo() - objArray is null - could not resolve obj from parameter"); return null; }
            /* end validation */

            objInfo.propName = this.GetPropertyNames(obj);

            /*** populate AwesomeObjectInfo property names by type ***/

            var firstPropName = this.GetFirstPropName(obj);
            var invalidPrimaryKeyPropNames = [];

            objInfo.propNames = this.GetPropertyNames(obj);

            var numObjs = objArray.length;
            $.each(objArray, function (objIndex, eachObj) {
                var currentObjIndex = objIndex;
                var currentObj = eachObj;
                $.each(objInfo.propNames, function (propIndex, propName) {
                    if (typeof currentObj[propName] == "undefined") { return; }
                    var propValue = currentObj[propName];
                    objInfo.addProp(propName, propValue, currentObjIndex, numObjs);
                })
            });

            $.each(objInfo.numericPropNames, function (index, propName) { objInfo.sometimesNumericPropNames.Remove(propName); });
            $.each(objInfo.stringPropNames, function (index, propName) { objInfo.sometimesStringPropNames.Remove(propName); });
            $.each(objInfo.arrayPropNames, function (index, propName) { objInfo.sometimesArrayPropNames.Remove(propName); });
            $.each(objInfo.objectPropNames, function (index, propName) { objInfo.sometimesObjectPropNames.Remove(propName); });

            //            for (var i = 0; i < objInfo.stringPropNames; i++) {
            //                var isDateColumn = true;
            //                var isNumericColumn = true;
            //            }


            /*** if first prop name follows id / primary key naming convention then set as primary key (if no dups) and make type / text prop assumptions ***/
            for (var idAppendageIndex = 0; idAppendageIndex < this.ConventionalIdPropertyAppendages.length; idAppendageIndex++) {
                var idAppendage = this.ConventionalIdPropertyAppendages[idAppendageIndex];
                if (firstPropName.EndsWith(idAppendage)) {
                    if (this.DuplicatePropertyValueExistsInObjArray(objArray, firstPropName, true, true)) {
                        invalidPrimaryKeyPropNames.push[firstPropName];
                    } else {
                        objInfo.setPrimaryKeyPropName(firstPropName);
                        if (firstPropName != idAppendage) {
                            objInfo.setTypeName(objInfo.primaryKeyPropName.RemoveSuffix(idAppendage));
                            /*** primaryKeyPropName and type name assigned successfully - assign primaryTextPropName and get out of here! ***/
                            for (var nameAppendageIndex = 0; nameAppendageIndex < this.ConventionalNamePropertyAppendages.length; nameAppendageIndex++) {
                                var nameAppendage = this.ConventionalNamePropertyAppendages[nameAppendageIndex];
                                if (typeof obj[objInfo.typeName + idAppendage] == "string") {
                                    objInfo.setPrimaryTextPropName(objInfo.typeName + idAppendage);
                                    break;
                                }
                                if (typeof obj[objInfo.typeName.toLowerCase() + idAppendage] == "string") {
                                    objInfo.setPrimaryTextPropName(objInfo.typeName.toLowerCase() + idAppendage);
                                    break;
                                }
                            }
                            if (typeof obj[objInfo.typeName] == "string") { /*** no corresponding "name" prop exists, check for typeName property ***/
                                objInfo.setPrimaryTextPropName(objInfo.typeName);
                                break;
                            }

                            $.each(objInfo.stringPropNames, function (indexInArray, stringPropName) { /*** no typeName property - get first string property that DOES NOT follow name / text naming conventions - already checked for a property w/ typeName + nameAppendage(s) - other properties that follow naming conventions prob refers to a different obj / type name ***/
                                if (!stringPropName.ContainsAny(AJS.ConventionalNamePropertyAppendages)) { objInfo.setPrimaryTextPropName(stringPropName); }
                            });

                            if (objInfo.IsPopulated()) { return objInfo; }
                        }
                        break;
                    }

                }
                if (objInfo.IsPopulated()) { return objInfo; }
            }
            if (objInfo.IsPopulated()) { return objInfo; }


            /*** if first prop name follows name / primary text naming convention then set as primary text prop and make type / id prop assumptions ***/
            for (var nameAppendageIndex = 0; nameAppendageIndex < this.ConventionalNamePropertyAppendages.length; nameAppendageIndex++) {
                var nameAppendage = this.ConventionalNamePropertyAppendages[nameAppendageIndex];
                if (firstPropName.EndsWith(nameAppendage)) {

                    objInfo.setPrimaryTextPropName(firstPropName);

                    if (firstPropName != nameAppendage) {
                        objInfo.setTypeName(objInfo.primaryTextPropName.RemoveSuffix(nameAppendage));

                        for (var idAppendageIndex = 0; idAppendageIndex < this.ConventionalIdPropertyAppendages.length; idAppendageIndex++) { /*** primaryTextPropName and typeName assigned successfully - assign primaryKeyPropName and get out of here! ***/
                            var idAppendage = this.ConventionalIdPropertyAppendages[idAppendageIndex];
                            var possiblePrimaryKeyName = objInfo.typeName + idAppendage;
                            if (typeof obj[possiblePrimaryKeyName] != "undefined") {
                                if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) {
                                    if (this.DuplicatePropertyValueExistsInObjArray(objArray, possiblePrimaryKeyName)) { if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) { invalidPrimaryKeyPropNames.push(possiblePrimaryKeyName); } }
                                    else { objInfo.setPrimaryKeyPropName(possiblePrimaryKeyName); break; }
                                }
                            }
                            possiblePrimaryKeyName = objInfo.typeName.toLowerCase() + idAppendage;
                            if (typeof obj[possiblePrimaryKeyName] != "undefined") {
                                if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) {
                                    if (this.DuplicatePropertyValueExistsInObjArray(objArray, possiblePrimaryKeyName)) { if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) { invalidPrimaryKeyPropNames.push(possiblePrimaryKeyName); } }
                                    else { objInfo.setPrimaryKeyPropName(possiblePrimaryKeyName); break; }
                                }
                            }
                        }

                        if (typeof obj[objInfo.typeName] != "undefined") { /*** no corresponding "id" prop exists, check for typeName property itself ***/
                            objInfo.setPrimaryKeyPropName(objInfo.typeName);
                            break;
                        }

                        $.each(objInfo.numericPropNames, function (indexInArray, numericPropName) { /*** no typeName property - get first string property that DOES NOT follow name / text naming conventions - already checked for a property w/ typeName + nameAppendage(s) - other properties that follow naming conventions prob refers to a different obj / type name ***/
                            if (!numericPropName.ContainsAny(AJS.ConventionalIdPropertyAppendages)) { objInfo.setPrimaryKeyPropName(numericPropName); }
                        });
                    }
                    break;

                }
                if (objInfo.IsPopulated()) { return objInfo; }
            }

            if (objInfo.IsPopulated()) { return objInfo; }

            appendage = "";

            var primaryPropName = null;
            for (var appendageIndex = 0; appendageIndex < this.ConventionalPropertyAppendages.length; appendageIndex++) {
                if (primaryPropName == null) {
                    var appendage = this.ConventionalPropertyAppendages[appendageIndex];
                    primaryPropName = this.GetFirstPropNameWithAppendage(obj, appendage, true);

                    if (primaryPropName != null) {

                        var propValueConvertedToNumber = null;
                        if (typeof obj[primaryPropName] == "string" && !this.IsNullOrWhiteSpace(obj[primaryPropName])) {
                            try { propValueConvertedToNumber = Number(obj[primaryPropName]); } catch (convertExc) { propValueConvertedToNumber = null; }
                        }

                        if (typeof obj[primaryPropName] == "number" || this.IsNumber(propValueConvertedToNumber)) {

                            var possiblePrimaryKeyName = primaryPropName;
                            if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) {
                                if (this.DuplicatePropertyValueExistsInObjArray(objArray, possiblePrimaryKeyName)) { if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) { invalidPrimaryKeyPropNames.push(possiblePrimaryKeyName); } }
                                else { objInfo.setPrimaryKeyPropName(possiblePrimaryKeyName); }
                            }

                        } else if (typeof obj[primaryPropName] == "string" && !this.IsNullOrWhiteSpace(obj[primaryPropName])) { objInfo.setPrimaryTextPropName(primaryPropName); }

                        objInfo.setTypeName(primaryPropName.substring(0, primaryPropName.length - appendage.length));

                        break;
                    }
                }
            }

            /*** if typeName, look for id and text props by type naming conventions ***/
            if (!AJS.IsNullOrWhiteSpace(objInfo.typeName)) {
                if (AJS.IsNullOrWhiteSpace(objInfo.primaryKeyPropName)) {
                    for (var appendageIndex = 0; appendageIndex < this.ConventionalIdPropertyAppendages.length; appendageIndex++) {
                        var idAppendage = this.ConventionalIdPropertyAppendages[appendageIndex];

                        var possiblePrimaryKeyName = objInfo.typeName + idAppendage;
                        if (typeof obj[possiblePrimaryKeyName] != "undefined") {
                            if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) {
                                if (this.DuplicatePropertyValueExistsInObjArray(objArray, possiblePrimaryKeyName)) { if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) { invalidPrimaryKeyPropNames.push(possiblePrimaryKeyName); } }
                                else { objInfo.setPrimaryKeyPropName(possiblePrimaryKeyName); }
                            }
                        }

                    }
                }
                if (AJS.IsNullOrWhiteSpace(objInfo.primaryTextPropName)) {
                    for (var appendageIndex = 0; appendageIndex < this.ConventionalNamePropertyAppendages.length; appendageIndex++) {
                        appendage = this.ConventionalNamePropertyAppendages[appendageIndex];
                        if (typeof obj[objInfo.typeName + appendage] != "undefined" && obj[objInfo.typeName + appendage] != null) {
                            objInfo.setPrimaryTextPropName(objInfo.typeName + appendage);
                        }
                    }
                }
            }

            // objInfo.setPrimaryKeyPropName(this.GetFirstPropNameWithAppendage(obj, "id", false));
            // objInfo.setPrimaryKeyPropName(this.GetFirstNumberPropName(obj));

            if (objInfo.IsPopulated()) { return objInfo; }

            /*** if key or text, but not the other, look for look for the other field via naming conventions ***/
            if (this.IsNullOrWhiteSpace(objInfo.primaryTextPropName) && !this.IsNullOrWhiteSpace(objInfo.primaryKeyPropName)) { /*** try to set the text prop by changing id => name on the id prop name ***/
                var primaryKeyPropNameAppendageRemoved = objInfo.primaryKeyPropName;
                for (var appendageIndex = 0; appendageIndex < this.ConventionalIdPropertyAppendages.length; appendageIndex++) {
                    primaryKeyPropNameAppendageRemoved = primaryKeyPropNameAppendageRemoved.RemoveSuffix(this.ConventionalIdPropertyAppendages[appendageIndex]);
                }
                for (var appendageIndex = 0; appendageIndex < this.ConventionalNamePropertyAppendages.length; appendageIndex++) {
                    appendage = this.ConventionalNamePropertyAppendages[appendageIndex];
                    if (typeof obj[primaryKeyPropNameAppendageRemoved + appendage] != "undefined" && obj[primaryKeyPropNameAppendageRemoved + appendage] != null) {
                        objInfo.setPrimaryTextPropName(primaryKeyPropNameAppendageRemoved + appendage);
                        break;
                    }
                }
                if (this.IsNullOrWhiteSpace(objInfo.primaryTextPropName) && typeof obj[primaryKeyPropNameAppendageRemoved] != "undefined" && obj[primaryKeyPropNameAppendageRemoved] != null) {
                    objInfo.setPrimaryTextPropName(primaryKeyPropNameAppendageRemoved);
                }
            }

            if (this.IsNullOrWhiteSpace(objInfo.primaryKeyPropName) && !this.IsNullOrWhiteSpace(objInfo.primaryTextPropName)) { /*** go the other way - try to set the id prop by changing name => id on the text prop name ***/
                var objNamePropNameAppendageRemoved = objInfo.primaryTextPropName;
                for (var appendageIndex = 0; appendageIndex < this.ConventionalNamePropertyAppendages.length; appendageIndex++) {
                    objNamePropNameAppendageRemoved = objNamePropNameAppendageRemoved.RemoveSuffix(this.ConventionalNamePropertyAppendages[appendageIndex]);
                }
                for (var appendageIndex = 0; appendageIndex < this.ConventionalIdPropertyAppendages.length; appendageIndex++) {
                    appendage = this.ConventionalIdPropertyAppendages[appendageIndex];
                    if (typeof obj[objNamePropNameAppendageRemoved + appendage] != "undefined" && obj[objNamePropNameAppendageRemoved + appendage] != null) {

                        var possiblePrimaryKeyName = objNamePropNameAppendageRemoved + appendage;
                        if (typeof obj[possiblePrimaryKeyName] != "undefined") {
                            if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) {
                                if (this.DuplicatePropertyValueExistsInObjArray(objArray, possiblePrimaryKeyName)) { if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) { invalidPrimaryKeyPropNames.push(possiblePrimaryKeyName); } }
                                else { objInfo.setPrimaryKeyPropName(possiblePrimaryKeyName); break; }
                            }
                        }

                    }
                }
            }

            if (objInfo.IsPopulated()) { return objInfo; }

            if (this.IsNullOrWhiteSpace(objInfo.primaryTextPropName)) { objInfo.setPrimaryTextPropName(this.GetFirstStringPropName(obj)); }
            if (this.IsNullOrWhiteSpace(objInfo.primaryTextPropName) && !this.IsNullOrWhiteSpace(objInfo.primaryKeyPropName)) { objInfo.setPrimaryTextPropName(objInfo.primaryKeyPropName); }

            if (objInfo.IsPopulated()) { return objInfo; }

            /*** done everything to assign primary text property, now take one last crack at primary key ***/
            if (this.IsNullOrWhiteSpace(objInfo.primaryKeyPropName) && !this.IsNullOrWhiteSpace(objInfo.primaryTextPropName)) {
                /*** ok, text prop is set, but not primary key, now choose first number property THAT DOESNT MATCH a naming convention - if it matched a naming convention, the property should have been picked up by now ***/
                for (var i = 0; i < objInfo.numericPropNames.length; i++) {
                    numericPropName = objInfo.numericPropNames[i];
                    if (!numericPropName.EndsWithAny(this.ConventionalIdPropertyAppendages)) {
                        var possiblePrimaryKeyName = numericPropName;
                        if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) {
                            if (this.DuplicatePropertyValueExistsInObjArray(objArray, possiblePrimaryKeyName)) { if (!invalidPrimaryKeyPropNames.Contains(possiblePrimaryKeyName)) { invalidPrimaryKeyPropNames.push(possiblePrimaryKeyName); } }
                            else { objInfo.setPrimaryKeyPropName(possiblePrimaryKeyName); break; }
                        }
                    }
                }
            }

            /*** done all possible to set primary key / text properties, now take another crack at the type name ***/
            if (this.IsNullOrWhiteSpace(objInfo.typeName)) {
                if (!this.IsNullOrWhiteSpace(objInfo.primaryKeyPropName)) {
                    for (var appendageIndex = 0; appendageIndex < this.ConventionalIdPropertyAppendages.length; appendageIndex++) {
                        appendage = this.ConventionalIdPropertyAppendages[appendageIndex];
                        if (objInfo.primaryKeyPropName.EndsWith(appendage)) {
                            objInfo.setTypeName(objInfo.primaryKeyPropName.RemoveSuffix(appendage));
                            break;
                        }
                    }
                }
            }
            if (this.IsNullOrWhiteSpace(objInfo.typeName)) {
                if (!this.IsNullOrWhiteSpace(objInfo.primaryKeyPropName)) {
                    for (var appendageIndex = 0; appendageIndex < this.ConventionalNamePropertyAppendages.length; appendageIndex++) {
                        appendage = this.ConventionalNamePropertyAppendages[appendageIndex];
                        if (objInfo.primaryTextPropName.EndsWith(appendage)) {
                            objInfo.setTypeName(objInfo.primaryTextPropName.RemoveSuffix(appendage));
                            break;
                        }
                    }
                }
            }

            if (this.IsNullOrWhiteSpace(objInfo.typeName) && !this.IsNullOrWhiteSpace(objInfo.primaryKeyPropName)) { objInfo.setTypeName(objInfo.primaryKeyPropName); }
            if (this.IsNullOrWhiteSpace(objInfo.typeName) && !this.IsNullOrWhiteSpace(objInfo.primaryTextPropName)) { objInfo.setTypeName(objInfo.primaryTextPropName); }

        } catch (exc) {
            this.LogExc(exc);
        }
        return objInfo;
    };

    /*** end AwesomeObjectInfo / GetObjectInfo - begin object property functions ***/

    this.GetPropertyNames = function (obj) {
        if (typeof obj != "object" || obj == null) { return null; }
        var propNames = [];
        for (var propName in obj) { if (!propNames.Contains(propName)) { propNames.push(propName); } }
        return propNames;
    }

    this.GetFirstPropName = function (obj) {
        try {
            if (typeof obj != "object" || obj == null) { return null; }
            for (var propName in obj) { return propName; }
            return null;
        } catch (exc) { AJS.LogExc(exc); }
    };

    this.GetFirstNumberPropName = function (obj) {
        try {
            if (typeof obj != "object" || obj == null) { return null; }
            for (var propName in obj) {
                if (AJS.IsNumber(obj[propName])) {
                    return propName;
                }
            }
            return null;
        } catch (exc) { AJS.LogExc(exc); }
    };

    this.GetFirstStringPropName = function (obj) {
        try {
            if (typeof obj != "object" || obj == null) { return null; }
            for (var propName in obj) {
                if (AJS.IsString(obj[propName])) {
                    return propName;
                }
            }
            return null;
        } catch (exc) { AJS.LogExc(exc); }
    };


    this.GetFirstStringPropNameThatContains = function (obj, requiredTextInName) {
        try {
            if (typeof obj != "object" || obj == null) { return null; }
            if (typeof requiredTextInName == "undefined" || requiredTextInName == null) { return this.GetFirstStringPropName(); }
            if (typeof requiredTextInName != "string") { requiredTextInName = String(requiredTextInName); }
            if (AJS.IsNullOrWhiteSpace(requiredTextInName)) { return this.GetFirstStringPropName(); }
            for (var propName in obj) {
                if (AJS.IsString(obj[propName])) {
                    if (propName.toLowerCase().Contains(requiredTextInName.Trim())) {
                        return propName;
                    }
                }
            }
            return null;
        } catch (exc) { AJS.LogExc(exc); }
    };

    this.GetFirstPropNameWithAppendage = function (obj, appendage, caseSensitive) {
        if (typeof caseSensitive != "boolean") { caseSensitive = true; }
        try {
            /*** validate parameters ***/
            if (typeof obj != "object" || obj == null) { return null; }
            if (typeof appendage == "undefined" || appendage == null) { return null; }
            if (typeof appendage != "string") { appendage = String(appendage); }
            if (AJS.IsNullOrWhiteSpace(appendage)) { return null; }
            /*** end validate parameters ***/

            for (var propName in obj) { if (propName.EndsWith(appendage, caseSensitive)) { return propName; } }
            return null;

        } catch (exc) { AJS.LogExc(exc); }
    };

    this.DuplicatePropertyValueExistsInObjArray = function (objArray, propName, onErrorReturnValue, returnTrueIfAnyPropertyValueIsNullOrUndefined) {
        if (typeof onErrorReturnValue != "boolean") { onErrorReturnValue = true; } /*** the default here is true - this function is used to validate a property - if there is an error we return the value indicating "bad" validation (in this case, duplicate property values) ***/
        if (typeof returnTrueIfAnyPropertyValueIsNullOrUndefined != "boolean") { returnTrueIfAnyPropertyValueIsNullOrUndefined = onErrorReturnValue; }
        try {
            /*** validate parameters ***/
            if (typeof objArray != "object") { AJS.LogExc("DuplicatePropertyValueExistsInObjArray() - typeof objArray != \"object\""); return onErrorReturnValue; }
            if (objArray == null) { AJS.LogExc("DuplicatePropertyValueExistsInObjArray() - objArray parameter null"); return onErrorReturnValue; }
            if (!this.IsArray(objArray)) { AJS.LogExc("DuplicatePropertyValueExistsInObjArray() - !this.IsArray(objArray)"); return onErrorReturnValue; }
            if (objArray.length <= 1) { return false; } /*** this is legit - if 0 or 1 objs, no duplicate prop value possible ***/
            if (typeof propName != "string") { AJS.LogExc("DuplicatePropertyValueExistsInObjArray() - typeof propName != \"string\""); return onErrorReturnValue; }
            if (this.IsNullOrWhiteSpace(propName)) { AJS.LogExc("DuplicatePropertyValueExistsInObjArray() - IsNullOrWhiteSpace(propName)"); return onErrorReturnValue; }
            if (typeof objArray[0] != "object") { AJS.LogExc("DuplicatePropertyValueExistsInObjArray() - typeof objArray[0] != \"object\""); return onErrorReturnValue; }
            if (typeof objArray[0][propName] == "undefined") { AJS.LogExc("DuplicatePropertyValueExistsInObjArray() - typeof objArray[0][propName] == \"undefined\" - propName = [" + propName + "]"); return onErrorReturnValue; }
            /*** end validate parameters ***/
            var valuesArray = [];
            // $.LogObj(objArray[0])
            for (var i = 0; i < objArray.length; i++) {
                var obj = objArray[i];
                if (typeof obj[propName] == "undefined" || obj[propName] == null) {
                    if (returnTrueIfAnyPropertyValueIsNullOrUndefined) { return true; }
                    else { continue; }
                }
                var propValue = obj[propName];
                if (valuesArray.Contains(propValue)) { return true; }
                else { valuesArray.push(propValue); }
            }
            return false;

        } catch (exc) { AJS.LogExc(exc); }

        return onErrorReturnValue;
    }

    /*** end AwesomeObjectInfo / GetObjectInfo / obj helper functions / obj property functions ***/
    /**************************************************************************************************/
    /*** Is[Somthing]() functions ***/

    this.IsString = function (o) { if (o == null || typeof o != "string") { return false; } return true; }

    this.IsNullOrWhiteSpace = function (o) { if (!this.IsString(o)) { return true; } if (jQuery.trim(o) == "") { return true; } return false; }

    this.IsNumber = function (o) {
        if (typeof jQuery == "object" && typeof jQuery.isNumeric == "function") { return jQuery.isNumeric(o); }
        if (typeof o != "number" || o == null || o == NaN || o == "NaN" || String(o) == "NaN") { return false; }
        return true;
    }

    this.IsDate = function (o) {
        if (typeof o == "undefined" || o == null) { return false; }
        return Boolean(o instanceof Date);
    }

    this.IsFunction = function (o) {
        if (typeof jQuery == "object" && typeof jQuery.isFunction == "function") { return jQuery.isFunction(o); }
        if (typeof o != "function" || o == null) { return false; }
        return true;
    }

    this.IsArray = function (o) {
        if (typeof jQuery == "object" && typeof jQuery.isArray == "function") { return jQuery.isArray(o); }
        // if (typeof o == "undefined" || o == null) { return false; }
        return o instanceof Array;
    }
    this.IsObject = function (o) { if (typeof o != "object" || o == null) { return false; } return true; }

    /*** end Is[Somthing]() functions ***/
    /**************************************************************************************************/

    this.GetFunctionStr = function (functionName) {
        try {
            if (typeof functionName == "undefined" || functionName == null) { return "AJS.DoNothing()"; }
            if (!AJS.IsString(functionName)) { return "AJS.DoNothing()"; }
            if (functionName.indexOf("(") != -1 && functionName.substring(functionName.length - 1) == ")") { return functionName; }
            while (functionName.contains("(")) { functionName = functionName.replace("(", ""); }
            while (functionName.contains(")")) { functionName = functionName.replace(")", ""); }
            return functionName + "()";
        } catch (exc) {
            this.LogExc(exc);
        }
    };

    /**************************************************************************************************/

    this.Search = new AwesomeSearchHelper();

    this.SearchObjects = function (objs, searchStrOrStrArray, propNameStrs, caseSensitive, exactMatchOnly, anySearchStr) {
        return this.Search.SearchObjects(objs, searchStrOrStrArray, propNameStrs, caseSensitive, exactMatchOnly, anySearchStr);
    };

    /**************************************************************************************************/

    this.Sort = new AwesomeSortHelper();

    this.SortObjects = function (objArray, sortPropName, sortOrder) {
        this.Sort.SortObjects(objArray, sortPropName, sortOrder);
    };

    /**************************************************************************************************/

    this.Html = new AwesomeHtmlHelper();

    /**************************************************************************************************/

    this.GetDomain = function () {
        try {
            var windowLocationChopped = String(window.location);
            var domain = "";
            var slashCount = 0;
            while (windowLocationChopped.Contains("/") && slashCount <= 3) {
                var chunk = windowLocationChopped.substring(0, windowLocationChopped.indexOf("/") + 1);
                domain += chunk;
                slashCount++;
                windowLocationChopped = windowLocationChopped.replace(chunk, "");
            }
            return domain;
        } catch (exc) {
            this.LogExc(exc);
        }
    }

    this.openWindow = this.OpenWindow = function (windowUrl, windowName) {
        try {
            if (typeof windowUrl != "string" || this.IsNullOrWhiteSpace(windowUrl)) { this.LogWarning("AJS.OpenWindow(windowUrl, windowName) - windowUrl parameter is invalid"); }
            if (typeof windowUrl != "string" || this.IsNullOrWhiteSpace(windowUrl)) { windowName = "new_window"; }
            window.open(windowUrl, windowName,
	            'fullscreen=no,toolbar=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,directories=no,location=no,width=750,height=600',
	            false);
        } catch (exc) {
            this.LogExc(exc);
        }
    }

    /**************************************************************************************************/

    this.aGet = function (s) { if (document.getElementById(s) != null) { return document.getElementById(s); } else if (document.getElementsByName(s)[0] != null) { return document.getElementsByName(s)[0]; } return null; }

    this.DoNothing = function () { };
    /*** sometimes I set the href property of an anchor to "javascript:void(AJS.DoNothing())" so the style renders correctly, and I run some other js using the onclick event
    Example: <a href="javascript:void(AJS.DoNothing())" onclick="[DO THE REAL WORK]">click here!</a>
    ***/

}

/********************************************************************************************************/

function AwesomeSearchHelper() {

    this.SearchObjects = function (objs, searchStrOrStrArray, propNameStrs, caseSensitive, exactMatchOnly, anySearchStr) {
        if (typeof objs == "undefined" || objs == null) { return []; }
        if (!AJS.IsArray(objs)) { return [objs]; }
        if (typeof searchStrOrStrArray == "undefined" || searchStrOrStrArray == null) { return objs; }
        if (typeof searchStrOrStrArray == "string") { searchStrOrStrArray = [searchStrOrStrArray]; }
        if (!AJS.IsArray(searchStrOrStrArray)) { return objs; }
        if (searchStrOrStrArray.length == 0) { return objs; }
        if (typeof anySearchStr != "boolean") { anySearchStr = false; }
        if (typeof caseSensitive != "boolean") { caseSensitive = false; }
        if (typeof propNameStrs == "undefined" || propNameStrs == null) { propNameStrs = []; }
        if (AJS.IsString(propNameStrs)) { propNameStrs = [propNameStrs]; }
        if (!AJS.IsArray(propNameStrs)) { propNameStrs = []; }
        try {
            var matchingObjs = [];
            for (var i = 0; i < objs.length; i++) {
                if (anySearchStr) {
                    if (!AJS.Search.ObjContainsAnyStr(objs[i], searchStrOrStrArray, propNameStrs, caseSensitive, exactMatchOnly)) { continue; }
                } else {
                    if (!AJS.Search.ObjContainsAllStrs(objs[i], searchStrOrStrArray, propNameStrs, caseSensitive, exactMatchOnly)) { continue; }
                }
                matchingObjs.push(objs[i]);
            }
            return matchingObjs;
        } catch (exc) {
            AJS.LogExc(exc);
        }
        return objs;
    }

    this.ObjContainsAllStrs = function (obj, strOrStrArray, propNameStrs, caseSensitive, exactMatchOnly) {
        if (typeof obj == "undefined" || obj == null) { return false; }
        if (typeof strOrStrArray == "undefined" || strOrStrArray == null) { return false; }
        if (typeof caseSensitive != "boolean") { caseSensitive = false; }
        if (typeof propNameStrs == "undefined" || propNameStrs == null) { propNameStrs = []; }
        if (AJS.IsString(propNameStrs)) { propNameStrs = [propNameStrs]; }
        if (!AJS.IsArray(propNameStrs)) { propNameStrs = []; }
        try {
            if (typeof strOrStrArray == "string") { strOrStrArray = [strOrStrArray]; }
            if (!AJS.IsArray(strOrStrArray)) { return false; }
            for (var i = 0; i < strOrStrArray.length; i++) { if (!this.ObjContainsStr(obj, strOrStrArray[i], propNameStrs, caseSensitive, exactMatchOnly)) { return false; } }
            return true;
        } catch (exc) {
            AJS.LogExc(exc);
        }
        return false;
    };

    this.ObjContainsAnyStr = function (obj, strOrStrArray, propNameStrs, caseSensitive, exactMatchOnly) {
        if (typeof obj == "undefined" || obj == null) { return false; }
        if (typeof strOrStrArray == "undefined" || strOrStrArray == null) { return false; }
        if (typeof caseSensitive != "boolean") { caseSensitive = false; }
        if (typeof propNameStrs == "undefined" || propNameStrs == null) { propNameStrs = []; }
        if (AJS.IsString(propNameStrs)) { propNameStrs = [propNameStrs]; }
        if (!AJS.IsArray(propNameStrs)) { propNameStrs = []; }
        try {
            if (typeof strOrStrArray == "string") { strOrStrArray = [strOrStrArray]; }
            if (!AJS.IsArray(strOrStrArray)) { return false; }
            for (var i = 0; i < strOrStrArray.length; i++) {
                if (this.ObjContainsStr(obj, strOrStrArray[i], propNameStrs, caseSensitive, exactMatchOnly)) { return true; }
            }
        } catch (exc) {
            AJS.LogExc(exc);
        }
        return false;
    };

    this.ObjContainsStr = function (obj, str, propNameStrs, caseSensitive, exactMatchOnly) {
        if (typeof obj == "undefined" || obj == null) { return false; }
        if (typeof str == "undefined" || str == null) { return true; }
        if (typeof str != "string") { str = String(str); }
        if (typeof str != "string") { return false; }
        if (AJS.IsNullOrWhiteSpace(str)) { return true; }
        if (typeof caseSensitive != "boolean") { caseSensitive = false; }
        if (typeof propNameStrs == "undefined" || propNameStrs == null) { propNameStrs = []; }
        if (AJS.IsString(propNameStrs)) { propNameStrs = [propNameStrs]; }
        if (!AJS.IsArray(propNameStrs)) { propNameStrs = []; }
        try {
            for (var propName in obj) {
                if (exactMatchOnly) {
                    if (str == String(obj[propName])) { return true; }
                } else {
                    if (propNameStrs.length > 0 && !propNameStrs.Contains(String(propName))) { continue; }
                    if (String(obj[propName]).Contains(str, caseSensitive)) { return true; }
                }
            }
        } catch (exc) {
            AJS.LogExc(exc);
        }
        return false;
    };

}

/********************************************************************************************************/

function AwesomeSortHelper() {

    this.SortPropName = "";
    this.SortOrder = "";

    this.SortObjects = function (objArray, sortPropName, sortOrder) {
        try {
            if (typeof objArray == "undefined") { return; }
            if (objArray == null) { return; }
            if (!AJS.IsArray(objArray)) { return; }
            if (objArray.length == 0) { return; }
            /*** end objArray validation ***/

            if (typeof sortPropName != "undefined" && !AJS.IsNullOrWhiteSpace(sortPropName) && typeof objArray[0][sortPropName] != "undefined") {
                AJS.Sort.SortPropName = String(sortPropName);
            } else {
                AJS.Sort.SortPropName = AJS.GetFirstPropName(objArray[0]); /* default to first object property name */
            }

            if (typeof sortOrder == "undefined" || AJS.IsNullOrWhiteSpace(sortOrder)) { sortOrder = "asc"; }
            else { sortOrder = sortOrder; }
            sortOrder = sortOrder.toLowerCase();
            if (sortOrder == "ascending") { sortOrder = "asc"; }
            else if (sortOrder == "descending") { sortOrder = "desc"; }
            if (sortOrder != "asc" && sortOrder != "desc") { sortOrder = "asc"; }
            AJS.Sort.SortOrder = sortOrder;

            if (AJS.IsNumber(objArray[0][AJS.Sort.SortPropName])) { objArray.sort(AwesomeJs_SortCompareHelper_NumberProperty); }
            else if (AJS.IsString(objArray[0][AJS.Sort.SortPropName])) { objArray.sort(AwesomeJs_SortCompareHelper_StringProperty); }
            else if (AJS.IsDate(objArray[0][AJS.Sort.SortPropName])) { objArray.sort(AwesomeJs_SortCompareHelper_DateProperty); }
            else { objArray.sort(); }
        }
        catch (exc) { AJS.LogExc(exc); }
    }

    this.GetSortOrder = function (sortOrder) {
        try {
            if (typeof sortOrder == "undefined" || sortOrder == null) { return "asc"; }
            if (sortOrder == "asc") { return "desc"; }
        }
        catch (exc) { this.LogExc(exc); }
        return "asc";
    }

    this.ValidateSortOrder = function (sortOrder) {
        try {
            if (typeof sortOrder != "string" || AJS.IsNullOrWhiteSpace(sortOrder)) { return "asc"; }
            sortOrder = sortOrder.toLowerCase();
            if (sortOrder == "asc" || sortOrder == "desc") { return sortOrder; }
        }
        catch (exc) { this.LogExc(exc); }
        return "asc";
    }

    /*** string arrays ***/

    this.SortStringsByLength = function (strArray, sortOrder) {
        try {
            if (typeof strArray == "undefined") { AJS.LogExc("AJS.SortStringsByLength() - typeof strArray == \"undefined\""); return; }
            if (strArray == null) { AJS.LogExc("AJS.SortStringsByLength() - strArray == null"); return; }
            if (!AJS.IsArray(strArray)) { AJS.LogExc("AJS.SortStringsByLength() - !AJS.IsArray(strArray)"); }
            if (strArray.length == 0) { return; }
            if (typeof strArray[0] != "string") { AJS.LogExc("AJS.SortStringsByLength() - typeof strArray[0] != \"string\""); return; }
            /*** end strArray validation ***/
            if (typeof sortOrder == "undefined") { sortOrder = "asc"; }
            else { sortOrder = this.ValidateSortOrder(sortOrder); }
            if (sortOrder == "asc") { strArray.sort(AwesomeJs_SortCompareHelper_StringArrays_LengthAsc); }
            else { strArray.sort(AwesomeJs_SortCompareHelper_StringArrays_LengthDesc); }
        }
        catch (exc) { AJS.LogExc(exc); }
        return "asc";
    };

}

/*** compare functions - global for convenience ***/

/*** Based on compare function from => http://www.webdotdev.com/nvd/content/view/878/ ***/
function AwesomeJs_SortCompareHelper_NumberProperty(a, b) {
    try {
        var returnComparisonValue = 0;
        returnComparisonValue = Number(a[AJS.Sort.SortPropName]) - Number(b[AJS.Sort.SortPropName]);
        if (AJS.Sort.SortOrder != "asc") { returnComparisonValue = returnComparisonValue * (-1); }
        return returnComparisonValue;
    } catch (exc) { AJS.LogExc(exc); }
    return 0;
}

function AwesomeJs_SortCompareHelper_StringProperty(a, b) {
    try {
        var aText = String(a[AJS.Sort.SortPropName]).toLowerCase().Trim();
        var bText = String(b[AJS.Sort.SortPropName]).toLowerCase().Trim();
        var returnComparisonValue = 0;
        if (aText < bText) { returnComparisonValue = -1; }
        else if (aText > bText) { returnComparisonValue = 1; }
        if (AJS.Sort.SortOrder != "asc") { returnComparisonValue = returnComparisonValue * (-1); }
        return returnComparisonValue;
    } catch (exc) { AJS.LogExc(exc); }
    return 0;
}

function AwesomeJs_SortCompareHelper_DateProperty(a, b) {
    try {
        var returnComparisonValue = 0;
        returnComparisonValue = a[AJS.Sort.SortPropName] - b[AJS.Sort.SortPropName];
        if (AJS.Sort.SortOrder != "asc") { returnComparisonValue = returnComparisonValue * (-1); }
        return returnComparisonValue;
    } catch (exc) { AJS.LogExc(exc); }
    return 0;
}

/*** http://www.elated.com/articles/sorting-javascript-arrays/ ***/
function AwesomeJs_SortCompareHelper_StringArrays_LengthAsc(a, b) {
    try {
        if (a.length < b.length) { return -1; }
        if (a.length > b.length) { return 1; }
    } catch (exc) { AJS.LogExc(exc); }
    return 0;
}

function AwesomeJs_SortCompareHelper_StringArrays_LengthDesc(a, b) {
    try {
        if (a.length < b.length) { return 1; }
        if (a.length > b.length) { return -1; }
    } catch (exc) { AJS.LogExc(exc); }
    return 0;
}


/********************************************************************************************************/


/*** extend jQuery - important for prototype function definitions ***/

$.extend(AJS);


/********************************************************************************************************/


$(document).ready(function () {

    $("head").prepend($("<style></style>").attr("type", "text/css").html("#AwesomeLoadingDiv { height:80px; color:#aaa; margin:20px 0px; padding-top:50px; text-align:center; background: transparent url('http://awesomejavascript.org/Content/Images/Loading.gif') no-repeat center top; }"));

});

function AwesomeHtmlHelper() {

    this.Tags = new AwesomeHtmlTagSet();

    this.GetLoadingDiv = function (loadingDivId) {
        try {
            if (typeof loadingDivId != "string" || AJS.IsNullOrWhiteSpace(loadingDivId)) {
                loadingDivId = "AwesomeLoadingDiv";
            }
            return "<div id=\"" + loadingDivId + "\">Loading</div>";
        } catch (exc) { AJS.LogExc(exc); }
        return "Loading";
    }

    this.Select = new AwesomeHtmlHelper_SelectInput();

    this.TextInput = new AwesomeTextInputHelper();

    this.AwesomeHtmlTagSet = AwesomeHtmlTagSet;

}


function AwesomeHtmlTagSet(recognizedHtmlElementStrOrStrArray) {

    this.OpenTags = [];
    this.OpenTagsEncoded = [];
    this.CloseTags = [];
    this.CloseTagsEncoded = [];

    this.recognizedHtmlElements = [];

    if (typeof recognizedHtmlElementStrOrStrArray == "undefined" || recognizedHtmlElementStrOrStrArray == null) {
        this.recognizedHtmlElements = ajsValidHtmlTags;
    } else {
        //        alert("typeof recognizedHtmlElementStrOrStrArray = " + typeof recognizedHtmlElementStrOrStrArray);
        //        alert("this.recognizedHtmlElements = " + typeof this.recognizedHtmlElements);
        //        alert(recognizedHtmlElementStrOrStrArray)
        if (typeof recognizedHtmlElementStrOrStrArray == "string") {
            this.recognizedHtmlElements.push(recognizedHtmlElementStrOrStrArray);
        } else if (AJS.IsArray(recognizedHtmlElementStrOrStrArray)) {
            this.recognizedHtmlElements = recognizedHtmlElementStrOrStrArray;
        }
    }

    for (var i = 0; i < this.recognizedHtmlElements.length; i++) {
        var htmlElemStr = this.recognizedHtmlElements[i];
        if (typeof htmlElemStr == "undefined" || htmlElemStr == null) { continue; }
        if (typeof htmlElemStr != "string") { try { htmlElemStr = String(htmlElemStr); } catch (recognizedHtmlElementStrOrStrArraytringConvertExc) { } }
        if (typeof htmlElemStr != "string" || htmlElemStr.IsWhiteSpace() || htmlElemStr == "null") { continue; }

        htmlElemStr = htmlElemStr.toLowerCase().Trim();
        htmlElemStr = String(htmlElemStr.ReadUntil(" "));
        htmlElemStr = String(htmlElemStr).RemoveAll("<").RemoveAll(">");
        htmlElemStr = String(htmlElemStr).RemoveAll("&lt;").RemoveAll("&gt;");

        this.OpenTags.push("<" + htmlElemStr + ">");
        this.OpenTags.push("<" + htmlElemStr + " ");
        this.OpenTagsEncoded.push("&lt;" + htmlElemStr + "&gt;");
        this.OpenTagsEncoded.push("&lt;" + htmlElemStr + " ");
        this.CloseTags.push("</" + htmlElemStr + ">");
        this.CloseTagsEncoded.push("&lt;/" + htmlElemStr + "&gt;");
    }
}

function AwesomeHtmlHelper_SelectInput() {

    this.GetPageSelectDiv = function (numPages, currentPage, onchangeFunctionName, divId) {
        var pageSelectHtml = this.GetPageSelectInput(numPages, currentPage, onchangeFunctionName);
        if (typeof pageSelectHtml == "undefined" || AJS.IsNullOrWhiteSpace(pageSelectHtml)) { return ""; }
        if (typeof divId == "undefined" || divId == null || AJS.IsNullOrWhiteSpace(divId)) { divId = "PageSelectDiv"; }
        return "<div id=\"" + divId + "\">Page:&nbsp;" + pageSelectHtml + "</div>";
    }

    this.GetPageSelectInput = function (numPages, currentPage, onchangeFunctionName) {
        if (typeof numPages == "undefined" || numPages == null) { return ""; }
        if (!AJS.IsNumber(numPages)) { numPages = Number(numPages); }
        if (!AJS.IsNumber(numPages)) { return ""; }
        if (numPages <= 1) { return ""; }
        if (typeof currentPage == "undefined" || currentPage == null) { currentPage = 1; }
        if (!AJS.IsNumber(currentPage)) { numPages = Number(currentPage); }
        if (!AJS.IsNumber(currentPage)) { return ""; }
        if (currentPage < 1) { currentPage == 1; }
        else if (currentPage > numPages) { currentPage = numPages; }
        if (typeof onchangeFunctionName == "undefined" || onchangeFunctionName == null || AJS.IsNullOrWhiteSpace(onchangeFunctionName)) { onchangeFunctionName = "PageChange"; }
        var pageSelectHtml = "<select onchange=\"" + onchangeFunctionName + "(this)\">";
        for (var j = 1; j <= numPages; j++) {
            pageSelectHtml += "<option value=\"" + String(j) + "\""
            if (j == currentPage) { pageSelectHtml += " selected=\"true\""; }
            pageSelectHtml += ">" + String(j) + "</option>";
        }
        pageSelectHtml += "</select>";
        return pageSelectHtml;
    }
}

function AwesomeTextInputHelper() {

    this.EnforceNumbersOnly = function (e, allowDecimal) {
        if (typeof allowDecimal != "boolean") { allowDecimal = true; }
        try {
            var sAllowed = "0123456789.v";
            if (!allowDecimal) { sAllowed = sAllowed.replace(".", ""); }

            var key;
            if (window.event) { key = window.event.keyCode; }
            else if (e) { key = e.which; }
            else { return true; }

            var keychar = String.fromCharCode(key); // alert(keychar); //if ((key==null) || (key=='.') || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) ) return true; // control keys            
            if (key == 8) { return true }; // backspace
            if (key == 0) { return true }; // arrows
            if ((sAllowed).indexOf(keychar) > -1) { return true; }
            return false;
        } catch (exc) { $.LogExc(exc); }
        return true;
    };

    this.EnforceMaxLength = function (textInputElement, event, maxLength) {
        try {
            var key;
            if (window.event) { key = window.event.keyCode; }
            else if (event) { key = event.which; }
            else { return true; }
            if (key == 8) { return true }; // backspace
            if (key == 0) { return true }; // arrows
            if (textInputElement.value.length == Number(maxLength)) { return false; }
        } catch (exc) { }
        return true;
    };

    this.ToUpperCase = function (textInputElement) {
        try {
            if (typeof textInputElement == "undefined" || textInputElement == null) { return; }
            if (textInputElement.value) { textInputElement.value = textInputElement.value.toUpperCase(); }
        } catch (exc) { $.LogExc(exc); }
        return true;
    }

    this.RemoveNonNumeric = function (textInputElement) {
        try {
            if (typeof textInputElement == "undefined" || textInputElement == null) { return; }
            if (textInputElement.value) { textInputElement.value = textInputElement.value.RemoveAllWhiteSpace().replace("V", "").replace("v", ""); }
        } catch (exc) { $.LogExc(exc); }
        return true;
    }

}



/*** 3rd party code ***/

//JSON.stringify = JSON.stringify || function (obj) { // source => http://stackoverflow.com/questions/3593046/jquery-json-to-string
//    var t = typeof (obj);
//    if (t != "object" || obj === null) {
//        // simple data type
//        if (t == "string") obj = '"' + obj + '"';
//        return String(obj);
//    }
//    else {
//        // recurse array or object
//        var n, v, json = [], arr = (obj && obj.constructor == Array);
//        for (n in obj) {
//            v = obj[n]; t = typeof (v);
//            if (t == "string") v = '"' + v + '"';
//            else if (t == "object" && v !== null) v = JSON.stringify(v);
//            json.push((arr ? "" : '"' + n + '":') + String(v));
//        }
//        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
//    }
//};

/*** end 3rd party code ***/



/*** prototype additions ***/
/********************************************************************************************************/
/*** Array Prototype Functions ***/

Array.prototype.Contains = Array.prototype.contains = function (o, onErrorReturnValue) {

    if (typeof onErrorReturnValue != "boolean") { onErrorReturnValue = false; }
    try {
        if (typeof o == "undefined") { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc("Array.Contains() - typeof o == \"undefined\""); } return onErrorReturnValue; }
        if (typeof jQuery == "object" && typeof jQuery.inArray == "function") { return jQuery.inArray(o, this); }
        for (var i = 0; i < this.length; i++) { if (this[i] == o) { return true; } }
        return false;
    } catch (exc) { if (typeof AJS == "object" && typeof AJS.LogExc == "function") { AJS.LogExc(exc); } }
    return onErrorReturnValue;
};

Array.prototype.Remove = Array.prototype.remove = function (obj) {
    if (typeof obj == "undefined") { return; }
    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            this.RemoveIndex(i);
            return;
        }
    }
}

// 
/***
Array Remove - By John Resig (MIT Licensed) - http://ejohn.org/blog/javascript-array-remove/
array.removeByIndex(1); // Remove the second item from the array
array.removeByIndex(-2); // Remove the second-to-last item from the array
array.removeByIndex(1, 2); // Remove the second and third items from the array
array.removeByIndex(-2, -1); // Remove the last and second-to-last items from the array
***/
Array.prototype.RemoveIndex = Array.prototype.removeByIndex = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

/*** end Array Prototype Functions ***/

/*** end prototype additions ***/

if (typeof DoNothing == "undefined") { DoNothing = function () { } }
