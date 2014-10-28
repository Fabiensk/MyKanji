// The main module of the MyKanji Add-on.

/*
  Copyright 2014 Fabien Shum-King
  Contact : contact [.at.] fabsk.eu
  
  ******* BEGIN LICENSE BLOCK *****
  
  Contact : contact [.at.] fabsk.eu
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
  
  **** END LICENSE BLOCK ***** */

var ActionButton = require("sdk/ui").ActionButton;
var data = require("sdk/self").data;

var simpleStorage = require('sdk/simple-storage');
if (!simpleStorage.storage.mykanjis)
    simpleStorage.storage.mykanjis = {};

var cm = require("sdk/context-menu");

var _ = require("sdk/l10n").get;

var sql;

// get the level of each kanji. Called "recursively" because
// DB query is async
function getLevels(page_kanjis, newkanjis){
    var keys = Object.keys(page_kanjis);
    // finished queries, display results
    if (keys.length==0) {
        tabs.open({
            url: data.url('result.html'),
            onReady: function(tab)
            {
                var worker = tab.attach({
                    contentScriptFile: data.url("result.js")
                });
                worker.port.emit("message", newkanjis);
            }});
        return;

        var panels = require('sdk/panel');
        var resultDlg = panels.Panel({
	        width: 640,
	        height: 500,
	        contentURL: data.url('result.html'),
	        contentScriptFile: [ 
	            data.url('result.js')
	        ],
	        onShow: function() {
	            this.postMessage(newkanjis);
	        }
        });
        resultDlg.show();
        return;
    }

    // continue queries
    var kanji = keys[0];
    var count = page_kanjis[kanji];
    delete page_kanjis[kanji]
    var query = "select level from allkanji where kanji='"+kanji+"'";
    // console.log(query);
    sql.execute(query,function(result,status){
        var level = 100;
        for(var i=0;i<result.rows;i++){
            for(var j=0;j<result.cols;j++){
                level = result.data[i][j];
                // console.log(level);
            }
        }
        newkanjis.push([kanji, level, count]);
        getLevels(page_kanjis, newkanjis);
    });    
}

var tabs = require("sdk/tabs");

// when the contextual menu is displayed
// display the unknown kanjis
var selection = require("sdk/selection");
function onMenuMessage() {
    if (!selection.text) {
        return;
    }
    var text = selection.text;
    var newkanjis = new Array();
    var mykanjis = simpleStorage.storage.mykanjis;

    var page_kanjis = {};
    for(cnt in text) {
        var kanji = text[cnt];
        var code = kanji.charCodeAt(0);
        if (code >= 13312 && code <= 40959 && 
           !(kanji in simpleStorage.storage.mykanjis)) {
            if (kanji in page_kanjis) {
                page_kanjis[kanji] += 1;
            } else {
                page_kanjis[kanji] = 1;
            }
        }
    }
    getLevels(page_kanjis, new Array());
}

// executed on addon init
exports.main = function() {

    // open the DB
    var sqlpath = "extensions" + "/" + require("sdk/self").id + "/resources/mykanji/data/allkanji.sqlite";
    sql = require("sqlite")
    sql.connectRelative(sqlpath);

    // icon in the module bar
    new ActionButton({
        id: "MyKanji",
        label: _("product_name"),
        icon: "./kanji.png",
        // Add a function to trigger when the Widget is clicked.
        onClick: doConfig
    });

    // context menu on selection
    cm.Item({
        label: _("product_name"),
        image: data.url("kanji.png"),
        context: cm.SelectionContext(),
        contentScript: 'self.on("click", function(){self.postMessage()});',
        onMessage: onMenuMessage
    });
};

// display the config panel when icon is clicked
function doConfig(evt) {
    var panels = require('sdk/panel');
    var configDlg = panels.Panel({
	width: 640,
	height: 500,
	contentURL: data.url('config.html'),
	contentScriptFile: [ 
	data.url('config.js')
	],
	// messages from the config panel
	    onMessage: function(params) {
            // save the known kanjis into a storage
            if (Object.keys(params).length>0) {
                simpleStorage.storage.mykanjis = params;
            }
            this.destroy();
	},
	onShow: function() {		    
	    this.postMessage(simpleStorage.storage.mykanjis);
	}
    });
    configDlg.show();
}


// cleanup
exports.onUnload = function() {
    console.log("close");
    sql.close();
}
