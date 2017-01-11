/// <reference path="../lib/node.d.ts" />
/// <reference path="../lib/bluebird.d.ts" />
export declare class TraceError {
    innerError: any;
    message: string;
    constructor(message?: string, innerError?: any);
    toString(): string;
}
export declare class Device {
    static overrideSysClassDir: string;
    private static eventTimerInterval;
    deviceRoot: string;
    deviceDirName: string;
    connected: boolean;
    private sysClassDir;
    private pendingEventRequests;
    private eventTimerCancellationToken;
    connect(driverName: string, nameConvention?: string, propertyConstraints?: {
        [propertyName: string]: any;
    }): void;
    protected constructPropertyPath(property: string, deviceRoot?: string): string;
    readNumber(property: string, deviceRoot?: string): number;
    readString(property: string, deviceRoot?: string): string;
    readStringAsType<T>(property: string, deviceRoot?: string): T;
    readStringArray(property: string, deviceRoot?: string): string[];
    readStringArrayAsType<T>(property: string, deviceRoot?: string): T[];
    readStringSelector(property: string, deviceRoot?: string): string;
    readProperty(property: string, deviceRoot?: string): any;
    setProperty(property: string, value: any): any;
    setNumber(property: string, value: number): void;
    setString(property: string, value: string): void;
    set(propertyDefs: any): void;
    private updatePendingEventRequests();
    private updateEventTimerState();
    registerEventCallback(callbackFunction: (err?: Error, userData?: any) => void, eventPredicate: (userData?: any) => boolean, firstTriggerOnly?: boolean, userCallbackData?: any): void;
    registerEventPromise(eventPredicate: (userData?: any) => boolean, userCallbackData?: any): Promise<any>;
}
export declare class IndexedDevice extends Device {
    protected deviceIndexRegex: RegExp;
    protected _deviceIndex: number;
    deviceIndex: number;
    constructor(driverTypeDirName: string, nameConvention?: string, targetAddress?: string, targetDriverName?: string | string[]);
}
