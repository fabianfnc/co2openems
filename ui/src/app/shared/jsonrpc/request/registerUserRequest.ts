import { JsonrpcRequest } from "../base";

/**
 * <pre>
 * {
 *   "jsonrpc": "2.0",
 *   "id": UUID,
 *   "method": "addEdgeToUser",
 *   "params": {
 *     "user": {
 *       "companyName": string,
 *       "firstname": string,
 *       "lastname": string,
 *       "street": string,
 *       "zip": string,
 *       "city": string,
 *       "country": string,
 *       "phone": string,
 *       "email": string,
 *       "password": string,
 *       "confirmPassword": string
 *     }
 *   }
 * }
 * </pre>
 */
export class RegisterUserRequest extends JsonrpcRequest {

    static METHOD: string = "registerUser";

    public constructor(
        public readonly params: {
            user: {
                firstname: string,
                lastname: string,
                phone: string,
                email: string,
                password: string,
                confirmPassword: string,
                address: {
                    street: string,
                    zip: string,
                    city: string,
                    country: string
                },
                company?: {
                    name: string
                },
                role: string
            }
        }
    ) {
        super(RegisterUserRequest.METHOD, params);
    }

}