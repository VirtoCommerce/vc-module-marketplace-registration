export declare class AuthApiBase {
    authToken: string;
    protected constructor();
    getBaseUrl(defaultUrl: string, baseUrl: string): string;
    setAuthToken(token: string): void;
    protected transformOptions(options: any): Promise<any>;
}
export declare class VcmpRegistrationRequestClient extends AuthApiBase {
    private http;
    private baseUrl;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    /**
     * @param body (optional)
     * @return OK
     */
    search(body?: SearchRegistrationRequestQuery | undefined): Promise<SearchRegistrationRequestResult>;
    protected processSearch(response: Response): Promise<SearchRegistrationRequestResult>;
    /**
     * @param body (optional)
     * @return OK
     */
    createRegistrationRequest(body?: CreateRegistrationRequestCommand | undefined): Promise<RegistrationRequest>;
    protected processCreateRegistrationRequest(response: Response): Promise<RegistrationRequest>;
    /**
     * @param body (optional)
     * @return OK
     */
    updateRegistrationRequest(body?: UpdateRegistrationRequestCommand | undefined): Promise<RegistrationRequest>;
    protected processUpdateRegistrationRequest(response: Response): Promise<RegistrationRequest>;
}
export declare class CreateRegistrationRequestCommand implements ICreateRegistrationRequestCommand {
    firstName: string;
    lastName: string;
    organizationName: string;
    contactEmail: string;
    contactPhone?: string | undefined;
    constructor(data?: ICreateRegistrationRequestCommand);
    init(_data?: any): void;
    static fromJS(data: any): CreateRegistrationRequestCommand;
    toJSON(data?: any): any;
}
export interface ICreateRegistrationRequestCommand {
    firstName: string;
    lastName: string;
    organizationName: string;
    contactEmail: string;
    contactPhone?: string | undefined;
}
export declare class DynamicObjectProperty implements IDynamicObjectProperty {
    objectId?: string | undefined;
    values?: DynamicPropertyObjectValue[] | undefined;
    name?: string | undefined;
    description?: string | undefined;
    objectType?: string | undefined;
    isArray?: boolean;
    isDictionary?: boolean;
    isMultilingual?: boolean;
    isRequired?: boolean;
    displayOrder?: number | undefined;
    valueType?: DynamicObjectPropertyValueType;
    displayNames?: DynamicPropertyName[] | undefined;
    createdDate?: Date;
    modifiedDate?: Date | undefined;
    createdBy?: string | undefined;
    modifiedBy?: string | undefined;
    id?: string | undefined;
    constructor(data?: IDynamicObjectProperty);
    init(_data?: any): void;
    static fromJS(data: any): DynamicObjectProperty;
    toJSON(data?: any): any;
}
export interface IDynamicObjectProperty {
    objectId?: string | undefined;
    values?: DynamicPropertyObjectValue[] | undefined;
    name?: string | undefined;
    description?: string | undefined;
    objectType?: string | undefined;
    isArray?: boolean;
    isDictionary?: boolean;
    isMultilingual?: boolean;
    isRequired?: boolean;
    displayOrder?: number | undefined;
    valueType?: DynamicObjectPropertyValueType;
    displayNames?: DynamicPropertyName[] | undefined;
    createdDate?: Date;
    modifiedDate?: Date | undefined;
    createdBy?: string | undefined;
    modifiedBy?: string | undefined;
    id?: string | undefined;
}
export declare class DynamicPropertyName implements IDynamicPropertyName {
    locale?: string | undefined;
    name?: string | undefined;
    constructor(data?: IDynamicPropertyName);
    init(_data?: any): void;
    static fromJS(data: any): DynamicPropertyName;
    toJSON(data?: any): any;
}
export interface IDynamicPropertyName {
    locale?: string | undefined;
    name?: string | undefined;
}
export declare class DynamicPropertyObjectValue implements IDynamicPropertyObjectValue {
    objectType?: string | undefined;
    objectId?: string | undefined;
    locale?: string | undefined;
    value?: any | undefined;
    valueId?: string | undefined;
    valueType?: DynamicPropertyObjectValueValueType;
    propertyId?: string | undefined;
    propertyName?: string | undefined;
    constructor(data?: IDynamicPropertyObjectValue);
    init(_data?: any): void;
    static fromJS(data: any): DynamicPropertyObjectValue;
    toJSON(data?: any): any;
}
export interface IDynamicPropertyObjectValue {
    objectType?: string | undefined;
    objectId?: string | undefined;
    locale?: string | undefined;
    value?: any | undefined;
    valueId?: string | undefined;
    valueType?: DynamicPropertyObjectValueValueType;
    propertyId?: string | undefined;
    propertyName?: string | undefined;
}
export declare enum DynamicPropertyValueType {
    Undefined = "Undefined",
    ShortText = "ShortText",
    LongText = "LongText",
    Integer = "Integer",
    Decimal = "Decimal",
    DateTime = "DateTime",
    Boolean = "Boolean",
    Html = "Html",
    Image = "Image"
}
export declare class RegistrationRequest implements IRegistrationRequest {
    firstName?: string | undefined;
    lastName?: string | undefined;
    organizationName?: string | undefined;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
    status?: string | undefined;
    declineReason?: string | undefined;
    objectType?: string | undefined;
    dynamicProperties?: DynamicObjectProperty[] | undefined;
    createdDate?: Date;
    modifiedDate?: Date | undefined;
    createdBy?: string | undefined;
    modifiedBy?: string | undefined;
    id?: string | undefined;
    constructor(data?: IRegistrationRequest);
    init(_data?: any): void;
    static fromJS(data: any): RegistrationRequest;
    toJSON(data?: any): any;
}
export interface IRegistrationRequest {
    firstName?: string | undefined;
    lastName?: string | undefined;
    organizationName?: string | undefined;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
    status?: string | undefined;
    declineReason?: string | undefined;
    objectType?: string | undefined;
    dynamicProperties?: DynamicObjectProperty[] | undefined;
    createdDate?: Date;
    modifiedDate?: Date | undefined;
    createdBy?: string | undefined;
    modifiedBy?: string | undefined;
    id?: string | undefined;
}
export declare class SearchRegistrationRequestQuery implements ISearchRegistrationRequestQuery {
    responseGroup?: string | undefined;
    objectType?: string | undefined;
    objectTypes?: string[] | undefined;
    objectIds?: string[] | undefined;
    keyword?: string | undefined;
    searchPhrase?: string | undefined;
    languageCode?: string | undefined;
    sort?: string | undefined;
    readonly sortInfos?: SortInfo[] | undefined;
    skip?: number;
    take?: number;
    constructor(data?: ISearchRegistrationRequestQuery);
    init(_data?: any): void;
    static fromJS(data: any): SearchRegistrationRequestQuery;
    toJSON(data?: any): any;
}
export interface ISearchRegistrationRequestQuery {
    responseGroup?: string | undefined;
    objectType?: string | undefined;
    objectTypes?: string[] | undefined;
    objectIds?: string[] | undefined;
    keyword?: string | undefined;
    searchPhrase?: string | undefined;
    languageCode?: string | undefined;
    sort?: string | undefined;
    sortInfos?: SortInfo[] | undefined;
    skip?: number;
    take?: number;
}
export declare class SearchRegistrationRequestResult implements ISearchRegistrationRequestResult {
    totalCount?: number;
    results?: RegistrationRequest[] | undefined;
    constructor(data?: ISearchRegistrationRequestResult);
    init(_data?: any): void;
    static fromJS(data: any): SearchRegistrationRequestResult;
    toJSON(data?: any): any;
}
export interface ISearchRegistrationRequestResult {
    totalCount?: number;
    results?: RegistrationRequest[] | undefined;
}
export declare enum SortDirection {
    Ascending = "Ascending",
    Descending = "Descending"
}
export declare class SortInfo implements ISortInfo {
    sortColumn?: string | undefined;
    sortDirection?: SortInfoSortDirection;
    constructor(data?: ISortInfo);
    init(_data?: any): void;
    static fromJS(data: any): SortInfo;
    toJSON(data?: any): any;
}
export interface ISortInfo {
    sortColumn?: string | undefined;
    sortDirection?: SortInfoSortDirection;
}
export declare class UpdateRegistrationRequestCommand implements IUpdateRegistrationRequestCommand {
    id: string;
    comment?: string | undefined;
    constructor(data?: IUpdateRegistrationRequestCommand);
    init(_data?: any): void;
    static fromJS(data: any): UpdateRegistrationRequestCommand;
    toJSON(data?: any): any;
}
export interface IUpdateRegistrationRequestCommand {
    id: string;
    comment?: string | undefined;
}
export declare enum DynamicObjectPropertyValueType {
    Undefined = "Undefined",
    ShortText = "ShortText",
    LongText = "LongText",
    Integer = "Integer",
    Decimal = "Decimal",
    DateTime = "DateTime",
    Boolean = "Boolean",
    Html = "Html",
    Image = "Image"
}
export declare enum DynamicPropertyObjectValueValueType {
    Undefined = "Undefined",
    ShortText = "ShortText",
    LongText = "LongText",
    Integer = "Integer",
    Decimal = "Decimal",
    DateTime = "DateTime",
    Boolean = "Boolean",
    Html = "Html",
    Image = "Image"
}
export declare enum SortInfoSortDirection {
    Ascending = "Ascending",
    Descending = "Descending"
}
export declare class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: {
        [key: string]: any;
    };
    result: any;
    constructor(message: string, status: number, response: string, headers: {
        [key: string]: any;
    }, result: any);
    protected isApiException: boolean;
    static isApiException(obj: any): obj is ApiException;
}
//# sourceMappingURL=virtocommerce.marketplaceregistration.d.ts.map