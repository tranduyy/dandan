// mailer.js
//
// mail-sending functionality for pump.io
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

var _ = require("lodash"),
    email = require("emailjs");

var Mailer = {},
    maillog,
    from,
    smtp,
    q;

Mailer.setup = function(config, log) {

    var hostname = config.hostname;
    var mailopts = {
        user: config.smtpuser,
        password: config.smtppass,
        host: config.smtpserver,
        port: config.smtpport,
        ssl: config.smtpusessl,
        tls: config.smtpusetls,
        timeout: config.smtptimeout,
        domain: hostname
    };

    maillog = log.child({component: "mail"});

    from = config.smtpfrom;

    maillog.debug(_.omit(mailopts, "password"), "Connecting to SMTP server");

    smtp = email.server.connect(mailopts);
};

Mailer.sendEmail = function(props, callback) {

    var message = _.extend({"from": from}, props);

    maillog.debug({to: message.to || null,
                   subject: message.subject || null}, "Sending email");

    smtp.send(message, function(err, results) {
        if (err) {
            maillog.error(err);
            maillog.error({to: message.to || null,
                           subject: message.subject || null,
                           message: err.message},
                          "Email error");
            callback(err, null);
        } else {
            maillog.info({to: message.to || null,
                          subject: message.subject || null},
                         "Message sent");
            callback(null, results);
        }
    });
};

module.exports = Mailer;
