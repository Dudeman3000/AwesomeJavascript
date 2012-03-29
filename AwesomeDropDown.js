
function AwesomeDropDownOptions(parameters) {

    if (typeof parameters == "undefined" || parameters == null) { parameters = {}; }

    this.dropDownId = null;
    this.valueProp = null;
    this.textProp = null;
    this.dropDownLabelText = null;
    this.onchangeFuncName = null;
    this.onchangeJs = null;
    this.firstOptionValue = null;
    this.firstOptionText = null;
    this.lastOptionValue = null;
    this.lastOptionText = null;
    this.maxTextLen = 20;
    this.includeEmptyStringAndZeroValueOptions = false;

    $.extend(this, parameters);

    if (this.valueProp != null && this.textProp == null) { this.textProp = this.valueProp; }
}

/***********************************************************************************************/

jQuery.fn.AwesomeDropDown = function (awesomeDropDownObjs, awesomeDropDownOptions) {
    try {
        var newAwesomeDropDown = new AwesomeDropDown(awesomeDropDownObjs, awesomeDropDownOptions);
        newAwesomeDropDown.containerElement = this[0];
        return newAwesomeDropDown;
    } catch (exc) {
        AJS.LogExc(exc);
    }
}

function AwesomeDropDown(awesomeDropDownObjs, awesomeDropDownOptions) {

    if (typeof awesomeDropDownObjs == "undefined") { awesomeDropDownObjs = null; }
    if (typeof awesomeDropDownOptions == "undefined") { awesomeDropDownOptions = {}; }

    var self = this;

    this.dropDownObjs = awesomeDropDownObjs;

    this.options = new AwesomeDropDownOptions(awesomeDropDownOptions);

    this.containerElement = null;  /*** set with jQuery constructor ***/

    this.ContainerExists = function () { return Boolean(this.containerElement != null); }

    /*** display functions ***/

    this.Update = function (awesomeDropDownObjs, awesomeDropDownOptions, newContainerElement) {
        try {
            if (typeof awesomeDropDownObjs != "undefined" && awesomeDropDownObjs != null && typeof awesomeDropDownObjs.length == "number") {
                this.dropDownObjs = awesomeDropDownObjs;
            }
            if (typeof awesomeDropDownOptions != "undefined" && awesomeDropDownOptions != null && typeof awesomeDropDownOptions.length == "number") {
                this.options = $.extend(this.options, awesomeDropDownOptions);
            }
            if (typeof newContainerElement != "undefined" && newContainerElement != null) {
                this.Clear();
                this.containerElement = newContainerElement;
            }
            this.Insert();
        } catch (exc) {
            AJS.LogExc(exc);
        }
    }

    this.Insert = function () {
        try {

            if (!this.ContainerExists()) { this.SetError("AwesomeDropDown - Insert() - Container DNE"); return; }

            /*** validate dropDownObjs ***/
            if (typeof this.dropDownObjs == null) { this.SetError("AwesomeDropDown - Insert() - this.dropDownObjs is null"); return; }
            if (typeof this.dropDownObjs.length == "undefined" || this.dropDownObjs.length == null) { this.SetError("ERROR - AwesomeDropDown - Insert() - this.dropDownObjs.length error"); return; }
            if (this.dropDownObjs.length == 0) { this.Clear(); return; }

            /*** validate valueProp and textProp ***/
            if (AJS.IsNullOrWhiteSpace(this.options.valueProp) || typeof this.dropDownObjs[0][this.options.valueProp] == "undefined"
                || AJS.IsNullOrWhiteSpace(this.options.textProp) || typeof this.dropDownObjs[0][this.options.textProp] == "undefined"
                || this.options.dropDownId == null) {

                var objInfo = $.GetObjectInfo(this.dropDownObjs);

                this.options.valueProp = objInfo.primaryKeyPropName;
                this.options.textProp = objInfo.primaryTextPropName;
                this.options.dropDownId = objInfo.typeName + "DropDown";
                this.options.dropDownLabelText = objInfo.typeName + ":";
            }

            if (this.options.textProp == null && this.options.valueProp == null) { AJS.LogObj($.extend(this.dropDownObjs[0], { "AwesomeDropDown_Error": "Insert() - text and value props both null" })); return; }
            if (this.options.textProp == null) { this.options.textProp = this.options.valueProp; }
            if (this.options.valueProp == null) { this.options.valueProp = this.options.textProp; }
            /*** end - validate valueProp and textProp ***/

            /*** validate dropDownId ***/
            //            if (this.options.dropDownId == null) {
            //                var bestColumnName = null;
            //                var appendage = "id";
            //                bestColumnName = AJS.GetFirstStringPropertyNameThatEndsWith(this.dropDownObjs[0], appendage);
            //                if (bestColumnName == null) { appendage = "name"; bestColumnName = AJS.GetFirstStringPropertyNameThatEndsWith(this.dropDownObjs[0], appendage); }
            //                if (bestColumnName == null) { appendage = ""; bestColumnName = this.options.textProp; }
            //                if (appendage != "") { bestColumnName = bestColumnName.substring(0, bestColumnName.length - appendage.length); }
            //                this.options.dropDownId = bestColumnName + "DropDown";
            //            }

            /*** construct Html ***/
            var optionsHtml = "";

            if (this.dropDownObjs.length != 1) {
                if (!AJS.IsNullOrWhiteSpace(this.options.firstOptionValue)) {
                    optionsHtml += "<option value=\"" + String(this.options.firstOptionValue).Trim() + "\">";
                    if (AJS.IsNullOrWhiteSpace(this.options.firstOptionText)) { optionsHtml += String((this.options.firstOptionValue.length > this.options.maxTextLen) ? (this.options.firstOptionValue.substring(0, this.options.maxTextLen) + "...") : this.options.firstOptionValue); }
                    else { optionsHtml += String((this.options.firstOptionText.length > this.options.maxTextLen) ? (this.options.firstOptionText.substring(0, this.options.maxTextLen) + "...") : this.options.firstOptionText); }
                    optionsHtml += "</option>";
                }
            }

            for (var i = 0; i < this.dropDownObjs.length; i++) {
                var obj = this.dropDownObjs[i];
                try {
                    var hideOption = false;
                    if (!this.options.includeEmptyStringAndZeroValueOptions) {
                        if (typeof obj[this.options.valueProp] == "string" && AJS.IsNullOrWhiteSpace(obj[this.options.valueProp])) { hideOption = true; }
                        if (typeof obj[this.options.valueProp] == "number" && obj[this.options.valueProp] == 0) { hideOption = true; }
                    }
                    optionsHtml += "<option value=\"" + String(obj[this.options.valueProp]).Trim() + "\"";
                    if (hideOption) { optionsHtml += " style=\"display:none;\""; }
                    optionsHtml += ">";
                    var oText = String(obj[this.options.textProp]).Trim();
                    optionsHtml += String((oText.length > this.options.maxTextLen) ? (oText.substring(0, this.options.maxTextLen) + "...") : oText);
                    optionsHtml += "</option>";
                } catch (optionExc) {
                    AJS.LogExc(optionExc);
                }
            }

            if (this.dropDownObjs.length != 1) {
                if (!AJS.IsNullOrWhiteSpace(this.options.lastOptionValue)) {
                    optionsHtml += "<option value=\"" + String(this.options.lastOptionValue).Trim() + "\" valueProperty=\"" + this.options.valueProp + "\ >";
                    if (AJS.IsNullOrWhiteSpace(this.options.lastOptionText)) { optionsHtml += String(this.options.lastOptionValue); }
                    else { optionsHtml += String(this.options.lastOptionText); }
                    optionsHtml += "</option>";
                }
            }

            if (AJS.IsNullOrWhiteSpace(optionsHtml)) { this.SetError("optionsHtml is null or empty"); return; }

            var htmlStr = "<select";
            if (!AJS.IsNullOrWhiteSpace(this.options.dropDownId)) { htmlStr += " id=\"" + this.options.dropDownId + "\""; }
            if (!AJS.IsNullOrWhiteSpace(this.options.onchangeFuncName) || !AJS.IsNullOrWhiteSpace(this.options.onchangeJs)) {
                htmlStr += " onchange=\"";
                if (!AJS.IsNullOrWhiteSpace(this.options.onchangeFuncName)) { htmlStr += AJS.GetFunctionStr(this.options.onchangeFuncName); }
                if (!AJS.IsNullOrWhiteSpace(this.options.onchangeJs)) { htmlStr += this.options.onchangeJs; }
                htmlStr += "\"";
            }
            htmlStr += ">";
            htmlStr += optionsHtml;
            htmlStr += "</select>";

            htmlStr = "<span style=\"margin-right:5px;\">" + (this.options.dropDownLabelText || "Please Select:") + "</span>" + htmlStr;

            htmlStr += "<span style=\"display:none;\">AwesomeDropDown valueProp = [" + this.options.valueProp + "]</span>";
            htmlStr += "<span style=\"display:none;\">AwesomeDropDown textProp = [" + this.options.textProp + "]</span>";

            $(this.containerElement).html(htmlStr);

        } catch (exc) {
            AJS.LogExc(exc);
        }
    };

    this.Clear = function () {
        try {
            if (!this.ContainerExists()) {
                $(this.containerElement).html("");
            }
        } catch (exc) {
            AJS.LogExc(exc);
        }
    };

    this.SetError = function (msg) {
        try {
            if (typeof msg == "undefined" || AJS.IsNullOrWhiteSpace(msg)) { msg = null; }
            if (!this.ContainerExists()) {
                this.containerElement.html(msg == null ? "" : "<span style=\"display:none;\">" + String(msg) + "</span>");
            }
        } catch (exc) {
            AJS.LogExc(exc);
        }
    }

}





