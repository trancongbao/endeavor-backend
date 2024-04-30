import {login} from "./login";
import {logout} from "./logout";

export {auth};

function auth(request: { body: { method: Method } }, response: any) {
    methods[request.body.method](request, response)
}

const methods: Record<Method, CallableFunction> = {
    "login": login,
    "logout": logout
}

type Method = "login" | "logout";
