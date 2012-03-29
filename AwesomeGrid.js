/**************************************************************************************************
*** AwesomeGrid jQuery Plugin
*** by Mark McLaughlin
**************************************************************************************************/

function AwesomeGridOptions(parameters) {

    if (typeof parameters == "undefined" || parameters == null) { parameters = {}; }

    this.columnDefinitions = null;

    this.tableId = "AwesomeGridTable";

    this.debugMode = true;

    this.gridTitle = null;

    this.sortPropertyName = null;
    this.sortOrder = "asc";

    this.edit = false;

    this.searchInputId = null;

    this.searchIsCaseSensitive = false;

    this.searchText = "Search:";
    this.resultCountText = "Result Count:";
    this.pageBackText = "Back";
    this.pageNextText = "Next";
    this.errorMessage = "An error occurred while processing your request";

    this.cellpadding = 5;

    this.showTitle = true;
    this.showSearchInput = true;
    this.showFooter = true;
    this.showFooterSortLinks = false;
    this.showPageDropDown = true;
    this.showPageDropDownBottom = false;
    this.showPageLinks = true;
    this.showPageLinksBottom = true;
    this.showResultCount = true;
    this.showResultCountBottom = false;

    this.defaultStylesStr = "\n"
        + "#AwesomeGridTableTopDiv { margin:0; padding:0; position: relative; }\n"
        + "#AwesomeGridTableTopSpacerDiv { margin:0; padding:0; clear:both; height:3px; font-size:1px; }\n"
        + "#AwesomeGridTableBottomSpacerDiv { margin:0; padding:0; clear:both; height:3px; font-size:1px; }\n"
        + "#AwesomeGridTableTitleDiv { margin:0; padding:0; font-weight:bold; font-size:18px; position:relative; top:3px; }\n"
        + "#AwesomeGridTableSearchInputDiv { margin:0px 5px 0px 50px; position:relative; top:4px; }\n"
        + "#AwesomeGridTableSearchInput { width:80px; margin:0; padding:0;  }\n"
        + "#AwesomeGridTableResultCountDiv { margin:0px 5px; padding:0; position:relative; top:5px; }\n"
        + "#AwesomeGridTablePageSelectDiv { margin:0px 5px; padding:0; }\n"
        + "#AwesomeGridTablePageSelectDiv div { margin:0; padding:0; }\n"
        + "#AwesomeGridTablePageSelectBottomDiv { margin:0px 5px; padding:0; }\n"
        + "#AwesomeGridTablePageLinksDiv { margin:0px 5px; padding:0; position:relative; top:3px; }\n"
        + "#AwesomeGridTablePageLinksDiv a { color:#000; }\n"
        + "#AwesomeGridTablePageLinksBottomDiv { margin:0px 5px; padding:0; }\n"
        + "#AwesomeGridTablePageLinksBottomDiv a { color:#000; }\n"
        + "#AwesomeGridTableDiv { margin:5px 0px 3px 0px; padding:0; border:1px solid #000; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; }\n"
        + "#AwesomeGridTable { margin:0; padding:0; width:100%; }\n"
        + "#AwesomeGridTable th { background-color:#000; color:#fff; font-weight:bold; font-size:1.2em; }\n"
        + "#AwesomeGridTable th.NoContentFooter { background-color:#000; font-weight:normal; height:1px; font-size:1px; padding:0px; }\n"
        + "#AwesomeGridTable th a { color:#fff; }\n"
        + "#AwesomeGridTable td.alt { background-color:#e1e1e1; }\n"
        + "#AwesomeGridTableErrorDiv { color:#f00; margin:20px; }\n"
        + "#AwesomeGridTableNoResultsDiv { margin:20px; }\n"
        + "#AwesomeGridEditTableTd { position:absolute; left:0px; }\n"
        + "#AwesomeGridEditTableDiv { position:relative; left:50px; top:-70px; background-color:#fff; padding:1px; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px;  }\n" // background:#fff; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px;
        + "#AwesomeGridEditTableInnerDiv { background-color:#000; padding:1px; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; }\n"
        + "#AwesomeGridEditTable {  }\n"
        + "#AwesomeGridEditTable th { background-color:#000; font-weight:bold; font-size:1.2em; }\n"
        + "#AwesomeGridEditTable td { background-color:#fff;  }\n"
        + "#AwesomeGridEditTable td.left {  }\n"
        + "#AwesomeGridEditTable td.right {  }\n"
        + "#AwesomeGridEditTable td.bottomLeft {  border-radius: 0px 0px 0px 4px; -webkit-border-radius: 0px 0px 0px 4px; -moz-border-radius: 0px 0px 0px 4px; }\n"
        + "#AwesomeGridEditTable td.bottomRight {  border-radius: 0px 0px 4px 0px; -webkit-border-radius: 0px 0px 4px 0px; -moz-border-radius: 0px 0px 4px 0px; }\n"
        + "#AwesomeGridEditTable th.left { border-radius: 4px 0px 0px 0px; -webkit-border-radius: 4px 0px 0px 0px; -moz-border-radius: 4px 0px 0px 0px; }\n"
        + "#AwesomeGridEditTable th.right { border-radius: 0px 4px 0px 0px; -webkit-border-radius: 0px 4px 0px 0px; -moz-border-radius: 0px 4px 0px 0px; }\n"
        + "#AwesomeGridEditTable td.PropName { text-align:right; padding-left:30px; padding-right:5px; font-weight:bold; font-size:1.2em; }\n"
        + "#AwesomeGridDebugDiv { margin:20px 0px; padding:15px; border:solid 1px #000; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; }\n"
        + "#AwesomeGridDebugDiv div { margin:0px 0px 10px 0px; }\n"
        + "\n";

    this.NumColumns = function () {
        if (this.columnDefinitions == null) { return 0; }
        if (!$.IsArray(this.columnDefinitions)) {
            // alert(this.columnDefinitions instanceof Array)
            // $.LogObj($.IsArray);
            // $.LogStr("AwesomeGrid.js - NumColumns() - columnDefinitions is defined but $.IsArray(this.columnDefinitions) returned false");
            return 0;
        }
        return Number(this.columnDefinitions.length);
    };

    $.extend(this, parameters);
}

function AwesomeGridColumnDefintion(propertyName, sortPropertyName, headerText, defaultValue, headerStyle) {

    if (typeof propertyName != "string" || propertyName == null) { return; }

    this.propertyName = propertyName;

    this.sortPropertyName = "";
    if (typeof sortPropertyName != "string" || sortPropertyName == null) { this.sortPropertyName = propertyName; } else { this.sortPropertyName = propertyName; }

    this.headerText = "";
    if (typeof headerText != "string" || headerText == null) { this.headerText = propertyName; } else { this.sortPropertyName = propertyName; }

    this.defaltValue = "";
    if (typeof defaultValue == "string" && defaultValue != null) { this.defaltValue = defaultValue; }

    this.headerStyle = "";
    if (typeof headerStyle == "string" && headerStyle != null) { this.headerStyle = headerStyle; }
}

/**************************************************************************************************/

jQuery.fn.AwesomeGrid = function (jsVariableName, awesomeGridObjs, awesomeGridOptions) {
    var newAwesomeGrid = new AwesomeGrid(jsVariableName, awesomeGridObjs, awesomeGridOptions);
    newAwesomeGrid.containerElement = this[0];
    return newAwesomeGrid;
}

/**************************************************************************************************/

function AwesomeGrid(jsVariableName, awesomeGridObjs, awesomeGridOptions) {

    if (typeof awesomeGridOptions == "undefined" || awesomeGridOptions == null) { awesomeGridOptions = new AwesomeGridOptions(); }

    var self = this;

    this.jsVariableName = (typeof jsVariableName != "undefined" && !AJS.IsNullOrWhiteSpace(jsVariableName)) ? jsVariableName : null;

    this.gridObjs = awesomeGridObjs;
    this.gridObjInfo = null;

    this.containerElement = null;

    if (awesomeGridOptions == "undefined" || awesomeGridOptions == null) { awesomeGridOptions == new AwesomeGridOptions(); }

    this.LoadOptions = function (awesomeGridOptions) {

        this.options = $.extend({}, AwesomeGrid.defaultOptions, awesomeGridOptions || {});

        this.options.searchInputId = (
                                    (this.options.searchInputId != null) ? this.options.searchInputId
                                    : ((typeof $("#SearchWords")[0] == "object" && typeof $("#SearchWords")[0].value == "string") ? "SearchWords"
                                    : null
                                    ));

        this.options.pageLength = Number(this.options.pageLength || 20);
    }

    this.LoadOptions(awesomeGridOptions);

    this.pageNum = 1;

    this.gridHtml = "";
    this.tableRows = "";

    this.TableExists = function () { return Boolean(document.getElementById(this.options.tableId) != null); }
    this.ContainerExists = function () { return Boolean(this.containerElement != null); }
    this.GridObjTotal = function () { return Number((this.gridObjs || []).length); }

    this.TopDivId = function () { return this.options.tableId + "TopDiv"; };
    this.TopSpacerDivId = function () { return this.options.tableId + "TopSpacerDiv"; };
    this.BottomDivId = function () { return this.options.tableId + "BottomDiv"; };
    this.BottomSpacerDivId = function () { return this.options.tableId + "BottomSpacerDiv"; };
    this.TitleDivId = function () { return this.options.tableId + "TitleDiv"; };
    this.SearchInputDivId = function () { return this.options.tableId + "SearchInputDiv"; };
    this.OrganicSearchInputId = function () { return this.options.tableId + "SearchInput"; };
    this.PageLinksDivId = function () { return this.options.tableId + "PageLinksDiv"; };
    this.PageLinksBottomDivId = function () { return this.options.tableId + "PageLinksBottomDiv"; };
    this.PageSelectDivId = function () { return this.options.tableId + "PageSelectDiv"; };
    this.PageSelectBottomDivId = function () { return this.options.tableId + "PageSelectBottomDiv"; };
    this.ResultCountDivId = function () { return this.options.tableId + "ResultCountDiv"; };
    this.ResultCountBottomDivId = function () { return this.options.tableId + "ResultCountBottomDiv"; };
    this.ErrorDivId = function () { return this.options.tableId + "ErrorDiv"; };
    this.NoResultsDivId = function () { return this.options.tableId + "NoResultsDiv"; };

    this.Update = function (awesomeGridObjs, awesomeGridOptions) {
        try {
            if (typeof awesomeGridObjs != "undefined" && awesomeGridObjs != null && typeof awesomeGridObjs.length == "number") {
                this.gridObjs = awesomeGridObjs;
            }
            if (typeof awesomeGridOptions != "undefined" && awesomeGridOptions != null && typeof awesomeGridOptions.length == "number") {
                this.options = $.extend(this.options, awesomeGridOptions);
            }
            this.InsertGrid();
        } catch (exc) {
            AJS.LogExc(exc);
        }
    }

    this.InsertGrid = function (animate) {
        try {
            if (typeof animate != "boolean") { animate = true; }
            /*** check state of required AwesomeGrid properties ***/
            if (typeof this.gridObjs == "undefined") { this.SetNoResults("AwesomeGrid - ERROR - InsertGrid() - this.gridObjs must be defined before you get here dude"); return; }
            var objs = this.gridObjs;
            if (objs.length == 0) { this.SetNoResults("AwesomeGrid - WARNING - this.gridObjs.length == 0"); return; }

            if (this.gridObjInfo == null) {
                this.gridObjInfo = $.GetObjectInfo(this.gridObjs);
                if ($.IsNullOrWhiteSpace(this.options.gridTitle) && !$.IsNullOrWhiteSpace(this.gridObjInfo.TypeNamePlural())) {
                    this.options.gridTitle = this.gridObjInfo.TypeNamePlural();
                }
            }

            if (this.options.columnDefinitions == null) {
                this.GenerateColumnDefinitions();
            }

            if (typeof this.options.sortPropertyName == "undefined" || AJS.IsNullOrWhiteSpace(this.options.sortPropertyName)) {
                for (var columnDefinitionIndex = 0; columnDefinitionIndex < this.options.columnDefinitions.length; columnDefinitionIndex++) {
                    if (this.options.columnDefinitions[columnDefinitionIndex].sortPropertyName != "undefined" && !AJS.IsNullOrWhiteSpace(this.options.columnDefinitions[columnDefinitionIndex].sortPropertyName)) {
                        this.options.sortPropertyName = this.options.columnDefinitions[columnDefinitionIndex].sortPropertyName;
                        this.options.sortOrder = "asc";
                        break;
                    }
                }
            }
            /*** end check state of required AwesomeGrid properties ***/

            /*** search  ***/
            var searchWords = [];
            if (this.options.searchInputId != null && !AJS.IsNullOrWhiteSpace(this.options.searchInputId) && $("#" + this.options.searchInputId).val().Trim() != "") {
                searchWords = $("#" + this.options.searchInputId).val().Trim().split(" ");
            }
            if (this.options.showSearchInput) {
                var organicSearchWords = [];
                if (document.getElementById(this.OrganicSearchInputId()) != null) {
                    if (typeof document.getElementById(this.OrganicSearchInputId()).value == "string" && typeof document.getElementById(this.OrganicSearchInputId()).value != "undefined"
                        && !AJS.IsNullOrWhiteSpace(document.getElementById(this.OrganicSearchInputId()).value.Trim())) {
                        organicSearchWords = document.getElementById(this.OrganicSearchInputId()).value.Trim().split(" ");
                    }
                    for (var organicSearchWordIndex = 0; organicSearchWordIndex <= organicSearchWords.length; organicSearchWordIndex++) { searchWords.push(organicSearchWords[organicSearchWordIndex]); }
                }
            }

            if (searchWords.length > 0) {
                objs = $.SearchObjects(objs, searchWords); // false, this.options.searchIsCaseSensitive
                if (objs.length == 0) { this.SetNoResults("AwesomeGrid - WARNING - filteredObjs.length == 0"); return; }
            }

            /*** sort ***/
            if (!AJS.IsNullOrWhiteSpace(this.options.sortPropertyName)) { AJS.Sort.SortObjects(objs, this.options.sortPropertyName, this.options.sortOrder || "asc"); }

            /*** paging variables ***/
            var resultCount = (typeof objs.length == "undefined" || objs.length == null) ? 0 : Number(objs.length);
            if (resultCount == 0) { this.SetNoResults("AwesomeGrid - ERROR - resultCount == 0 but obj array length was defined and not equal to 0?!?!?!?!"); return; }
            var numPages = Number(Math.ceil(resultCount / this.options.pageLength));
            if (this.pageNum > numPages) { this.pageNum = numPages; }
            var startIndex = this.options.pageLength * (this.pageNum - 1);
            var endIndex = (startIndex + this.options.pageLength > resultCount - 1) ? (resultCount - 1) : (startIndex + this.options.pageLength - 1);
            var pageObjs = [];
            for (var pageIndex = startIndex; pageIndex <= endIndex; pageIndex++) {
                var obj = objs[pageIndex];
                if (obj == null) { document.body.appendChild(document.createTextNode("<span style=\"display:none;\">AwesomeGrid - ERROR - found null obj in array while creating pageObjs array</span>")); }
                else { pageObjs.push(obj); }
            }
            if (Number(pageObjs.length) == 0) { this.SetNoResults("<span style=\"display:none;\">ERROR - AwesomeGrid - Number(pageObjs.length) == 0 !?!</span>"); return; }

            /*** search input Html ***/
            var searchInputDivContent = "";
            if (this.options.showSearchInput) {
                searchInputDivContent = "<span>" + this.options.searchText + "</span>"
                    + "<input type=\"text\" id=\"" + this.OrganicSearchInputId() + "\" value=\"\" "
                    + "onkeyup=\"" + this.jsVariableName + ".InsertGrid(false)\" onfocus=\"this.value = this.value;\" style=\"margin-left:5px;\" />";
            }

            /*** page select and links Html ***/
            var pageSelectDivContent = "";
            var pageLinksDivContent = "";
            if (numPages > 1) {
                if (this.options.showPageLinks || this.options.showPageLinksBottom) { pageSelectDivContent = AJS.Html.Select.GetPageSelectDiv(numPages, this.pageNum, this.jsVariableName + ".PageChange", this.jsVariableName + "PageDiv").Trim(); }
                if (this.options.showPageLinks || this.options.showPageLinksBottom) {
                    if (this.pageNum > 1) { pageLinksDivContent += "<a style=\"margin-left:5px;\" href=\"javascript:void(" + this.jsVariableName + ".PageChange(" + String(this.pageNum - 1) + "))\">" + this.options.pageBackText + "</a>"; }
                    if (this.pageNum + 1 <= numPages) { pageLinksDivContent += "<a style=\"margin-left:5px;\" href=\"javascript:void(" + this.jsVariableName + ".PageChange(" + String(this.pageNum + 1) + "))\">" + this.options.pageNextText + "</a>"; }
                }
            }

            /*** results count Html ***/
            var resultCountDivContents = "";
            if (this.options.showResultCount || this.options.showResultCountBottom) {
                resultCountDivContents = "<span>" + this.options.resultCountText + "</span>"
                    + "<span style=\"margin-left:5px;\">" + String(resultCount) + "</span>";
            }

            /*** table rows Html ***/
            this.tableRows = "<tr>";
            $.each(this.options.columnDefinitions, this.writeHeaderTd); /*** header <th> elements ***/
            if (this.options.edit) { this.tableRows += "<th>Edit</th>"; }
            this.tableRows += "</tr>";
            $.each(pageObjs, this.writeGridRow); /*** write rows ***/
            if (this.options.showFooter) {
                if (this.options.showFooterSortLinks) {
                    this.tableRows += "<tr>";
                    $.each(this.options.columnDefinitions, this.writeHeaderTd); /*** footer <th> elements ***/
                    if (this.options.edit) { this.tableRows += "<th></th>"; }
                    this.tableRows += "</tr>";
                } else {
                    this.tableRows += "<tr>";
                    for (var footerIndex = 0; footerIndex < this.options.columnDefinitions.length; footerIndex++) { this.tableRows += "<th class=\"NoContentFooter\">&nbsp;</th>"; }
                    if (this.options.edit) { this.tableRows += "<th></th>"; }
                    this.tableRows += "</tr>";
                }
            }

            /*** display ***/
            var displayTitle = (this.options.showTitle && !AJS.IsNullOrWhiteSpace(this.options.gridTitle));
            var displayPageLinks = (this.options.showPageLinks && !AJS.IsNullOrWhiteSpace(pageLinksDivContent));
            var displayPageLinksBottom = (this.options.showPageLinksBottom && !AJS.IsNullOrWhiteSpace(pageLinksDivContent));
            var displayPageSelect = (this.options.showPageDropDown && !AJS.IsNullOrWhiteSpace(pageSelectDivContent));
            var displayPageSelectBottom = (this.options.showPageDropDownBottom && !AJS.IsNullOrWhiteSpace(pageSelectDivContent));
            var displayResultCount = (this.options.showResultCount && !AJS.IsNullOrWhiteSpace(resultCountDivContents));
            var displayResultCountBottom = (this.options.showResultCountBottom && !AJS.IsNullOrWhiteSpace(resultCountDivContents));

            var displayTopDiv = (displayTitle || this.options.showSearchInput || displayPageSelect || displayPageLinks || displayResultCount);
            var displayBottomDiv = (displayPageSelectBottom || displayPageLinksBottom || displayResultCountBottom);

            if (document.getElementById(this.options.tableId) == null) { /*** insert ***/

                if (this.options.tableId == "AwesomeGridTable" && document.getElementById("AwesomeGridDefaultStyles") == null) { this.AddDefaultStyles(); }

                this.gridHtml = "";

                /*** top div ***/
                this.gridHtml += "<div id=\"" + this.TopDivId() + "\" style=\"" + (displayTopDiv ? "" : "display:none;") + "\">";
                this.gridHtml += "<div id=\"" + this.TitleDivId() + "\" style=\"float:left;" + (displayTitle ? "" : "display:none;") + "\">" + this.options.gridTitle + "</div>";
                this.gridHtml += "<div id=\"" + this.SearchInputDivId() + "\" style=\"float:left;" + (this.options.showSearchInput ? "" : "display:none;") + "\">";
                if (this.options.showSearchInput) { this.gridHtml += searchInputDivContent; }
                this.gridHtml += "</div>";
                this.gridHtml += "<div id=\"" + this.ResultCountDivId() + "\" style=\"float:left;" + (displayResultCount ? "" : "display:none;") + "\">" + resultCountDivContents + "</div>";
                this.gridHtml += "<div id=\"" + this.PageLinksDivId() + "\" style=\"float:right;" + (displayPageLinks ? "" : "display:none;") + "\">" + pageLinksDivContent + "</div>";
                this.gridHtml += "<div id=\"" + this.PageSelectDivId() + "\" style=\"float:right;" + (displayPageSelect ? "" : "display:none;") + "\">" + pageSelectDivContent + "</div>";
                this.gridHtml += "</div>";
                this.gridHtml += "<div id=\"" + this.TopSpacerDivId() + "\" style=\"" + (displayTopDiv ? "" : "display:none;") + "\">&nbsp;</div>";

                /*** table ***/
                this.gridHtml += "<div id=\"AwesomeGridTableDiv\">";
                this.gridHtml += "<table id=\"" + this.options.tableId + "\" cellpadding=\"" + String(this.options.cellpadding) + "\" cellspacing=\"0\">" + this.tableRows + "</table>";
                this.gridHtml += "</div>";

                /*** bottom div ***/
                this.gridHtml += "<div id=\"" + this.BottomSpacerDivId() + "\" style=\"" + (displayBottomDiv ? "" : "display:none;") + "\">&nbsp;</div>";
                this.gridHtml += "<div id=\"" + this.BottomDivId() + "\" style=\"" + (displayBottomDiv ? "" : "display:none;") + "\">";
                this.gridHtml += "<div id=\"" + this.ResultCountBottomDivId() + "\" style=\"float:left;" + (displayResultCountBottom ? "" : "display:none;") + "\">" + resultCountDivContents + "</div>";
                this.gridHtml += "<div id=\"" + this.PageLinksBottomDivId() + "\" style=\"float:right;" + (displayPageLinksBottom ? "" : "display:none;") + "\">" + pageLinksDivContent + "</div>";
                this.gridHtml += "<div id=\"" + this.PageSelectBottomDivId() + "\" style=\"float:right;" + (displayPageSelectBottom ? "" : "display:none;") + "\">" + pageSelectDivContent + "</div>";
                this.gridHtml += "</div>";
                this.gridHtml += "<div id=\"" + this.BottomSpacerDivId() + "\" style=\"" + (displayBottomDiv ? "" : "display:none;") + "\">&nbsp;</div>";

                if (this.options.debugMode) {
                    this.gridHtml += "<div id=\"AwesomeGridDebugDiv\">";
                    this.gridHtml += "<div style=\"font-weight:bold; font-size:1.2em;\">Awesome Grid Debug Functionality</div>";
                    this.gridHtml += "<div>";
                    this.gridHtml += "<input type=\"button\" value=\"Display Grid Object Info\" onclick=\"" + this.jsVariableName + ".DisplayObjectInfo()\" />";
                    this.gridHtml += "<input type=\"button\" value=\"Display Options\" onclick=\"" + this.jsVariableName + ".DisplayOptions()\" style=\"margin-left:5px;\" />";
                    this.gridHtml += "</div>";
                    this.gridHtml += "<div>";
                    this.gridHtml += "<input type=\"button\" value=\"Show Error Display\" onclick=\"" + this.jsVariableName + ".SetError()\" />";
                    this.gridHtml += "<input type=\"button\" value=\"Show No Results Display\" onclick=\"" + this.jsVariableName + ".SetNoResults()\" style=\"margin-left:5px;\" />";
                    this.gridHtml += "</div>";
                    this.gridHtml += "<div>";
                    this.gridHtml += "<input type=\"button\" value=\"Display Grid\" onclick=\"" + this.jsVariableName + ".Update()\" />";
                    this.gridHtml += "</div>";
                    this.gridHtml += "<div>";
                    this.gridHtml += "<b>js Grid Variable Name:</b> " + this.jsVariableName;
                    this.gridHtml += "</div>";
                    this.gridHtml += "</div>";
                }

                $(this.containerElement).css("display", "none");
                $(this.containerElement).html(this.gridHtml); // *** insert grid ***
                $(this.containerElement).fadeIn(400, function () { });

            } else { /*** Update ***/

                if (this.options.showSearchInput && displayTopDiv) {
                    if (typeof $("#" + this.OrganicSearchInputId()) != "object" && typeof $("#" + this.SearchInputDivId()) == "object") { $("#" + this.SearchInputDivId()).html(searchInputDivContent); }
                    if (typeof $("#" + this.SearchInputDivId()) == "object") { $("#" + this.SearchInputDivId()).css("display", "block"); }
                } else {
                    if (typeof $("#" + this.OrganicSearchInputId()) == "object") { $("#" + this.OrganicSearchInputId()).val(""); }
                    if (typeof $("#" + this.SearchInputDivId()) == "object") { $("#" + this.searchInputDivId()).css("display", "block"); }
                }

                if (displayTopDiv) {
                    if (typeof $("#" + this.TopDivId()) == "object") { $("#" + this.TopDivId()).css("display", "block"); }
                    if (typeof $("#" + this.TopSpacerDivId()) == "object") { $("#" + this.TopSpacerDivId()).css("display", "block"); }
                } else {
                    if (typeof $("#" + this.TopDivId()) == "object") { $("#" + this.TopDivId()).css("display", "none"); }
                    if (typeof $("#" + this.TopSpacerDivId()) == "object") { $("#" + this.TopSpacerDivId()).css("display", "none"); }
                }

                if (displayBottomDiv) {
                    if (typeof $("#" + this.BottomDivId()) == "object") { $("#" + this.BottomDivId()).css("display", "block"); }
                    if (typeof $("#" + this.BottomSpacerDivId()) == "object") { $("#" + this.BottomSpacerDivId()).css("display", "block"); }
                } else {
                    if (typeof $("#" + this.BottomDivId()) == "object") { $("#" + this.BottomDivId()).css("display", "none"); }
                    if (typeof $("#" + this.BottomSpacerDivId()) == "object") { $("#" + this.BottomSpacerDivId()).css("display", "none"); }
                }

                if (displayTitle) { if (typeof $("#" + this.TitleDivId()) == "object") { $("#" + this.TitleDivId()).html(this.options.gridTitle); $("#" + this.TitleDivId()).css("display", "block"); } }
                else { if (typeof $("#" + this.TitleDivId()) == "object") { $("#" + this.TitleDivId()).html(""); $("#" + this.TitleDivId()).css("display", "none"); } }

                if (displayPageLinks) { if (typeof $("#" + this.PageLinksDivId()) == "object") { $("#" + this.PageLinksDivId()).html(pageLinksDivContent); $("#" + this.PageLinksDivId()).css("display", "block"); } }
                else { if (typeof $("#" + this.PageLinksDivId()) == "object") { $("#" + this.PageLinksDivId()).html(""); $("#" + this.PageLinksDivId()).css("display", "none"); } }

                if (displayPageLinksBottom) { if (typeof $("#" + this.PageLinksBottomDivId()) == "object") { $("#" + this.PageLinksBottomDivId()).html(pageLinksDivContent); $("#" + this.PageLinksBottomDivId()).css("display", "block"); } }
                else { if (typeof $("#" + this.PageLinksBottomDivId()) == "object") { $("#" + this.PageLinksBottomDivId()).html(""); $("#" + this.PageLinksBottomDivId()).css("display", "none"); } }

                if (displayPageSelect) { if (typeof $("#" + this.PageSelectDivId()) == "object") { $("#" + this.PageSelectDivId()).html(pageSelectDivContent); $("#" + this.PageSelectDivId()).css("display", "block"); } }
                else { if (typeof $("#" + this.PageSelectDivId()) == "object") { $("#" + this.PageSelectDivId()).html(""); $("#" + this.PageSelectDivId()).css("display", "none"); } }

                if (displayPageSelectBottom) { if (typeof $("#" + this.PageSelectBottomDivId()) == "object") { $("#" + this.PageSelectBottomDivId()).html(pageSelectDivContent); $("#" + this.PageSelectBottomDivId()).css("display", "block"); } }
                else { if (typeof $("#" + this.PageSelectBottomDivId()) == "object") { $("#" + this.PageSelectBottomDivId()).html(""); $("#" + this.PageSelectBottomDivId()).css("display", "none"); } }

                if (displayResultCount) { if (typeof $("#" + this.ResultCountDivId()) == "object") { $("#" + this.ResultCountDivId()).html(resultCountDivContents); $("#" + this.ResultCountDivId()).css("display", "block"); } }
                else { if (typeof $("#" + this.ResultCountDivId()) == "object") { $("#" + this.ResultCountDivId()).html(""); $("#" + this.ResultCountDivId()).css("display", "none"); } }

                if (displayResultCountBottom) { if (typeof $("#" + this.ResultCountBottomDivId()) == "object") { $("#" + this.ResultCountBottomDivId()).html(resultCountDivContents); $("#" + this.ResultCountBottomDivId()).css("display", "block"); } }
                else { if (typeof $("#" + this.ResultCountBottomDivId()) == "object") { $("#" + this.ResultCountBottomDivId()).html(""); $("#" + this.ResultCountBottomDivId()).css("display", "none"); } }

                if (animate) {
                    $(document.getElementById(this.options.tableId)).css("display", "none");
                }
                $(document.getElementById(this.options.tableId)).html(this.tableRows); /*** insert table rows ***/
                if (animate) {
                    $(document.getElementById(this.options.tableId)).fadeIn(300, function () { });
                }
            }
        } catch (exc) {
            this.SetError(null, "InsertGrid() error");
            AJS.LogExc(exc);
        }
    }

    this.CurrentWriteObj = null;
    this.CurrentWriteObjIndex = null;

    this.writeGridRow = function (index, obj) {
        try {
            self.CurrentWriteObj = obj;
            self.CurrentWriteObjIndex = index;
            self.tableRows += "<tr>";
            $.each(self.options.columnDefinitions, self.writeGridTd);
            var openTd = (self.CurrentWriteObjIndex % 2 == 0) ? "<td>" : "<td class=\"alt\">";
            var objStr = JSON.stringify(obj);
            objStr = objStr.ReplaceAll('"', '_q_');
            if (self.options.edit) { self.tableRows += openTd + "<a href=\"javascript:DoNothing()\" onclick=\"" + self.jsVariableName + ".EditObject(this, '" + objStr + "')\">Edit</a></td>"; }
            self.tableRows += "</tr>";
        } catch (exc) {
            AJS.LogExc(exc);
        }
    };

    this.writeGridTd = function (index, columnDefinition) {
        try {
            var openTd = (self.CurrentWriteObjIndex % 2 == 0) ? "<td>" : "<td class=\"alt\">";
            if (columnDefinition.textAlign != "undefined" && !AJS.IsNullOrWhiteSpace(columnDefinition.textAlign)) {
                openTd = openTd.replace(">", " style=\"text-align:" + columnDefinition.textAlign + "\">");
            }
            self.tableRows += openTd;
            if (typeof columnDefinition.propertyName != null && !AJS.IsNullOrWhiteSpace(columnDefinition.propertyName)) {
                if (typeof self.CurrentWriteObj[columnDefinition.propertyName] != "undefined") {
                    self.tableRows += String(self.CurrentWriteObj[columnDefinition.propertyName]);
                } else {
                    self.tableRows += "&nbsp;--&nbsp;<span style=\"display:none;\">ERROR - AwesomeGrid - writeGridTd() - self.CurrentWriteObj[columnDefinition.propertyName] is undefined - columnDefinition.propertyName = [" + String(columnDefinition.propertyName) + "]</span>";
                }
            } else {
                self.tableRows += "&nbsp;--&nbsp;<span style=\"display:none;\">ERROR - AwesomeGrid - writeGridTd() - columnDefinition.propertyName is invalid</span>";
            }
            self.tableRows += "</td>";
        } catch (exc) {
            AJS.LogExc(exc);
        }
    }

    this.writeHeaderTd = function (index, columnDefinition) {
        try {
            var openTd = "<th>";
            self.tableRows += openTd;
            if (typeof self.jsVariableName != "undefined" && !AJS.IsNullOrWhiteSpace(self.jsVariableName)) {
                if (typeof columnDefinition.sortPropertyName != "undefined" && !AJS.IsNullOrWhiteSpace(columnDefinition.sortPropertyName)) {
                    self.tableRows += "<a href=\"javascript:" + self.jsVariableName + ".SortGrid('" + columnDefinition.sortPropertyName + "')\">";
                } else {
                    self.tableRows += "<span style=\"display:none;\">WARNING - AwesomeGrid - writeHeaderTd() - columnDefinition.sortPropertyName not defined</span>";
                }
            }
            self.tableRows += (columnDefinition.headerText || columnDefinition.propertyName);
            if (typeof columnDefinition.sortPropertyName != null && !AJS.IsNullOrWhiteSpace(columnDefinition.sortPropertyName)) { self.tableRows += "</a>"; }
            self.tableRows += "</th>";
        } catch (exc) {
            AJS.LogExc(exc);
        }
    };


    this.EditObject = function (linkElem, jsonStr) {

        var objInfo = this.gridObjInfo;

        var tableRow = $(linkElem).parents("tr")[0];
        $.each($(tableRow).children(), function (tdIndex, tdElem) {
            // $(tdElem).hide();
        });

        jsonStr = jsonStr.ReplaceAll("_q_", "\"");

        var obj = $.parseJSON(jsonStr);

        var editTableHtml = "<table id=\"AwesomeGridEditTable\">";

        editTableHtml += "<tr>";
        editTableHtml += "<th class=\"left\" colspan=\"2\">Edit " + objInfo.typeName + " - " + objInfo.primaryKeyPropName + " " + String(obj[objInfo.primaryKeyPropName]) + " - " + obj[objInfo.primaryTextPropName] + "</th>";
        editTableHtml += "<th class=\"right\" style=\"width:150px;\"></th>";
        editTableHtml += "</tr>";

        editTableHtml += "<tr>";
        editTableHtml += "<td class=\"PropName\" style=\"padding-top:15px;\">" + objInfo.primaryKeyPropName + "</td>";
        editTableHtml += "<td class=\"big\" style=\"padding-top:15px;\">" + String(obj[objInfo.primaryKeyPropName]) + "</td>";
        editTableHtml += "<td></td>";
        editTableHtml += "</tr>";

        //        editTableHtml += "<tr>";
        //        editTableHtml += "<td class=\"PropName left\">" + objInfo.primaryTextPropName + "</td>";
        //        editTableHtml += "<td class=\"big\">" + String(obj[objInfo.primaryTextPropName]) + "</td>";
        //        editTableHtml += "<td></td>";
        //        editTableHtml += "</tr>";

        $.each(obj, function (key, value) {
            if (key != objInfo.primaryKeyPropName) { // && key != objInfo.primaryTextPropName
                editTableHtml += "<tr>";
                editTableHtml += "<td class=\"PropName left\">" + key + "</td>";
                editTableHtml += "<td>";
                editTableHtml += "<input type=\"text\" value=\"" + value + "\" "

                var styleStr = "";
                var onKeyPressFunctions = "";
                var onKeyUpFunctions = ""
                if (objInfo.stringPropNames.Contains(key)) {
                    var minLength = objInfo.GetStringMinLength(key);
                    var maxLength = objInfo.GetStringMaxLength(key);
                    if (minLength != null && maxLength != null && minLength == maxLength) {
                        onKeyPressFunctions += "if (!$.Html.TextInput.EnforceMaxLength(this, event, " + String(objInfo.GetStringMinLength(key)) + ")) { return false; }";
                        styleStr += "width:" + String(7 * (Number(maxLength) + 1)) + "px;";
                    }
                    if (objInfo.upperCaseStrings.Contains(key)) { onKeyUpFunctions = "$.Html.TextInput.ToUpperCase(this);" }
                } else if (objInfo.numericPropNames.Contains(key)) {
                    onKeyPressFunctions += "if (!$.Html.TextInput.EnforceNumbersOnly(event)) { return false; }\" ";
                    var maxValue = objInfo.GetNumericMaxValue(key) || 5;
                    styleStr += "width:" + String(7 * (Number(String(maxValue).length) + 1)) + "px;";
                    onKeyUpFunctions = "$.Html.TextInput.RemoveNonNumeric(this);"
                }

                if (!$.IsNullOrWhiteSpace(styleStr)) { editTableHtml += " style=\"" + styleStr + "\" "; }
                if (!$.IsNullOrWhiteSpace(onKeyPressFunctions)) { editTableHtml += " onkeypress=\"" + onKeyPressFunctions + "\" "; }
                if (!$.IsNullOrWhiteSpace(onKeyUpFunctions)) { editTableHtml += " onkeyup=\"" + onKeyUpFunctions + "\" "; }

                editTableHtml += "/>";
                editTableHtml += "</td>";
                editTableHtml += "<td></td>";
                editTableHtml += "</tr>";
            }
        });

        editTableHtml += "<tr>";
        editTableHtml += "<td class=\"bottomLeft\"></td>";
        editTableHtml += "<td class=\"bottomRight\" colspan=\"2\" style=\"padding:15px 0px 20px 0px;\">";
        editTableHtml += "<input type=\"button\" value=\"Save\" onclick=\"" + self.jsVariableName + ".SaveObject(this, '" + jsonStr.ReplaceAll("\"", "_q_") + "')\" />"
        editTableHtml += "<input type=\"button\" value=\"Cancel\" onclick=\"" + self.jsVariableName + ".CancelEdit(this);\" style=\"margin-left:10px;\" />"
        editTableHtml += "</td>";
        editTableHtml += "</tr>";

        editTableHtml += "</table>";

        editTableHtml = "<div id=\"AwesomeGridEditTableDiv\" class=\"AwesomeGridEditTableDiv\"><div id=\"AwesomeGridEditTableInnerDiv\">" + editTableHtml + "</div></div>";

        var editTd = $("<td></td>");
        // $(editTd).attr("colspan", $(tableRow).children().length);
        $(editTd).attr("id", "AwesomeGridEditTableTd");
        $(editTd).html(editTableHtml);

        $(".AwesomeGridEditTableDiv").remove();

        $(editTd).hide();
        $(tableRow).append(editTd);
        $(editTd).fadeIn(300, function () { $(".AwesomeGridEditTableDiv").draggable(); });



    };

    this.SaveObject = function (saveButton, originalObjStr) {

        var newObject = new Object();

        var editTable = $(saveButton).parents("table")[0];
        var propNameTds = $(editTable).find("td.PropName");
        $.each(propNameTds, function (tdIndex, propNameTd) {
            var nextTd = $(propNameTd).next("td");
            // alert($(nextTd).html());
            var valueStr = "";
            var inputElem = $(nextTd).children("input")[0];
            if (typeof inputElem != "undefined") {
                valueStr = String($(inputElem).attr("value"));
            } else {
                valueStr = $(nextTd).html();
            }
            // alert(typeof inputElem);
            newObject[propNameTd.innerHTML] = valueStr.Trim();
        });

        var gridIndex = 0;
        for (var i = 0; i < this.gridObjs.length; i++) {
            if (this.gridObjs[i][this.gridObjInfo.primaryKeyPropName] == newObject[this.gridObjInfo.primaryKeyPropName]) {

                for (var propNameIndex = 0; propNameIndex < this.gridObjInfo.propNames.length; propNameIndex++) {
                    if (typeof newObject[this.gridObjInfo.propNames[propNameIndex]] != "undefined" && newObject[this.gridObjInfo.propNames[propNameIndex]] != null) {
                        this.gridObjs[i][this.gridObjInfo.propNames[propNameIndex]] = newObject[this.gridObjInfo.propNames[propNameIndex]];
                    }
                }

                gridIndex = i;

                break;
            }
        }

        if (!AJS.IsNullOrWhiteSpace(this.options.editUrl)) {

            awesomeGrid.SetLoading();

            $.ajax({
                url: this.options.editUrl,
                data: JSON.stringify(this.gridObjs[gridIndex]),
                type: 'POST', dataType: 'json', contentType: 'application/json; charset=utf-8',
                success: this.SaveObject_Success(),
                error: function (xhr, ajaxOptions, thrownError) { this.SetError(null, "Save Error"); }
            });

        } else {

            this.Update();

        }
    };

    this.SaveObject_Success = function (result) {

        this.Update();

    }

    this.CancelEdit = function (cancelButton) {

        var editTable = $(cancelButton).parents("table")[0];
        var editTableTd = $(editTable).parent();
        $.each($(editTableTd).prevAll("td"), function (tdIndex, displayTd) {
            $(displayTd).show();
        });

        $(editTableTd).fadeOut(300, function () { $(editTableTd).remove(); });

    };

    this.DisplayObjectInfo = function () {
        try {
            if (this.TableExists()) { this.SetSingleRowSingleColumnTableHtml("<div style=\"padding:20px;\">" + this.gridObjInfo.toHtmlString() + "</div>"); }
            else if (this.ContainerExists()) { $(this.containerElement).html("<div style=\"padding:20px;\">" + this.gridObjInfo.toHtmlString() + "</div>"); }
        } catch (exc) {
            this.SetError(null, "DisplayObjectInfo error");
            AJS.LogExc(exc);
        }
    };

    this.DisplayOptions = function () {
        try {
            var s = "<div style=\"padding:20px;\">";
            for (var i = 0; i < this.options.columnDefinitions.length; i++) {
                s += "<b style=\"text-decoration: underline;\">COLUMN</b><br />";
                s += $.GetObjHtmlStr(this.options.columnDefinitions[i]);
                s += "<br />";
            }
            s += $.GetObjHtmlStr(this.options).ReplaceAll("#", "&nbsp;&nbsp;&nbsp;#");
            s += "</div>";
            if (this.TableExists()) { this.SetSingleRowSingleColumnTableHtml(s); }
            else if (this.ContainerExists()) { $(this.containerElement).html(s); }
        } catch (exc) {
            this.SetError(null, "DisplayObjectInfo error");
            AJS.LogExc(exc);
        }
    };

    this.SetLoading = function () {
        try {
            if (this.TableExists()) { this.SetSingleRowSingleColumnTableHtml(AJS.Html.GetLoadingDiv()); }
            else if (this.ContainerExists()) { $(this.containerElement).html(AJS.Html.GetLoadingDiv()); }
        } catch (exc) {
            this.SetError(null, "SetLoading error");
            AJS.LogExc(exc);
        }
    };

    this.SetNoResults = function (msg) {
        try {
            msg = (typeof msg == "undefined" || msg == null) ? "" : "<span style=\"display:none;\">" + String(msg) + "</span>";
            var noResultsDiv = "<div id=\"" + this.NoResultsDivId() + "\">No Results</div>";
            if (this.TableExists()) {
                this.SetSingleRowSingleColumnTableHtml(noResultsDiv + msg);
                $("#" + this.PageLinksDivId()).hide();
                $("#" + this.PageLinksBottomDivId()).hide();
                $("#" + this.PageSelectDivId()).hide();
                $("#" + this.PageSelectBottomDivId()).hide();
                $("#" + this.ResultCountDivId()).hide();
                $("#" + this.ResultCountBottomDivId()).hide();
            } else if (this.ContainerExists()) {
                $(this.containerElement).html(noResultsDiv + msg);
            }
        } catch (exc) {
            this.SetError(null, "SetNoResults() error");
            AJS.LogExc(exc);
        }
    };

    this.SetSingleRowSingleColumnTableHtml = function (htmlStr) {
        if (this.TableExists()) {
            $(document.getElementById(this.options.tableId)).html("<tr><td colspan=\"" + String(this.options.NumColumns()) + "\">" + htmlStr + "</td></tr>");
        }
    };

    this.Clear = function () {
        try {
            if (typeof this.containerElement != "undefined" && this.ContainerExists()) { $(containerElement).html(""); }
        } catch (exc) {
            AJS.LogExc(exc);
        }
    };

    this.Reset = function () {
        try {
            this.gridObjs = null;
            this.options = new AwesemeGridOptions();
        } catch (exc) {
            AJS.LogExc(exc);
        }
    }

    this.PageChange = function (pageNumInputElementOrNumber) {
        try {
            if (typeof pageNumInputElementOrNumber == "undefined" || pageNumInputElementOrNumber == null) {
                this.pageNum = 1;
            } else if (typeof pageNumInputElementOrNumber == "number") {
                this.pageNum = pageNumInputElementOrNumber;
            } else if (typeof pageNumInputElementOrNumber == "object") {
                this.pageNum = Number(pageNumInputElementOrNumber.value);
            }

            this.InsertGrid(false);
        } catch (exc) {
            this.SetError(null, "PageChange() error");
            AJS.LogExc(exc);
        }
    };

    this.SortGrid = function (sortPropertyNameParamStr) {
        try {
            if (typeof sortPropertyNameParamStr == "undefined" || sortPropertyNameParamStr == null) { sortPropertyNameParamStr = this.options.sortPropertyName; }
            if (this.options.sortPropertyName == sortPropertyNameParamStr) {
                if (this.options.sortOrder == "asc") { this.options.sortOrder = "desc"; }
                else { this.options.sortOrder = "asc"; }
            } else {
                this.options.sortPropertyName = sortPropertyNameParamStr;
                this.options.sortOrder = "asc";
            }
            this.InsertGrid();
        } catch (exc) {
            this.SetError(null, "SortGrid() error");
            AJS.LogExc(exc);
        }
    };

    this.GenerateColumnDefinitions = function () {

        try {
            if (typeof this.gridObjs == "undefined" && typeof objs == "undefined") { this.SetNoResults("AwesomeGrid - ERROR - GenerateColumnDefinitions() - this.gridObjs or objs parameter must be defined"); return; }

            var generatedColumnDefinitions = [];
            for (var key in this.gridObjs[0]) {
                if (!AJS.IsNullOrWhiteSpace(key)) {
                    var generateColumnDefinition = new AwesomeGridColumnDefintion(key);
                    generatedColumnDefinitions.push(generateColumnDefinition);
                }
            }

            this.options.columnDefinitions = generatedColumnDefinitions;

            return generatedColumnDefinitions;
        } catch (exc) {
            this.SetError(null, "GenerateColumnDefinitions() error");
            AJS.LogExc(exc);
        }
    };

    this.SetError = function (errorMsg, debugMsg) {
        try {
            var errorHtml = "<div id=\"" + this.ErrorDivId() + "\">";
            if (typeof errorMsg != "undefined" && !AJS.IsNullOrWhiteSpace(errorMsg)) { errorHtml += errorMsg; }
            else { errorHtml += this.options.errorMessage; }
            errorHtml += "</div>";

            if (typeof debugMsg == "undefined" || debugMsg == null) { debugMsg = ""; }
            else { debugMsg = "<span style=\"display:none;\">" + String(debugMsg) + "</span>"; }
            errorHtml += debugMsg;

            if (this.TableExists()) { $(document.getElementById(this.options.tableId)).html(errorHtml); }
            else if (this.ContainerExists()) { $(this.containerElement).html(errorHtml); }

            try {
                var errorSpan = document.createElement("span");
                $(errorSpan).attr("style", "display:none;");
                $(errorSpan).html(errorHtml);
                document.getElementsByTagName("body")[0].appendChild(errorSpan);
            } catch (e) {
                AJS.LogExc(e);
            }
        } catch (exc) {
            AJS.LogExc(exc);
        }
    };

    this.AddDefaultStyles = function () {
        try {
            if (document.getElementById("AwesomeGridDefaultStyles") == null) {
                var defaultStylesElement = document.createElement("style");
                $(defaultStylesElement).attr("type", "text/css");
                $(defaultStylesElement).attr("id", "AwesomeGridDefaultStyles");
                $(defaultStylesElement).html(this.options.defaultStylesStr);
                document.getElementsByTagName("head")[0].appendChild(defaultStylesElement);
            }
        } catch (exc) {
            AJS.LogExc(exc);
        }
    };
}

/**************************************************************************************************
**** end - AwesomeGrid code
***************************************************************************************************/


