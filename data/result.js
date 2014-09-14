
// init the result window
self.on('message', function(param) {
    var result = document.getElementById("result");
    param.sort(function(a, b) { return a[1]-b[1];})
    for(cnt in param) {
        var div = document.createElement("div");
        var label = param[cnt][0] + " : " + param[cnt][1];
        div.appendChild(document.createTextNode(label));
        result.appendChild(div);
    }
});
