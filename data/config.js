// init the result window
self.on('message', function(param) {
    var result = document.getElementById("textarea");
    var kanjis = "";
    for(k in param) {
        kanjis += k;
    }
    result.value = kanjis;
});

document.getElementById("btn-update").addEventListener("click", function(){
    var text = document.getElementById('textarea').value;
    var kanjis = {};
    for (cnt in text) {
        var code = text.charCodeAt(cnt);
        if (code >= 13312 && code <= 40959) {
            kanjis[text[cnt]] = null;
        }
    }
    self.postMessage(kanjis);
});

