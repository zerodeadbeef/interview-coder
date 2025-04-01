"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default({
    defaults: {},
    encryptionKey: "your-encryption-key"
});
exports.store = store;
