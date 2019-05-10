/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { AbstractSession, ImperativeExpect, Logger, RestClient } from "@zowe/imperative";
import { MQMessages } from "../constants/MQ.messages";
import { MQConstants } from "../constants/MQ.constants";
import { IHeaderContent } from "@zowe/cli";
import { IMQResponse } from "../doc/IMQResponse";
import { MQRestClient } from "../rest/MQRestClient";
import { posix } from "path";

/**
 * Class of utility file APIs for usage within the CLI and programmatically from node scripts.
 * @export
 * @class Command
 */
export default class MQSCCommand {
    /**
     * Runs the specified MQSC command on the specified queue manager.
     * @param {AbstractSession}  session      - MQ connection info
     * @param {string} queueMgrName - The Queue manager to apply command to
     * @param {string} command - The command to be run.
     * @param {string} csrfHeader - The CSRF protection header, optional.
     * @throws ImperativeError
     * @memberof Command
     */
    public static async qmgrAction(session: AbstractSession, queueMgrName: string, thecommand: string): Promise<IMQResponse> {
        const csrfHeader: string = "true";
        ImperativeExpect.toNotBeNullOrUndefined(queueMgrName, MQMessages.missingQueueManagerName.message);
        ImperativeExpect.toNotBeEqual(queueMgrName, "", MQMessages.missingQueueManagerName.message);
        ImperativeExpect.toNotBeNullOrUndefined(thecommand, MQMessages.missingCommand.message);
        ImperativeExpect.toNotBeEqual(thecommand, "", MQMessages.missingCommand.message);

        const endpoint = posix.join(MQConstants.RESOURCE, MQConstants.RES_QUEUE_MANAGER_COMMAND, queueMgrName, MQConstants.RES_QUEUE_MANAGER_ACTION);

        const payload: any = { type: "runCommand", parameters: { command: thecommand } };

        const headers: IHeaderContent[] = csrfHeader
            ? [{"Content-Type": "application/json"}, {"ibm-mq-rest-csrf-token": csrfHeader}]
            : [{"Content-Type": "application/json"}];

        const content: IMQResponse = await MQRestClient.postExpectJSON<IMQResponse>(session, endpoint, headers, payload);

        return content;
    }
}