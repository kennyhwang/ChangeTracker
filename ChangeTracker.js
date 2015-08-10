// Default arguments handler
defaultHandler = function (defaults, params) {
    var i;
    for (i in params) {
        defaults[i] = params[i];
    };
    return defaults;
}


// ChangeTracker class
function ChangeTracker(props) {

    // Defaults
    var props = defaultHandler({
        doNotTrackClass: "do-not-track",
        defaultElementGetFnc: function (ele) {
            return $(ele).val();
        },
        defaultElementSetFnc: function (ele, val) {
            $(ele).val(val);
        },
        defaultCheckBoxGetFnc: function (ele) {
            return $(ele).prop('checked');
        },
        defaultCheckBoxSetFnc: function (ele, val) {
            $(ele).prop('checked', val);
        },
        defaultRadioGetFnc: function (ele) {
            return $(ele).prop('checked');
        },
        defaultRadioSetFnc: function (ele, val) {
            $(ele).prop('checked', val);
        },
        defaultSelectGetFnc: function (ele) {
            return $(ele).val();
        },
        defaultSelectSetFnc: function (ele, val) {
            $(ele).val(val);
        },
        defaultInputFieldGetFnc: function (ele) {
            return $(ele).val();
        },
        defaultInputFieldSetFnc: function (ele, val) {
            $(ele).val(val);
        },
        custom: null
    }, props);

    // Set props
    this.doNotTrackClass = props.doNotTrackClass;
    this.custom = (function () {
        if (props.custom) {
            if (props.custom.constructor === Array) {
                props.custom.each(function (i, o) {
                    o["get"] = o["get"] || props.defaultElementGetFnc;
                    o["set"] = o["set"] || props.defaultElementSetFnc;
                });
                return props.custom;
            } else {
                props.custom["get"] = props.custom["get"] || props.defaultElementGetFnc;
                props.custom["set"] = props.custom["set"] || props.defaultElementSetFnc;
                return [props.custom]; // Individual
            }
        }
        //else {
        //    return [{
        //        selector: "example-custom-track",
        //        get: props.defaultElementGetFnc,
        //        set: props.defaultElementSetFnc,

        //    }];
        //};
    })();
    this.donotselect = (function () {
        var notselectorstring = "." + this.doNotTrackClass; // Start with do-not-track class
        if (props.custom) {
            if (props.custom.constructor === Array) {
                var i;
                var arr = [];
                for (i in props.custom) {
                    arr.push(props.custom["selector"]);
                };
                notselectorstring += "," + arr.join(","); // Join all custom classes
            } else {
                notselectorstring += "," + props.custom["selector"]; // Individual
            }
        }
        return notselectorstring;
    }).call(this);
    this.selectorGroups = (function () {
        var groups = [
            {
                selector: 'input:checkbox:not(' + this.donotselect + ')',
                get: props.defaultCheckBoxGetFnc,
                set: props.defaultCheckBoxSetFnc
            },
            {
                selector: 'input:radio:not(' + this.donotselect + ')',
                get: props.defaultRadioGetFnc,
                set: props.defaultRadioSetFnc
            },
            {
                selector: 'select:not(' + this.donotselect + ')',
                get: props.defaultSelectGetFnc,
                set: props.defaultSelectSetFnc
            },
            {
                selector: 'input:not([type="radio"], [type="checkbox"], ' + this.donotselect + ')',
                get: props.defaultInputFieldGetFnc,
                set: props.defaultInputFieldSetFnc
            }
        ];

        $(this.custom).each(function (i, o) {
            groups.push(o);
        });

        return groups;
    }).call(this);

    // forEach function
    this.forEach = function (selector, cb) {
        var results = [];
        $(selector).each(function () {
            results.push(cb(this));
        });
        return results;
    }

    this.chglist = [];

    //this.checkboxes = new Array();
    //this.selects = new Array();
    //this.inputs = new Array();

    this.get = function () {
        return this.chglist
    };
}

ChangeTracker.prototype.init = function () {

    var selector = "body";
    var changeIdCounter = 0;

    var chglist = [];

    //var checkboxes = new Array();
    //var selects = new Array();
    //var inputs = new Array();

    // reset changeId everywhere
    //$(selector + " * ").removeAttr('changeId');

    // add a changeId attr on each item
    //$(selector + ' input:checkbox, ' + selector + ' input:radio').each(function() {
    //    $(this).attr('changeId', changeIdCounter);
    //    checkboxes[changeIdCounter] = $(this).prop('checked');
    //    changeIdCounter++;
    //});
    //$(selector + ' select').each(function() {
    //    $(this).attr('changeId', changeIdCounter);
    //    selects[changeIdCounter] = $(this).val(); // note: this works with multiple selects
    //    changeIdCounter++;
    //});
    //$(selector + ' input:not([type="radio"], [type="checkbox"])').each(function() {
    //    $(this).attr('changeId', changeIdCounter);
    //    inputs[changeIdCounter] = $(this).val();
    //    changeIdCounter++;
    //});

    //this.forEach(selector + ' ', function(ele) {
    //    $(ele).attr('changeId', changeIdCounter);
    //    checkboxes[changeIdCounter] = $(ele).prop('checked');
    //    type[changeIdCounter] = type;
    //    changeIdCounter++;
    //});

    //this.checkboxes = checkboxes;
    //this.selects = selects;
    //this.inputs = inputs;

    // Set values for all selector groups
    var chgtrk = this; // Save context
    $(this.selectorGroups).each(function (i, o) { // For each selector group
        chgtrk.forEach(selector + ' ' + o.selector, function (ele) { // Execute a forEach function
            $(ele).attr('changeid', changeIdCounter); // Add counter
            chglist.push({
                selector: o.selector, // re-use selector as identifier
                chgid: changeIdCounter, // Set chgid to counter
                val: o.get(ele) // Use getter
            }); // Push to change list
            changeIdCounter++; // Increment
        });
    });

    this.chglist = chglist; // Save values
}

ChangeTracker.prototype.checkChanges = function (selector) {
    // check if each item is same as in DOM

    var hasChanged = false;
    //var changeIdCounter = 0;
    if (typeof (selector) == "undefined") {
        var selector = "body";
    }

    var chgtrk = this; // Save context
    $(this.selectorGroups).each(function (i, o) { // For each selector group
        chgtrk.forEach(selector + ' ' + o.selector, function (ele) { // Execute a forEach function
            for (var i = 0; i < chgtrk.chglist.length; i++) { // Loop through change list
                if (chgtrk.chglist[i].chgid === parseInt($(ele).attr('changeid'))) { // if chgid matches
                    if (chgtrk.chglist[i].val !== o.get(ele)) { // if values are different
                        hasChanged = true; // Change found
                        break;
                    };
                }
            }
        });
    });

    //var checkboxes = this.checkboxes;
    //var selects = this.selects;
    //var inputs = this.inputs;

    //$(selector + ' input:checkbox, ' + selector + ' input:radio').each(function () {
    //    changeIdCounter = $(this).attr('changeId');
    //    if (checkboxes[changeIdCounter] != $(this).prop('checked')) {
    //        hasChanged = true;
    //    }
    //});
    //$(selector + ' select').each(function () {
    //    changeIdCounter = $(this).attr('changeId');
    //    if (selects[changeIdCounter] != $(this).val()) {
    //        hasChanged = true;
    //    }
    //});
    //$(selector + ' input:not([type="radio"], [type="checkbox"])').each(function () {
    //    changeIdCounter = $(this).attr('changeId');
    //    if (selects[changeIdCounter] != $(this).val()) {
    //        hasChanged = true;
    //    }
    //});

    return hasChanged;

};

ChangeTracker.prototype.resetData = function (selector) {

    if (typeof (selector) == "undefined") {
        var selector = "body";
    }

    var chgtrk = this; // Save context
    $(this.selectorGroups).each(function (i, o) { // For each selector group
        chgtrk.forEach(selector + ' ' + o.selector, function (ele) { // Execute a forEach function
            for (var i = 0; i < chgtrk.chglist.length; i++) { // Loop through change list
                if (chgtrk.chglist[i].chgid === parseInt($(ele).attr('changeid'))) { // if chgid matches
                    o.set(ele,chgtrk.chglist[i].val); // Use set function to set original value
                }
            }
        });
    })

    //var checkboxes = this.checkboxes;
    //var selects = this.selects;
    //var inputs = this.inputs;

    //$(selector + ' input:checkbox, ' + selector + ' input:radio').each(function () {
    //    changeIdCounter = $(this).attr('changeId');
    //    if (changeIdCounter) {
    //        $(this).prop('checked', checkboxes[changeIdCounter]);
    //    }
    //});
    //$(selector + ' select').each(function () {
    //    changeIdCounter = $(this).attr('changeId');
    //    if (changeIdCounter) {
    //        $(this).val(selects[changeIdCounter]);
    //    }
    //});
    //$(selector + ' input:not([type="radio"], [type="checkbox"])').each(function () {
    //    changeIdCounter = $(this).attr('changeId');
    //    if (changeIdCounter) {
    //        $(this).val(inputs[changeIdCounter]);
    //    }
    //});
}

// todo: add, delete


