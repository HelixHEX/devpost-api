"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("../helpers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/profile/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        let projects;
        if (id === "me") {
            projects = await helpers_1.prisma.project.findMany({
                where: {
                    profileId: req.user.profileId,
                },
            });
        }
        else {
            projects = await helpers_1.prisma.project.findMany({
                where: {
                    profileId: Number(id),
                },
            });
        }
        return res.json({ success: true, projects });
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
router.post("/new", auth_1.authenticate, async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await helpers_1.prisma.project.create({
            data: {
                name,
                description,
                profile: {
                    connect: {
                        id: req.user.profileId,
                    },
                },
            },
        });
        return res.json({ success: true, project });
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
