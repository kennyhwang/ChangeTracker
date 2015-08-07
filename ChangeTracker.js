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
        defaultElementValueFnc: function(ele) {
            return $(ele).val();
        },
        customDefaultTrackClass:  "custom-track",
        custom: null
    }, props);

    // Set props
    this.doNotTrackClass = props.doNotTrackClass;
    this.trackClass = props.trackClass;
    this.custom = (function() {
        if (!props.custom) {
            if (props.custom.constructor === Array) {
                return props.custom;
            } else {
                return [{
                    customTrackingClass: props.customDefaultTrackClass,
                    customElementValueFnc: props.custom.constructor
                }];
            }
        } else {
            return [{
                customDefaultTrackClass:  "custom-track",
                customElementValueFnc: props.defaultElementValueFnc
            }];
        };
    }
    })();

this.list;

this.get = function () {
    //console.log("get");
    return this.list
};
}

ChangeTracker.prototype.checkchanges = function () {
    //console.log('checking changes');
    // Get old list
    var list = this.get();

    // Loop list
    for (var i = 0; i < list.length; i++) {
        if (list[i].changed) {
            return true;
        };
    };

    return false;
};
