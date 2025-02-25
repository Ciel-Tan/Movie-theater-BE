import db from '../../../../db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

export const accountService = {
    async login({ email, password }) {
        try {
            const sql = 'SELECT * FROM account WHERE email = ?';
            const users = await db.query(sql, [email]);
            const user = users[0];

            if (!user) {
                return { message: 'Incorrect email' };
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return { message: 'Incorrect password' };
            }

            const expiresIn = 3600
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: expiresIn });
            return {
                token,
                expiresIn: expiresIn
            }
        }
        catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    },

    async register(accountData) {
        try {
            const { full_name, gender, birthday, id_number, phone_number, email, password } = accountData;
            const hashPassword = await bcrypt.hash(password, 10)
            
            await db.query(
                `INSERT INTO account 
                 (role_id, membership_id,full_name, gender, birthday, id_number, phone_number, email, password) 
                 VALUES (2, 1, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, gender, birthday, id_number, phone_number, email, hashPassword]
            );

            const token = await this.login({ email, password });
            return token
        }
        catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    },

    async getAllAccounts() {
        try {
            const accounts = await db.query(
                `SELECT *
                 FROM account
                 JOIN role ON account.role_id = role.role_id
                 JOIN membership_type ON account.membership_id = membership_type.membership_id`
            )

            return accounts.map(account => ({
                account_id: account.account_id,
                full_name: account.full_name,
                gender: account.gender,
                birthday: account.birthday,
                id_number: account.id_number,
                phone_number: account.phone_number,
                email: account.email,
                role: {
                    role_id: account.role_id,
                    role_name: account.role_name,
                },
                membership_type: {
                    membership_id: account.membership_id,
                    membership_name: account.membership_name,
                    discount_rate: account.discount_rate,
                },
            }));
        }
        catch (error) {
            console.error("Error getting all accounts:", error);
            throw error;
        }
    },

    async getAccountById (account_id) {
        try {
            const accounts = await db.query(
                `SELECT *
                 FROM account
                 JOIN role ON account.role_id = role.role_id
                 JOIN membership_type ON account.membership_id = membership_type.membership_id
                 WHERE account_id = ?`, [account_id]
            )

            const account = accounts[0]
            
            return {
                account_id: account.account_id,
                full_name: account.full_name,
                gender: account.gender,
                birthday: account.birthday,
                id_number: account.id_number,
                phone_number: account.phone_number,
                email: account.email,
                role: {
                    role_id: account.role_id,
                    role_name: account.role_name,
                },
                membership_type: {
                    membership_id: account.membership_id,
                    membership_name: account.membership_name,
                    discount_rate: account.discount_rate,
                },
            };
        }
        catch (error) {
            console.error(`Error getting account by id ${account_id}:`, error)
            throw error
        }
    },

    async updateAccount(account_id, accountData) {
        try {
            const { full_name, gender, birthday, id_number, phone_number, email } = accountData
            await db.query(
                `UPDATE account
                 SET full_name = ?, gender = ?, birthday = ?, id_number = ?, phone_number = ?, email = ?
                 WHERE account_id = ?`,
                [full_name, gender, birthday, id_number, phone_number, email, account_id]
            )

            const updatedAccount = await this.getAccountById(account_id)
            return updatedAccount
        }
        catch (error) {
            console.error("Error updating account:", error);
            throw error;
        }
    },

    async deleteAccount(account_id) {
        try {
            const result = await db.query(
                `DELETE FROM account
                 WHERE account_id = ?`,
                [account_id]
            )

            return result.affectedRows > 0
        }
        catch (error) {
            console.error("Error deleting account:", error);
            throw error;
        }
    }
}