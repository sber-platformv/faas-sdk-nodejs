// Copyright 2022 АО «СберТех»
//
// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as assert from "assert";
import { resolve } from "path";
import { parseOptions, FrameworkOptions } from "../src/options";

describe("parseOptions", () => {
    interface TestData {
        name: string;
        cliOpts: string[];
        envVars: { [key: string]: string };
        expectedOptions: Partial<FrameworkOptions>;
    }

    const testData: TestData[] = [
        {
            name: "parses the cli --help option",
            cliOpts: ["bin/node", "/index.js", "--help"],
            envVars: {},
            expectedOptions: {
                printHelp: true
            }
        },
        {
            name: "parses the cli -h option",
            cliOpts: ["bin/node", "/index.js", "-h"],
            envVars: {},
            expectedOptions: {
                printHelp: true
            }
        },
        {
            name: "sets the correct defaults for all options",
            cliOpts: ["bin/node", "/index.js"],
            envVars: {},
            expectedOptions: {
                serverPort: "8082",
                targetFunction: "handler",
                sourceLocation: resolve("handlers/handler.js"),
                printHelp: false
            }
        },
        {
            name: "respects all cli flags",
            cliOpts: ["bin/node", "/index.js", "--port", "1234", "--target=helloWorld", "--source=/source"],
            envVars: {},
            expectedOptions: {
                serverPort: "1234",
                targetFunction: "helloWorld",
                sourceLocation: resolve("/source"),
                printHelp: false
            }
        },
        {
            name: "respects all env vars",
            cliOpts: ["bin/node", "/index.js"],
            envVars: {
                PORT: "1234",
                FUNCTION_TARGET: "helloWorld",
                FUNCTION_SOURCE: "/source"
            },
            expectedOptions: {
                serverPort: "1234",
                targetFunction: "helloWorld",
                sourceLocation: resolve("/source"),
                printHelp: false
            }
        },
        {
            name: "prioritizes cli flags over env vars",
            cliOpts: ["bin/node", "/index.js", "--port", "1234", "--target=helloWorld", "--source=/source"],
            envVars: {
                PORT: "4567",
                FUNCTION_TARGET: "fooBar",
                FUNCTION_SOURCE: "/somewhere/else"
            },
            expectedOptions: {
                serverPort: "1234",
                targetFunction: "helloWorld",
                sourceLocation: resolve("/source"),
                printHelp: false
            }
        }
    ];

    testData.forEach((testCase) => {
        it(testCase.name, () => {
            const options = parseOptions(testCase.cliOpts, testCase.envVars);
            const { expectedOptions } = testCase;
            let opt: keyof FrameworkOptions;
            for (opt in expectedOptions) {
                assert.deepStrictEqual(expectedOptions[opt], options[opt]);
            }
        });
    });
});
