class ApiResponse {
    constructor(statusCode, data, message = "success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        // Logic: Success is true if the status code is less than 400
        this.success = statusCode < 400;
    }
}

export { ApiResponse };