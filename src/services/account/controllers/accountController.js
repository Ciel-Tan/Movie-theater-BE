import { accountService } from "../services/accountService";

const accountController = {
    async login({ email, password }) {
        try {
            const token = await accountService.login({ email, password });
            return token
        }
        catch (error) {
            console.error("Error in accountService.login:", error);
            throw error
        }
    },

    async register(accountData) {
        try {
            const token = await accountService.register(accountData);
            return token
        }
        catch (error) {
            console.error("Error in accountService.signup:", error);
            throw error
        }
    }
};

export default accountController