// task.js
//
// data object representing an task
//
// Copyright 2012, E14N https://e14n.com/
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
    DatabankObject = require("databank").DatabankObject,
    ActivityObject = require("./activityobject").ActivityObject;

var Task = DatabankObject.subClass("task", ActivityObject);

Task.schema = ActivityObject.subSchema(null,
                                       ["actor",
                                        "by",
                                        "object",
                                        "prerequisites",
                                        "required",
                                        "supersedes",
                                        "verb"]);

exports.Task = Task;
