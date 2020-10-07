import getDecorators from "inversify-inject-decorators";
import {container} from "./container";

const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = getDecorators(container);

export {
    lazyInject,
    lazyInjectNamed,
    lazyInjectTagged,
    lazyMultiInject
};