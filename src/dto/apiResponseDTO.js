class ApiResponseDTO {
    constructor(message, data = null, error = null) {
        this.message = message;
        this.data = data;
        this.error = error;
    }
}

module.exports = ApiResponseDTO;