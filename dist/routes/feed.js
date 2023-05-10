"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("../helpers");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const feed = await helpers_1.prisma.changelog.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                project: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        return res.json({ success: true, feed });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.json({ success: false, message: err.message });
        }
        else {
            return res.json({ success: false, message: "Internal server error" });
        }
    }
});
exports.default = router;
