"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const SALT_ROUNDS = 10;
const hashPassword = async (password) => {
    return (0, bcryptjs_1.hash)(password, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
const validatePassword = async (password, hashedPassword) => {
    return (0, bcryptjs_1.compare)(password, hashedPassword);
};
exports.validatePassword = validatePassword;
//# sourceMappingURL=bcrypt.js.map