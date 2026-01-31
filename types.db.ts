import { Connection } from "mongoose";

// globle veriable declare for DB connection beacuse Next.js is serverless;
declare global {
    var mongoose : {
        connect : Connection | null;
        promise : Promise<Connection> | null
    }
}

export {};


