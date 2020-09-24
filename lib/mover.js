// lib/mover.js
//
// Move files from one place on disk to another
//
// Copyright 2012,2013 E14N https://e14n.com/
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

var Step = require("step"),
    fs = require("fs"),
    _ = require("lodash");

var safeMove = function(oldName, newName, callback) {

    Step(
        function() {
            fs.rename(oldName, newName, this);
        },
        function(err) {
            if (err) {
                if (err.code === "EXDEV") {
                    slowMove(oldName, newName, this);
                } else {
                    throw err;
                }
            } else {
                this(null);
            }
        },
        callback
    );
};

var slowMove = function(oldName, newName, callback) {

    var rs,
        ws,
        onClose = function() {
            clear();
            callback(null);
        },
        onError = function(err) {
            clear();
            callback(err);
        },
        clear = function() {
            rs.removeListener("error", onError);
            ws.removeListener("error", onError);
            ws.removeListener("close", onClose);
        };

    try {
        rs = fs.createReadStream(oldName);
        ws = fs.createWriteStream(newName);
    } catch (err) {
        callback(err);
        return;
    }

    ws.on("close", onClose);
    rs.on("error", onError);
    ws.on("error", onError);

    rs.pipe(ws);
};

exports.safeMove = safeMove;
