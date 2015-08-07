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
        trackClass:  "do-track",
        customTracking: null
    }, props);

    this.doNotTrackClass = props.doNotTrackClass;
    this.trackClass = props.trackClass;
    this.customTracking = props.customTracking;

    //this.list;

    this.checkboxes = new Array();
    this.selects = new Array();
    this.inputs = new Array();

    this.get = function () {
        //console.log("get");
        return this.list
    };

}

function customCheck (item1,item2) {
    if (item1 == item2) { return true; }
    
    return false;
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
    $(selector + ' input:checkbox, ' + selector + ' input:radio').each(function() {
        $(this).attr('changeId', changeIdCounter);
        checkboxes[changeIdCounter] = $(this).prop('checked');
        changeIdCounter++;
    });
    $(selector + ' select').each(function() {
        $(this).attr('changeId', changeIdCounter);
        selects[changeIdCounter] = $(this).val(); // note: this works with multiple selects
        changeIdCounter++;
    });
    $(selector + ' input:not([type="radio"], [type="checkbox"])').each(function() {
        $(this).attr('changeId', changeIdCounter);
        inputs[changeIdCounter] = $(this).val();
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
            $(this).prop('checked') = checkboxes[changeIdCounter];
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

