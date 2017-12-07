import fs from "fs";
let config = {
    app: {
        port: process.env.port || 8080,
        baseApi: "/api"
    },
    mongodb: {
        url: "mongodb://localhost:27017/vue-blog"
    },
    jwt: {
        secret: 'qzc'
    },
    mongodbSecret: {
        user: "",
        pass: ""
    },
    admin: {
        user: "qinzhichao",
        pwd: "qinzhichao"
    }
}

if (fs.existsSync(__dirname + "/private.js")) {
    config = Object.assign(config, require("./private.js"))
}
export default config;