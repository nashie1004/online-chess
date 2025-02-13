import axios from "axios";
import api from "./api";

export interface GenericListRequest {
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    filters: string
}

export interface GenericReturnMessage {
    isOk: boolean,
    status: number,
    data: any,
    message: string
}


interface RequestBaseResponse {
    isSuccess: boolean,
    rowsAffected: number
    successMessage: string
    validationErrors: string[]
}

export interface GenericReturnMessageList extends RequestBaseResponse  {
    items: any;
}

export default class BaseApiService {
    private genericSuccessMsg = "Success";
    private genericErrorMsg = "Error in the request";

    constructor() {

    }

    public handleError(error: axios.AxiosError | any): GenericReturnMessage {
        if (axios.isAxiosError(error)) {
            return {
                isOk: false
                , status: error.response?.status ?? 500
                , data: null
                //, message: error.response?.data?.message ?? this.genericErrorMsg
                , message: error.message ?? this.genericErrorMsg
            }
        }

        return {
            isOk: false,
            status: 500,
            data: null,
            message: error instanceof Error ? error.message : `${error}`
        }
    }

    public handleResponse(response: axios.AxiosResponse<RequestBaseResponse>): GenericReturnMessage {
        if (response.data.isSuccess && response.data.validationErrors.length < 1) {
            return {
                isOk: true,
                status: response.status,
                data: response.data,
                message: response.data.successMessage
            }
        }

        return {
            isOk: false,
            status: response.status,
            data: response.data,
            message: response.data.validationErrors.join("\n")
        }
    }

    public async baseGet(url: string, config?: axios.AxiosRequestConfig) {
        try {
            const response = await api.get(url, config);
            return this.handleResponse(response);
        }
        catch (err) {
            return this.handleError(err);
        }
    }

    public async baseGetList(url: string, listParams: GenericListRequest, config?: axios.AxiosRequestConfig) {
        try {
            const { pageSize, pageNumber, sortBy, filters } = listParams;
            url = `${url}?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=${sortBy}&filters=${filters}`;

            const response = await api.get(url, config);
            return this.handleResponse(response);
        }
        catch (err) {
            return this.handleError(err);
        }
    }

    public async basePost(url: string, data: any, config?: axios.AxiosRequestConfig) {
        try {
            const response = await api.post(url, data, config);
            return this.handleResponse(response);
        }
        catch (err) {
            return this.handleError(err);
        }
    }

    public async baseDelete(url: string, config?: axios.AxiosRequestConfig) {
        try {
            const response = await api.delete(url, config);
            return this.handleResponse(response);
        }
        catch (err) {
            return this.handleError(err);
        }
    }

    public async basePut(url: string, data: any, config?: axios.AxiosRequestConfig) {
        try {
            const response = await api.put(url, data, config);
            return this.handleResponse(response);
        }
        catch (err) {
            return this.handleError(err);
        }
    }
}