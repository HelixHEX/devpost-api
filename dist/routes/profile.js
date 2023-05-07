"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const helpers_1 = require("../helpers");
const router = express_1.default.Router();
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        const user = await helpers_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                profile: true,
                profileId: true,
            },
        });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        else {
            return res.json({ success: true, user });
        }
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
router.get("/id/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await helpers_1.prisma.profile.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!profile) {
            return res.json({ success: false, message: "Profile not found" });
        }
        else {
            return res.json({ success: true, profile });
        }
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
