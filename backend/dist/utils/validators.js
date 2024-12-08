"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateEmail = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters long'),
    role: zod_1.z.enum(['mentor', 'mentee']),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
});
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
exports.validateEmail = validateEmail;
const validate = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new Error(error.errors.map(err => err.message).join(', '));
        }
        throw new Error('Invalid data');
    }
};
exports.validate = validate;
//# sourceMappingURL=validators.js.map