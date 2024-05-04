import cors from "cors"

export {corsOptions}

const corsOptions: cors.CorsOptions = {
    origin: "http://localhost:3001",    //Access-Control-Allow-Origin
    credentials: true,                  //Access-Control-Allow-Credentials
    maxAge: 60 * 60 * 24                //Access-Control-Max-Age
}