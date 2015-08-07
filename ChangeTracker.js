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
        defaultElementGetFnc: function(ele) {
            return $(ele).val();
        },
        defaultElementSetFnc: function(ele,val) {
            $(ele).val(val);
        },
        defaulCheckBoxGetFnc: function(ele) {
            return $(ele).prop('checked');
        },
        defaultCheckBoxSetFnc: function(ele,val) {
            $(ele).prop('checked',val);
        },
        defaulRadioGetFnc: function(ele) {
            return $(ele).prop('checked');
        },
        defaultRadioSetFnc: function(ele,val) {
            $(ele).prop('checked',val);
        },
        defaulSelectGetFnc: function(ele) {
            return $(ele).val();
        },
        defaultSelectSetFnc: function(ele,val) {
            $(ele).val(val);
        },
        defaulInputFieldGetFnc: function(ele) {
            return $(ele).val();
        },
        defaultInputFieldSetFnc: function(ele,val) {
            $(ele).val(val);
        },
        custom: null
    }, props);

    // Set props
    this.doNotTrackClass = props.doNotTrackClass;
    this.custom = (function() {
        if (props.custom) {
            if (props.custom.constructor === Array) {
                props.custom.each(function (i, o) {
                    o["customElementGetFnc"] = o["customElementGetFnc"] || props.defaultElementGetFnc;
                    o["customElementSetFnc"] = o["customElementSetFnc"] || props.defaultElementSetFnc;
                });
                return props.custom;
            } else {
                props.custom["customElementGetFnc"] = props.custom["customElementGetFnc"] || props.defaultElementGetFnc;
                props.custom["customElementSetFnc"] = props.custom["customElementSetFnc"] || props.defaultElementSetFnc;
                return [props.custom]; // Individual
            }
        } else {
            return [{
                customClass: "example-custom-track",
                customElementGetFnc: props.defaultElementGetFnc,
                customElementSetFnc: props.defaultElementSetFnc,

            }];
        };
    })();
    this.donotselect = (function() {
        var notselectorstring = "." + this.doNotTrackClass; // Start with do-not-track class
        if (props.custom) {
            if (props.custom.constructor === Array) {
                var i;
                var arr = [];
                for (i in props.custom) {
                    arr.push("." + props.custom["customClass"]);
                };
                notselectorstring = arr.join(","); // Join all custom classes
            } else {
                notselectorstring = "." + props.custom["customClass"]; // Individual
            }
        }
        return notselectorstring;
    })();
    this.selectorGroups = {
        checkboxes: 'input:checkbox:not(' + this.donotselect + ')',
        radio: 'input:radio:not(' + this.donotselect + ')',
        select: 'select:not(' + this.donotselect + ')',
        inputs: 'input:not([type="radio"], [type="checkbox"], ' + this.donotselect + ')'
    }

    // forEach function
    this.forEach = function(selector,cb) {
        var results = [];
        $(selector).each(function() {
            results.push(cb(this));
        });
        return results;
    }

    this.checkboxes = new Array();
    this.selects = new Array();
    this.inputs = new Array();

    this.get = function () {
        //console.log("get");
        return this.list
    };
}

ChangeTracker.prototype.init = function() {

    var selector = "body";
    var changeIdCounter = 0;

    var checkboxes = new Array();
    var selects = new Array();
    var inputs = new Array();

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

    this.forEach(selector + ' ', function(ele) {
        $(ele).attr('changeId', changeIdCounter);
        checkboxes[changeIdCounter] = $(ele).prop('checked');
        type[changeIdCounter] = type;
        changeIdCounter++;
    });

    this.checkboxes = checkboxes;
    this.selects = selects;
    this.inputs = inputs;

}

ChangeTracker.prototype.checkChanges = function (selector) {
    // check if each item is same as in DOM

    var hasChanged = false;
    var changeIdCounter = 0;
    if ( typeof(selector) == "undefined" ) {
        var selector = "body";
    }

    var checkboxes = this.checkboxes ; 
    var selects = this.selects ; 
    var inputs = this.inputs ; 

    $(selector + ' input:checkbox, ' + selector + ' input:radio').each(function() {
        changeIdCounter = $(this).attr('changeId');
        if ( checkboxes[changeIdCounter] != $(this).prop('checked') ) {
            hasChanged = true ; 
        }
    });
    $(selector + ' select').each(function() {
        changeIdCounter = $(this).attr('changeId');
        if ( selects[changeIdCounter] != $(this).val() ) {
            hasChanged = true ; 
        }
    });
    $(selector + ' input:not([type="radio"], [type="checkbox"])').each(function() {
        changeIdCounter = $(this).attr('changeId');
        if ( selects[changeIdCounter] != $(this).val() ) {
            hasChanged = true ; 
        }
    });

    return hasChanged;

};

ChangeTracker.prototype.resetData = function (selector) {

    if ( typeof(selector) == "undefined" ) {
        var selector = "body";
    }

    var checkboxes = this.checkboxes ; 
    var selects = this.selects ; 
    var inputs = this.inputs ; 

    $(selector + ' input:checkbox, ' + selector + ' input:radio').each(function() {
        changeIdCounter = $(this).attr('changeId');
        if ( changeIdCounter ) {
            $(this).prop('checked', checkboxes[changeIdCounter]);
        }
    });
    $(selector + ' select').each(function() {
        changeIdCounter = $(this).attr('changeId');
        if ( changeIdCounter ) {
            $(this).val(selects[changeIdCounter]);
        }
    });
    $(selector + ' input:not([type="radio"], [type="checkbox"])').each(function() {
        changeIdCounter = $(this).attr('changeId');
        if ( changeIdCounter ) {
            $(this).val(inputs[changeIdCounter]);
        }
    });
}

// todo: add, delete
