// xssblacklist.js
//
// Middleware to serve an error page to browsers with XSS problems
//
// Copyright 2016 AJ Jordan <alex@strugee.net>
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

var uaParser = require("ua-parser-js");

var xssCheck = function(req, res, next) {
    var ua = uaParser(req.headers["user-agent"]);

    // TODO: this also affects /shared
    if (ua.browser.name === "IE" && Number(ua.browser.major) < 11) {
        res.status(400);
        res.render("xss-error", {page: {title: "Security error"}});
        return;
    }

    next();
};

exports.xssCheck = xssCheck;
