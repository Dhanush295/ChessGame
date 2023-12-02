import  jwt  from "jsonwebtoken";
import { SECRET } from "../..";


export function cerateAccesstoken(user: { id: number }): string | undefined {
    if (SECRET) {
        return jwt.sign({ 
            id: user.id
        }, SECRET, { 
            expiresIn: '45m'
        });
    } 
    return undefined;
}

export function createRefreshtoken(user:{id: number}): string | undefined {
    if (SECRET) {
        return jwt.sign({ 
            id: user.id
        }, SECRET, { 
            expiresIn: '45m'
        });
    } 
    return undefined;
}