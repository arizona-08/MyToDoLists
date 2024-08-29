import bcrypt from "bcrypt";

export async function passwordHash(password){
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error("Something went wrong when hashing your password", err);
        return;
    }
}

export async function comparePasswords(password, hashedPassword){
    try{
        const isMatching = await bcrypt.compare(password, hashedPassword)
        return isMatching;
    }catch (err) {
        console.error("Something went wrong when checking your password", err);
    }
}