"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonwebtoken_2 = require("jsonwebtoken");
const helpers_1 = require("../helpers");
const authenticate = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || "secret");
            let user = await helpers_1.prisma.user.findUnique({
                where: { id: decode.user.id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profile: true,
                    profileId: true,
                }
            });
            if (!user) {
                return res.json({ success: false, message: "Unauthorized" });
            }
            req.user = user;
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_2.JsonWebTokenError) {
                if (err.name === "JsonWebTokenError") {
                    return res.json({ success: false, message: "Unauthorized" });
                }
                if (err.name === "TokenExpiredError") {
                    return res.json({
                        success: false,
                        message: "sesson expired try sign in!",
                    });
                }
                res.json({ success: false, message: "Internal server error!" });
            }
        }
    }
    else {
        res.json({ success: false, message: "Unauthorized" });
    }
};
exports.authenticate = authenticate;
