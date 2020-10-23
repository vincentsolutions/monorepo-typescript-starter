import {Global, Module} from '@nestjs/common';
import {Gateway} from "./gateway.service";

@Global()
@Module({
    providers: [Gateway],
    exports: [Gateway]
})
export class GatewayModule {}
