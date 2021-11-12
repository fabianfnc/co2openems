import { JsonrpcRequest } from '../../../../shared/jsonrpc/base';

/**
 * Exports Channels with current value and metadata to an Excel (xlsx) file.
 * 
 * <pre>
 * {
 *   "jsonrpc": "2.0",
 *   "id": "UUID",
 *   "method": "channelExportXlsx",
 *   "params": {
 *   	"componentId": string
 *   }
 * }
 * </pre>
 */
export class ChannelExportXlsxRequest extends JsonrpcRequest {

    static METHOD: string = "channelExportXlsx";

    public constructor(
        public readonly params: {
            componentId: string
        }
    ) {
        super(ChannelExportXlsxRequest.METHOD, params);
    }

}