"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("../helpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const saltRounds = 10;
router.post("/signup", async (req, res) => {
    const { email, password, name, bio, username, birthdate, pronouns } = req.body;
    try {
        bcrypt_1.default.hash(password, saltRounds, async (err, hash) => {
            const user = await helpers_1.prisma.user.create({
                data: {
                    username: username.toLowerCase(),
                    email,
                    password: hash,
                    profile: {
                        create: {
                            name,
                            bio,
                            pronouns,
                        },
                    },
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profile: true,
                    profileId: true,
                },
            });
            if (!user) {
                return res.json({ success: false, message: "User not created" });
            }
            else {
                const token = (0, helpers_1.generateToken)(user);
                return res.json({ success: true, user, token });
            }
        });
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
router.post("/signin", async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await helpers_1.prisma.user.findFirst({
            where: {
                OR: [{ email, username }],
            },
            include: {
                profile: true,
            },
        });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        else {
            bcrypt_1.default.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.json({ success: false, message: err.message });
                }
                if (result) {
                    const { password, createdAt, updatedAt, ...otherUser } = user;
                    const token = (0, helpers_1.generateToken)(otherUser);
                    return res.json({ success: true, otherUser, token });
                }
                else {
                    return res.json({ success: false, message: "Wrong password" });
                }
            });
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
router.post("/check/email", async (req, res) => {
    try {
        if (req.body.email) {
            const { email } = req.body;
            const user = await helpers_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.json({ success: true, message: "Email not in use" });
            }
            else {
                return res.json({ success: false, message: "Email already in use" });
            }
        }
        else {
            return res.json({ success: false, message: "Email not provided" });
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
router.post("/check/username", async (req, res) => {
    try {
        if (req.body.username) {
            const username = req.body.username;
            const user = await helpers_1.prisma.user.findUnique({
                where: { username },
            });
            if (!user) {
                return res.json({ success: true, message: "Username available" });
            }
            else {
                return res.json({ success: false, message: "Username taken" });
            }
        }
        else {
            return res.json({ success: false, message: "Username not provided" });
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
