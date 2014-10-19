
function add_td(tr, text) {
    var td = document.createElement("td");        
    td.appendChild(document.createTextNode(text));
    tr.appendChild(td);
}

function add_tr(table, items) {
    var tr = document.createElement("tr");
    for(cnt in items) {
        add_td(tr, items[cnt]);
    }
    table.appendChild(tr);
}

// init the result window
self.on('message', function(param) {
    var result = document.getElementById("result");
    param.sort(function(a, b) { return a[1]-b[1];})
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    add_tr(thead, ["Kanji", "Level", "Count"])
    for(cnt in param) {
        add_tr(tbody, param[cnt])
    }
    result.appendChild(table);
});
