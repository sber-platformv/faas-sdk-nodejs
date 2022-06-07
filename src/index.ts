#!/usr/bin/env node

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

import { getServer } from "./server";
import { getUserFunction } from "./loader";
import { helpText, parseOptions } from "./options";

const main = async () => {
    const options = parseOptions();

    if (options.printHelp) {
        console.error(helpText);
        return;
    }

    const { targetFunction, serverPort, sourceLocation } = options;

    const userFunction = await getUserFunction(sourceLocation, targetFunction!);

    if (!userFunction) {
        console.error('Could not load the function, shutting down.');
        process.exit(1);
    }

    const server = await getServer(userFunction!, sourceLocation);

    server.listen(serverPort, () => {
        console.log(`Function: ${targetFunction}\n🚀 Function ready at http://localhost:${serverPort}`);
    });
};

main();
