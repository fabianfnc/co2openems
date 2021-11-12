import { JsonrpcResponseSuccess } from "../../../shared/jsonrpc/base";
import { NetworkInterface } from './shared';

/**
 * JSON-RPC Response to "getNetworkConfig" Request.
 * 
 * <p>
 * 
 * <pre>
 * {
 *   "jsonrpc": "2.0",
 *   "id": "UUID",
 *   "result": {
 *     "interfaces": {
 *       [name: string]: {
 *         "dhcp": boolean,
 *         "linkLocalAddressing": boolean,
 *         "gateway": string,
 *         "dns": string,
 *         "addresses": string[]
 *       }
 *     }
 *   }
 * }
 * </pre>
 */
export class GetNetworkConfigResponse extends JsonrpcResponseSuccess {

    public constructor(
        public readonly id: string,
        public readonly result: {
            interfaces: {
                [name: string]: NetworkInterface
            }
        }
    ) {
        super(id, result);
    }
}