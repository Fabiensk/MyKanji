
// add a cell. Parameters:
// tr: parent
// value: either a text or a link info
// is_link: true if link
function add_td(tr, value, is_link) {
    var td = document.createElement("td");        
    if (is_link==false) {
        td.appendChild(document.createTextNode(value));
    } else {
        for(cnt in value) {
            if (cnt>0) {
                td.appendChild(document.createTextNode(" "));
            }
            var a = document.createElement("a");
            a.setAttribute("href", value[cnt][0]);
            a.appendChild(document.createTextNode(value[cnt][1]));
            td.appendChild(a);
        }
    }
    tr.appendChild(td);
}

// add a line in the result table
function add_tr(table, items) {
    var tr = document.createElement("tr");
    for(cnt in items) {
        add_td(tr, items[cnt], cnt>=3);
    }
    table.appendChild(tr);
}

// init the result window
self.port.on('message', function(param) {
    var tbody = document.getElementById("result");
    param.sort(function(a, b) { return a[1]-b[1];})
    for(cnt in param) {
        var links = new Array();
        links.push(["http://jisho.org/search/"+param[cnt][0], "En"]);
        links.push(["http://kanji.free.fr/kanji.php?utf8="+param[cnt][0], "Fr"]);
        param[cnt].push(links);
        add_tr(tbody, param[cnt])
    }
});
