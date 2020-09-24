// server-header-e2e-test.js
//
// Test that the Server: header is being correctly set
//
// Copyright 2013, E14N https://e14n.com/
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

var assert = require("assert"),
    vows = require("vows"),
    fs = require("fs"),
    path = require("path"),
    _ = require("lodash"),
    version = require("../lib/version").version,
    oauthutil = require("./lib/oauth"),
    apputil = require("./lib/app"),
    httputil = require("./lib/http"),
    withAppSetup = apputil.withAppSetup;

var ignore = function(err) {};

var suite = vows.describe("Server: header");

var tc = _.clone(require("./config.json"));

suite.addBatch(
    withAppSetup({
        "and we HEAD the home page": {
            topic: function(app) {
                httputil.head("http://localhost:4815/", this.callback);
            },
            "it works": function(err, res, body) {
                assert.ifError(err);
            },
            "headers include our Server: header": function(err, res, body) {
                assert.isObject(res.headers);
                assert.include(res.headers, "server");
                assert.match(res.headers.server, new RegExp("pump.io/"+version));
            }
        }
    })
);

suite["export"](module);
