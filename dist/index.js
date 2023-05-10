"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
//routes
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const changelog_1 = __importDefault(require("./routes/changelog"));
const project_1 = __importDefault(require("./routes/project"));
const port = process.env.PORT || 5000;
const main = async () => {
    const app = (0, express_1.default)();
    morgan_1.default.token("body", (req) => JSON.stringify(req.body));
    // app.use(helmet());
    app.use((0, morgan_1.default)(":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"));
    app.use(express_1.default.json());
    app.use("/v1", auth_1.default);
    app.use("/v1/profile", profile_1.default);
    app.use('/v1/changelog', changelog_1.default);
    app.use('/v1/project', project_1.default);
    app.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
    });
};
main();
