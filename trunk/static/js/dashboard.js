var g_currentCategory = "Incomplete";
var g_statusTimeoutID = null;
var g_currentItem = null;
var g_availableItems = [];

function dashboard_load() {
//    google.load("prototype", "1.6.0.2");
}

function add_item() {
    remove_details();
    set_status("adding item");
    var value = prompt("Enter your item!");
    if(value == null) {
        set_status("canceling adding item");
        return;
    }
    new Ajax.Request("/dashboard/new/", {
        method: 'post',
        onSuccess: function(transport) {
            set_status("added item!");
            reload_items();
        }, onFailure: function(transport) { set_status("error!"); },
        parameters: { title: value,
                      body: "From web interface",
                      category: g_currentCategory
        }});
}

function reload_items() {
    show_details(g_currentItem);
    new Ajax.Updater('itembox', '/dashboard/itemlist', {
            parameters: { 'category': g_currentCategory } });
}

function switch_tab(tab_name) {
    var old_tab = $("tab_" + g_currentCategory);
    if(old_tab != null) old_tab.className = "";
    remove_details();
    g_currentCategory = tab_name;
    reload_items();
    $("tab_"+g_currentCategory).className = "selected";
    new Ajax.Updater('menubar', '/dashboard/menu', {
            parameters: { 'category': tab_name },
            method: 'get' });
}

function complete_items() {
    set_status("marking items as complete");
    items_action("complete");
}
function incomplete_items() {
    set_status("marking items as incomplete");
    items_action("incomplete");
}
function delete_items() {
    set_status("marking items as deleted");
    items_action("archive");
}
function change_category() {
    category = $F("new_category");
    set_status("moving items to category " + category);
    items_action("category", category);
}


function items_action(action, variable) {
    var items = [];
    $$(".item_checkbox").forEach(function(item) {
        if(item.checked) items.push(item.value); });
    new Ajax.Request("/dashboard/batch_edit/", {
            method: 'post',
            onSuccess: function(transport) {
                reload_items();
                set_status("success!");
            }, onFailure: function(transport) { set_status("error!"); },
            parameters: { action: action,
                          items: items.join(","),
                          variable: variable
            }});
}

function check_all(checked) {
    $$(".item_checkbox").forEach(function(item) {
        item.checked = checked;
    });
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

function show_details(item_id) {
    g_currentItem = item_id;
    $('detailbox').style.display = "none";
    $('detailbox_content').innerHTML = "";
    if(item_id != null) {
        new Ajax.Updater('detailbox_content', '/dashboard/detail/' + item_id, {
            method: 'get',
            parameters: {},
            onComplete: function() {
                $('detailbox').style.display = "block";
            }
        });
    }
}

function edit_item(item_id) {
    new Ajax.Request("/dashboard/edit/" + item_id, {
        method: 'post',
        onSuccess: function(transport) { remove_details(); reload_items(); },
        onFailure: function(transport) { set_status("error!"); },
        parameters: { completed: $F('edit_completed'),
                      title: $F('edit_title'),
                      body: $F('edit_body') }});
}

function remove_details() {
    show_details(null);
}

function new_tab() {
    remove_details();
    set_status("adding category");
    var value = prompt("Enter the category name!");
    if(value == null) {
        set_status("canceling adding category");
        return;
    }
    new Ajax.Request("/dashboard/add_category", {
            parameters: { "name": value },
            method: "post",
            onSuccess: function(transport) {
                $('tabbar').innerHTML = transport.responseText;
                switch_tab(value);
            },
            onFailure: function(transport) {
                alert("Invalid category name!");
            }});
}

function remove_category(category) {
    if(category == null) {
        category = g_currentCategory;
    }
    if(category == "Incomplete" || category == "Completed") {
        alert("Unable to remove category " + category);
        return;
    }
    if(!confirm("Are you sure you want to remove category " + category + "?"))
        return;
    new Ajax.Request("/dashboard/remove_category", {
            parameters: { "name": category },
            method: "post",
            onSuccess: function(transport) {
                $('tabbar').innerHTML = transport.responseText;
                switch_tab("Incomplete");
            },
            onFailure: function(transport) {
                alert("Unable to remove!");
            }});
}
