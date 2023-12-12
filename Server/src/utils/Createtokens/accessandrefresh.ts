import  jwt  from "jsonwebtoken";
import { SECRET } from "../..";


export function cerateAccesstoken(user: { id: number }): string | undefined {
    if (SECRET) {
        return jwt.sign({ 
            id: user.id
        }, SECRET, { 
            expiresIn: '10s'
        });
    } 
    return undefined;
}

export function createRefreshtoken(user:{id: number}): string | undefined {
    if (SECRET) {
        return jwt.sign({ 
            id: user.id
        }, SECRET, { 
            expiresIn: '15d'
        });
    } 
    return undefined;
}