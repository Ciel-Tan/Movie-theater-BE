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
    },

    async getAllAccounts () {
        try {
            const accounts = await accountService.getAllAccounts()
            return accounts
        }
        catch (error) {
            console.error("Error in accountService.getAllAccount:", error)
        }
    },

    async getAccountById (account_id) {
        try {
            const account = await accountService.getAccountById(account_id)
            return account
        }
        catch (error) {
            console.error(`Error in accountService.getAccountById:`, error)
            throw error
        }
    },

    async updateAccount (account_id, accountData) {
        try {
            const updatedAccount = await accountService.updateAccount(account_id, accountData)
            return updatedAccount
        }
        catch (error) {
            console.error("Error in accountService.updateAccount:", error)
            throw error
        }
    },

    async deleteAccount (account_id) {
        try {
            return await accountService.deleteAccount(account_id)
        }
        catch (error) {
            console.error("Error in accountService.deleteAccount:", error)
            throw error
        }
    },

    async changePassword (account_id, currentPassword, newPassword) {
        try {
            const changedPassword = await accountService.changePassword(account_id, currentPassword, newPassword)
            return changedPassword
        }
        catch (error) {
            console.error("Error in accountService.changePassword:", error)
            throw error
        }
    },

    async forgotPassword (email) {
        try {
            await accountService.forgotPassword(email)
            return true
        }
        catch (error) {
            console.error("Error in accountService.forgotPassword:", error)
            throw error
        }
    }
};

export default accountController