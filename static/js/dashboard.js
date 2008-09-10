var g_currentCategory = "Inbox";
var g_statusTimeoutID = null;

function dashboard_load() {
//    google.load("prototype", "1.6.0.2");
}

function add_item() {
    set_status("adding item");
    var value = prompt("Enter your item!");
    if(value == null) {
        set_status("canceling adding item");
        return;
    }
//  now actually add the item
    reload_items();
    set_status("added item: " + value);
}

function reload_items() {
    // uses g_currentCategory
}

function switch_tab(tab_name) {
    g_currentCategory = tab_name;
    reload_items();
    set_status("switching tab");
}

function complete_items() {
    set_status("marking items as complete");
}

function archive_items() {
    set_status("archiving items");
}

function set_status(msg) {
    if(g_statusTimeoutID != null)
        clearTimeout(g_statusTimeoutID);
    g_statusTimeoutID = setTimeout(function() {
        if(g_statusTimeoutID != null) {
            clearTimeout(g_statusTimeoutID);
            g_statusTimeoutID = null;
            $('statusbar').innerHTML = "&nbsp;";
        }
    }, 2000);
    if(msg != null && msg.length > 0)
        $('statusbar').innerHTML = msg;
    else
        $('statusbar').innerHTML = "&nbsp;";
}
