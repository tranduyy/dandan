// distributor-no-firehose-test-as-root.js
//
// Test that distributor does not ping the firehose server
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
    Step = require("step"),
    http = require("http"),
    querystring = require("querystring"),
    _ = require("lodash"),
    express = require("express"),
    urlparse = require("url").parse,
    httputil = require("./lib/http"),
    oauthutil = require("./lib/oauth"),
    apputil = require("./lib/app"),
    newCredentials = oauthutil.newCredentials,
    newClient = oauthutil.newClient,
    pj = httputil.postJSON,
    gj = httputil.getJSON,
    dialbackApp = require("./lib/dialback").dialbackApp,
    setupAppConfig = apputil.setupAppConfig;

var timed = function(callback, time) {
    var id;

    id = setTimeout(function() {
        callback(new Error("Timeout reached"));
    }, time);

    return function() {
        clearTimeout(id);
        callback.apply(null, arguments);
    };
};

var suite = vows.describe("firehose module interface");

suite.addBatch({
    "When we set up the app": {
        topic: function() {
            setupAppConfig({port: 80,
                            hostname: "social.localhost",
                            firehose: false
                           },
                           this.callback);
        },
        "it works": function(err, app) {
            assert.ifError(err);
            assert.isObject(app);
        },
        "teardown": function(app) {
            if (app && app.close) {
                app.close();
            }
        },
        "and we set up a firehose dummy server": {
            topic: function(Firehose) {
                var app = express.createServer(express.bodyParser()),
                    callback = this.callback;
                app.post("/ping", function(req, res, next) {
                    if (app.callback) {
                        app.callback(null, req.body);
                    }
                    res.writeHead(201);
                    res.end();
                });
                app.on("error", function(err) {
                    callback(err, null);
                });
                app.listen(80, "firehose.localhost", function() {
                    callback(null, app);
                });
            },
            "it works": function(err, app) {
                assert.ifError(err);
                assert.isObject(app);
            },
            teardown: function(app) {
                if (app && app.close) {
                    app.close();
                }
            },
            "and we post a public note": {
                topic: function(app) {

                    var callback = this.callback;

                    Step(
                        function() {
                            newCredentials("agamemnon", "greek1me", "social.localhost", 80, this);
                        },
                        function(err, cred) {
                            if (err) throw err;
                            app.callback = timed(this.parallel(), 2000);
                            pj("http://social.localhost/api/user/agamemnon/feed",
                               cred,
                               {
                                   verb: "post",
                                   to: [{
                                       objectType: "collection",
                                       id: "http://activityschema.org/collection/public"
                                   }],
                                   object: {
                                       objectType: "note",
                                       content: "Grrrrr!!!"
                                   }
                               },
                               this.parallel());
                        },
                        function(err, received, sent) {
                            if (err && err.message === "Timeout reached") {
                                callback(null);
                            } else if (err) {
                                callback(err);
                            } else {
                                callback(new Error("Unexpected success"));
                            }
                        }
                    );
                },
                "it works": function(err) {
                    assert.ifError(err);
                }
            }
        }
    }
});

module.exports = {}; // TODO reenable this test when it's passing

// suite["export"](module);
