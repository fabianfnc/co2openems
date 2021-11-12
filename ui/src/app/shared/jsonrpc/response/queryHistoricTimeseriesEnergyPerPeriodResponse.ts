import { JsonrpcResponseSuccess } from "../base";

/**
 * Wraps a JSON-RPC Response for a queryHistoricTimeseriesEnergy.
 * 
 * <pre>
 * {
 *   "jsonrpc": "2.0",
 *   "id": UUID,
 *   "result": {
 *     "data": Cumulated
 *     }
 * }
 * </pre>
 */
export class queryHistoricTimeseriesEnergyPerPeriodResponse extends JsonrpcResponseSuccess {

    public constructor(
        public readonly id: string,
        public readonly result: {
            timestamps: string[],
            data: { [channelAddress: string]: any[] }
        }
    ) {
        super(id, result);
    }
}