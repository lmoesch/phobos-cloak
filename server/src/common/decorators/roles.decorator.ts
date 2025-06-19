import { ROLES_METADATA } from "../constants";

export function Roles(roles: string[]): MethodDecorator {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(ROLES_METADATA, roles, descriptor.value);
        return descriptor;
    };
}