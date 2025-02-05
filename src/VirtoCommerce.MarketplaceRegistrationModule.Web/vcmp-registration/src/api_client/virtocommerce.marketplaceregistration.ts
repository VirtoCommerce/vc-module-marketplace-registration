//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.20.0.0 (NJsonSchema v10.9.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming
// @ts-nocheck

export class AuthApiBase {
  authToken = "";
  protected constructor() {}

  // Enforce always return empty string as baseUrl
  getBaseUrl(defaultUrl: string, baseUrl: string) {
    return "";
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  protected transformOptions(options: any): Promise<any> {
    if (this.authToken) {
      options.headers["authorization"] = `Bearer ${this.authToken}`;
    }
    return Promise.resolve(options);
  }
}

export class VcmpRegistrationRequestClient extends AuthApiBase {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super();
        this.http = http ? http : window as any;
        this.baseUrl = this.getBaseUrl("", baseUrl);
    }

    /**
     * @param body (optional)
     * @return OK
     */
    search(body?: SearchRegistrationRequestQuery | undefined): Promise<SearchRegistrationRequestResult> {
        let url_ = this.baseUrl + "/api/vcmp/registrationrequest/search";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processSearch(_response);
        });
    }

    protected processSearch(response: Response): Promise<SearchRegistrationRequestResult> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = SearchRegistrationRequestResult.fromJS(resultData200);
            return result200;
            });
        } else if (status === 401) {
            return response.text().then((_responseText) => {
            return throwException("Unauthorized", status, _responseText, _headers);
            });
        } else if (status === 403) {
            return response.text().then((_responseText) => {
            return throwException("Forbidden", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<SearchRegistrationRequestResult>(null as any);
    }

    /**
     * @param body (optional)
     * @return OK
     */
    validateRegistrationRequest(body?: ValidateRegistrationRequestQuery | undefined): Promise<ValidationFailure[]> {
        let url_ = this.baseUrl + "/api/vcmp/registrationrequest/validate";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processValidateRegistrationRequest(_response);
        });
    }

    protected processValidateRegistrationRequest(response: Response): Promise<ValidationFailure[]> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(ValidationFailure.fromJS(item));
            }
            else {
                result200 = <any>null;
            }
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ValidationFailure[]>(null as any);
    }

    /**
     * @param body (optional)
     * @return OK
     */
    createRegistrationRequest(body?: CreateRegistrationRequestCommand | undefined): Promise<RegistrationRequest> {
        let url_ = this.baseUrl + "/api/vcmp/registrationrequest/new";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processCreateRegistrationRequest(_response);
        });
    }

    protected processCreateRegistrationRequest(response: Response): Promise<RegistrationRequest> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = RegistrationRequest.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<RegistrationRequest>(null as any);
    }

    /**
     * @param body (optional)
     * @return OK
     */
    updateRegistrationRequest(body?: UpdateRegistrationRequestCommand | undefined): Promise<RegistrationRequest> {
        let url_ = this.baseUrl + "/api/vcmp/registrationrequest/update";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processUpdateRegistrationRequest(_response);
        });
    }

    protected processUpdateRegistrationRequest(response: Response): Promise<RegistrationRequest> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = RegistrationRequest.fromJS(resultData200);
            return result200;
            });
        } else if (status === 401) {
            return response.text().then((_responseText) => {
            return throwException("Unauthorized", status, _responseText, _headers);
            });
        } else if (status === 403) {
            return response.text().then((_responseText) => {
            return throwException("Forbidden", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<RegistrationRequest>(null as any);
    }
}

export class CreateRegistrationRequestCommand implements ICreateRegistrationRequestCommand {
    firstName!: string;
    lastName!: string;
    organizationName!: string;
    contactEmail!: string;
    contactPhone?: string | undefined;

    constructor(data?: ICreateRegistrationRequestCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.firstName = _data["firstName"];
            this.lastName = _data["lastName"];
            this.organizationName = _data["organizationName"];
            this.contactEmail = _data["contactEmail"];
            this.contactPhone = _data["contactPhone"];
        }
    }

    static fromJS(data: any): CreateRegistrationRequestCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateRegistrationRequestCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["firstName"] = this.firstName;
        data["lastName"] = this.lastName;
        data["organizationName"] = this.organizationName;
        data["contactEmail"] = this.contactEmail;
        data["contactPhone"] = this.contactPhone;
        return data;
    }
}

export interface ICreateRegistrationRequestCommand {
    firstName: string;
    lastName: string;
    organizationName: string;
    contactEmail: string;
    contactPhone?: string | undefined;
}

export class DynamicObjectProperty implements IDynamicObjectProperty {
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

    constructor(data?: IDynamicObjectProperty) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.objectId = _data["objectId"];
            if (Array.isArray(_data["values"])) {
                this.values = [] as any;
                for (let item of _data["values"])
                    this.values!.push(DynamicPropertyObjectValue.fromJS(item));
            }
            this.name = _data["name"];
            this.description = _data["description"];
            this.objectType = _data["objectType"];
            this.isArray = _data["isArray"];
            this.isDictionary = _data["isDictionary"];
            this.isMultilingual = _data["isMultilingual"];
            this.isRequired = _data["isRequired"];
            this.displayOrder = _data["displayOrder"];
            this.valueType = _data["valueType"];
            if (Array.isArray(_data["displayNames"])) {
                this.displayNames = [] as any;
                for (let item of _data["displayNames"])
                    this.displayNames!.push(DynamicPropertyName.fromJS(item));
            }
            this.createdDate = _data["createdDate"] ? new Date(_data["createdDate"].toString()) : <any>undefined;
            this.modifiedDate = _data["modifiedDate"] ? new Date(_data["modifiedDate"].toString()) : <any>undefined;
            this.createdBy = _data["createdBy"];
            this.modifiedBy = _data["modifiedBy"];
            this.id = _data["id"];
        }
    }

    static fromJS(data: any): DynamicObjectProperty {
        data = typeof data === 'object' ? data : {};
        let result = new DynamicObjectProperty();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["objectId"] = this.objectId;
        if (Array.isArray(this.values)) {
            data["values"] = [];
            for (let item of this.values)
                data["values"].push(item.toJSON());
        }
        data["name"] = this.name;
        data["description"] = this.description;
        data["objectType"] = this.objectType;
        data["isArray"] = this.isArray;
        data["isDictionary"] = this.isDictionary;
        data["isMultilingual"] = this.isMultilingual;
        data["isRequired"] = this.isRequired;
        data["displayOrder"] = this.displayOrder;
        data["valueType"] = this.valueType;
        if (Array.isArray(this.displayNames)) {
            data["displayNames"] = [];
            for (let item of this.displayNames)
                data["displayNames"].push(item.toJSON());
        }
        data["createdDate"] = this.createdDate ? this.createdDate.toISOString() : <any>undefined;
        data["modifiedDate"] = this.modifiedDate ? this.modifiedDate.toISOString() : <any>undefined;
        data["createdBy"] = this.createdBy;
        data["modifiedBy"] = this.modifiedBy;
        data["id"] = this.id;
        return data;
    }
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

export class DynamicPropertyName implements IDynamicPropertyName {
    locale?: string | undefined;
    name?: string | undefined;

    constructor(data?: IDynamicPropertyName) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.locale = _data["locale"];
            this.name = _data["name"];
        }
    }

    static fromJS(data: any): DynamicPropertyName {
        data = typeof data === 'object' ? data : {};
        let result = new DynamicPropertyName();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["locale"] = this.locale;
        data["name"] = this.name;
        return data;
    }
}

export interface IDynamicPropertyName {
    locale?: string | undefined;
    name?: string | undefined;
}

export class DynamicPropertyObjectValue implements IDynamicPropertyObjectValue {
    objectType?: string | undefined;
    objectId?: string | undefined;
    locale?: string | undefined;
    value?: any | undefined;
    valueId?: string | undefined;
    valueType?: DynamicPropertyObjectValueValueType;
    propertyId?: string | undefined;
    propertyName?: string | undefined;

    constructor(data?: IDynamicPropertyObjectValue) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.objectType = _data["objectType"];
            this.objectId = _data["objectId"];
            this.locale = _data["locale"];
            this.value = _data["value"];
            this.valueId = _data["valueId"];
            this.valueType = _data["valueType"];
            this.propertyId = _data["propertyId"];
            this.propertyName = _data["propertyName"];
        }
    }

    static fromJS(data: any): DynamicPropertyObjectValue {
        data = typeof data === 'object' ? data : {};
        let result = new DynamicPropertyObjectValue();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["objectType"] = this.objectType;
        data["objectId"] = this.objectId;
        data["locale"] = this.locale;
        data["value"] = this.value;
        data["valueId"] = this.valueId;
        data["valueType"] = this.valueType;
        data["propertyId"] = this.propertyId;
        data["propertyName"] = this.propertyName;
        return data;
    }
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

export enum DynamicPropertyValueType {
    Undefined = "Undefined",
    ShortText = "ShortText",
    LongText = "LongText",
    Integer = "Integer",
    Decimal = "Decimal",
    DateTime = "DateTime",
    Boolean = "Boolean",
    Html = "Html",
    Image = "Image",
}

export class RegistrationRequest implements IRegistrationRequest {
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

    constructor(data?: IRegistrationRequest) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.firstName = _data["firstName"];
            this.lastName = _data["lastName"];
            this.organizationName = _data["organizationName"];
            this.contactEmail = _data["contactEmail"];
            this.contactPhone = _data["contactPhone"];
            this.status = _data["status"];
            this.declineReason = _data["declineReason"];
            this.objectType = _data["objectType"];
            if (Array.isArray(_data["dynamicProperties"])) {
                this.dynamicProperties = [] as any;
                for (let item of _data["dynamicProperties"])
                    this.dynamicProperties!.push(DynamicObjectProperty.fromJS(item));
            }
            this.createdDate = _data["createdDate"] ? new Date(_data["createdDate"].toString()) : <any>undefined;
            this.modifiedDate = _data["modifiedDate"] ? new Date(_data["modifiedDate"].toString()) : <any>undefined;
            this.createdBy = _data["createdBy"];
            this.modifiedBy = _data["modifiedBy"];
            this.id = _data["id"];
        }
    }

    static fromJS(data: any): RegistrationRequest {
        data = typeof data === 'object' ? data : {};
        let result = new RegistrationRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["firstName"] = this.firstName;
        data["lastName"] = this.lastName;
        data["organizationName"] = this.organizationName;
        data["contactEmail"] = this.contactEmail;
        data["contactPhone"] = this.contactPhone;
        data["status"] = this.status;
        data["declineReason"] = this.declineReason;
        data["objectType"] = this.objectType;
        if (Array.isArray(this.dynamicProperties)) {
            data["dynamicProperties"] = [];
            for (let item of this.dynamicProperties)
                data["dynamicProperties"].push(item.toJSON());
        }
        data["createdDate"] = this.createdDate ? this.createdDate.toISOString() : <any>undefined;
        data["modifiedDate"] = this.modifiedDate ? this.modifiedDate.toISOString() : <any>undefined;
        data["createdBy"] = this.createdBy;
        data["modifiedBy"] = this.modifiedBy;
        data["id"] = this.id;
        return data;
    }
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

export class SearchRegistrationRequestQuery implements ISearchRegistrationRequestQuery {
    contactEmail?: string | undefined;
    statuses?: string[] | undefined;
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

    constructor(data?: ISearchRegistrationRequestQuery) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.contactEmail = _data["contactEmail"];
            if (Array.isArray(_data["statuses"])) {
                this.statuses = [] as any;
                for (let item of _data["statuses"])
                    this.statuses!.push(item);
            }
            this.responseGroup = _data["responseGroup"];
            this.objectType = _data["objectType"];
            if (Array.isArray(_data["objectTypes"])) {
                this.objectTypes = [] as any;
                for (let item of _data["objectTypes"])
                    this.objectTypes!.push(item);
            }
            if (Array.isArray(_data["objectIds"])) {
                this.objectIds = [] as any;
                for (let item of _data["objectIds"])
                    this.objectIds!.push(item);
            }
            this.keyword = _data["keyword"];
            this.searchPhrase = _data["searchPhrase"];
            this.languageCode = _data["languageCode"];
            this.sort = _data["sort"];
            if (Array.isArray(_data["sortInfos"])) {
                (<any>this).sortInfos = [] as any;
                for (let item of _data["sortInfos"])
                    (<any>this).sortInfos!.push(SortInfo.fromJS(item));
            }
            this.skip = _data["skip"];
            this.take = _data["take"];
        }
    }

    static fromJS(data: any): SearchRegistrationRequestQuery {
        data = typeof data === 'object' ? data : {};
        let result = new SearchRegistrationRequestQuery();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["contactEmail"] = this.contactEmail;
        if (Array.isArray(this.statuses)) {
            data["statuses"] = [];
            for (let item of this.statuses)
                data["statuses"].push(item);
        }
        data["responseGroup"] = this.responseGroup;
        data["objectType"] = this.objectType;
        if (Array.isArray(this.objectTypes)) {
            data["objectTypes"] = [];
            for (let item of this.objectTypes)
                data["objectTypes"].push(item);
        }
        if (Array.isArray(this.objectIds)) {
            data["objectIds"] = [];
            for (let item of this.objectIds)
                data["objectIds"].push(item);
        }
        data["keyword"] = this.keyword;
        data["searchPhrase"] = this.searchPhrase;
        data["languageCode"] = this.languageCode;
        data["sort"] = this.sort;
        if (Array.isArray(this.sortInfos)) {
            data["sortInfos"] = [];
            for (let item of this.sortInfos)
                data["sortInfos"].push(item.toJSON());
        }
        data["skip"] = this.skip;
        data["take"] = this.take;
        return data;
    }
}

export interface ISearchRegistrationRequestQuery {
    contactEmail?: string | undefined;
    statuses?: string[] | undefined;
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

export class SearchRegistrationRequestResult implements ISearchRegistrationRequestResult {
    totalCount?: number;
    results?: RegistrationRequest[] | undefined;

    constructor(data?: ISearchRegistrationRequestResult) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.totalCount = _data["totalCount"];
            if (Array.isArray(_data["results"])) {
                this.results = [] as any;
                for (let item of _data["results"])
                    this.results!.push(RegistrationRequest.fromJS(item));
            }
        }
    }

    static fromJS(data: any): SearchRegistrationRequestResult {
        data = typeof data === 'object' ? data : {};
        let result = new SearchRegistrationRequestResult();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["totalCount"] = this.totalCount;
        if (Array.isArray(this.results)) {
            data["results"] = [];
            for (let item of this.results)
                data["results"].push(item.toJSON());
        }
        return data;
    }
}

export interface ISearchRegistrationRequestResult {
    totalCount?: number;
    results?: RegistrationRequest[] | undefined;
}

export enum Severity {
    Error = "Error",
    Warning = "Warning",
    Info = "Info",
}

export enum SortDirection {
    Ascending = "Ascending",
    Descending = "Descending",
}

export class SortInfo implements ISortInfo {
    sortColumn?: string | undefined;
    sortDirection?: SortInfoSortDirection;

    constructor(data?: ISortInfo) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.sortColumn = _data["sortColumn"];
            this.sortDirection = _data["sortDirection"];
        }
    }

    static fromJS(data: any): SortInfo {
        data = typeof data === 'object' ? data : {};
        let result = new SortInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["sortColumn"] = this.sortColumn;
        data["sortDirection"] = this.sortDirection;
        return data;
    }
}

export interface ISortInfo {
    sortColumn?: string | undefined;
    sortDirection?: SortInfoSortDirection;
}

export class UpdateRegistrationRequestCommand implements IUpdateRegistrationRequestCommand {
    id!: string;
    comment?: string | undefined;

    constructor(data?: IUpdateRegistrationRequestCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.comment = _data["comment"];
        }
    }

    static fromJS(data: any): UpdateRegistrationRequestCommand {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateRegistrationRequestCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["comment"] = this.comment;
        return data;
    }
}

export interface IUpdateRegistrationRequestCommand {
    id: string;
    comment?: string | undefined;
}

export class ValidateRegistrationRequestQuery implements IValidateRegistrationRequestQuery {
    registrationRequest?: RegistrationRequest | undefined;

    constructor(data?: IValidateRegistrationRequestQuery) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.registrationRequest = _data["registrationRequest"] ? RegistrationRequest.fromJS(_data["registrationRequest"]) : <any>undefined;
        }
    }

    static fromJS(data: any): ValidateRegistrationRequestQuery {
        data = typeof data === 'object' ? data : {};
        let result = new ValidateRegistrationRequestQuery();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["registrationRequest"] = this.registrationRequest ? this.registrationRequest.toJSON() : <any>undefined;
        return data;
    }
}

export interface IValidateRegistrationRequestQuery {
    registrationRequest?: RegistrationRequest | undefined;
}

export class ValidationFailure implements IValidationFailure {
    propertyName?: string | undefined;
    errorMessage?: string | undefined;
    attemptedValue?: any | undefined;
    customState?: any | undefined;
    severity?: ValidationFailureSeverity;
    errorCode?: string | undefined;
    formattedMessagePlaceholderValues?: { [key: string]: any; } | undefined;

    constructor(data?: IValidationFailure) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.propertyName = _data["propertyName"];
            this.errorMessage = _data["errorMessage"];
            this.attemptedValue = _data["attemptedValue"];
            this.customState = _data["customState"];
            this.severity = _data["severity"];
            this.errorCode = _data["errorCode"];
            if (_data["formattedMessagePlaceholderValues"]) {
                this.formattedMessagePlaceholderValues = {} as any;
                for (let key in _data["formattedMessagePlaceholderValues"]) {
                    if (_data["formattedMessagePlaceholderValues"].hasOwnProperty(key))
                        (<any>this.formattedMessagePlaceholderValues)![key] = _data["formattedMessagePlaceholderValues"][key];
                }
            }
        }
    }

    static fromJS(data: any): ValidationFailure {
        data = typeof data === 'object' ? data : {};
        let result = new ValidationFailure();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["propertyName"] = this.propertyName;
        data["errorMessage"] = this.errorMessage;
        data["attemptedValue"] = this.attemptedValue;
        data["customState"] = this.customState;
        data["severity"] = this.severity;
        data["errorCode"] = this.errorCode;
        if (this.formattedMessagePlaceholderValues) {
            data["formattedMessagePlaceholderValues"] = {};
            for (let key in this.formattedMessagePlaceholderValues) {
                if (this.formattedMessagePlaceholderValues.hasOwnProperty(key))
                    (<any>data["formattedMessagePlaceholderValues"])[key] = (<any>this.formattedMessagePlaceholderValues)[key];
            }
        }
        return data;
    }
}

export interface IValidationFailure {
    propertyName?: string | undefined;
    errorMessage?: string | undefined;
    attemptedValue?: any | undefined;
    customState?: any | undefined;
    severity?: ValidationFailureSeverity;
    errorCode?: string | undefined;
    formattedMessagePlaceholderValues?: { [key: string]: any; } | undefined;
}

export enum DynamicObjectPropertyValueType {
    Undefined = "Undefined",
    ShortText = "ShortText",
    LongText = "LongText",
    Integer = "Integer",
    Decimal = "Decimal",
    DateTime = "DateTime",
    Boolean = "Boolean",
    Html = "Html",
    Image = "Image",
}

export enum DynamicPropertyObjectValueValueType {
    Undefined = "Undefined",
    ShortText = "ShortText",
    LongText = "LongText",
    Integer = "Integer",
    Decimal = "Decimal",
    DateTime = "DateTime",
    Boolean = "Boolean",
    Html = "Html",
    Image = "Image",
}

export enum SortInfoSortDirection {
    Ascending = "Ascending",
    Descending = "Descending",
}

export enum ValidationFailureSeverity {
    Error = "Error",
    Warning = "Warning",
    Info = "Info",
}

export class ApiException extends Error {
    override message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}

/* eslint-disable */
