"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const helpers_1 = require("../helpers");
const router = express_1.default.Router();
router.get("/feed", auth_1.authenticate, async (req, res) => {
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
router.post("/new", auth_1.authenticate, async (req, res) => {
    try {
        const { projectName, title, body } = req.body;
        const project = await helpers_1.prisma.project.findUnique({
            where: {
                name: projectName,
            },
        });
        if (!project) {
            return res.json({ success: false, message: "Project not found" });
        }
        const changelog = await helpers_1.prisma.changelog.create({
            data: {
                title,
                body,
                project: {
                    connect: {
                        name: projectName,
                    },
                },
            },
        });
        return res.json({ success: true, changelog });
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
