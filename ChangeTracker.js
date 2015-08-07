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
        customTracking: null,
        customTrackFnc: null
    }, props);

    this.doNotTrackClass = props.doNotTrackClass;
    this.trackClass = props.trackClass;
    this.customTracking = props.customTracking;
    this.customTracking = (function() {
            var default = {
                    customTracking: [{
                            customDefaultTrackClass:  "custom-track",
                            customTrackFunction: function (item1,item2) {
                                    if (item1 == item2) { return true; }
                                    return false;
                            }}]
            };
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


//if (customCheck.constructor === Array) {
//}
