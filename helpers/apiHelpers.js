// const { validationResult } = require("express-validator");

module.exports = {

    apiSuccessWithData: (message, data) => {
        const res = {
            status: true,
            message: message,
            detail: data,
        };
        return res;
    },
    apiLogin: (message, token) => {
        const res = {
            status: true,
            message: message,
            token: token
        }
        return res;
        
    },
    apiSuccess: (message) => {
        
        const res = {
            status: true,
            message: message,
        };
        return res;
    },
    apiError: (message) => {
        const res = {
            status: false,
            message: message,
        };
        return res;
    },

    apiValidationErrors: (errors) => {
        const res = {
            status: false,
            message: 'Validation errors',
            details: errors,
        };
        return res;
    }
}