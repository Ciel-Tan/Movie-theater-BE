import db from '../../../../db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '@/src/lib/emailService';
import crypto from 'crypto';

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
    },

    async changePassword(account_id, currentPassword, newPassword) {
        try {
            const user = await this.getAccountById(account_id)

            const passwordMatch = bcrypt.compare(currentPassword, user.password)
            if (!passwordMatch) {
                return { message: 'Incorrect password' };
            }

            const hashPassword = await bcrypt.hash(newPassword, 10)
            await db.query(
                `UPDATE account
                 SET password = ?
                 WHERE account_id = ?`,
                [hashPassword, account_id]
            )

            return true
        }
        catch (error) {
            console.error("Error changing password:", error);
            throw error;
        }
    },

    async forgotPassword(email) {
        try {
            // 1. Check if an account with this email exists
            const accounts = await db.query(
                'SELECT account_id, full_name, email FROM account WHERE email = ?',
                [email]
            );
            
            const account = accounts[0];

            if (!account) {
                // Security best practice: Do NOT reveal if email doesn't exist.
                // Just return success indicating email was "sent" (generic success response)
                console.log(`Password reset requested for non-existent email: ${email}. (This is intentionally ignored for security).`);
                return true; // Still return success for security
            }

            const account_id = account.account_id;
            const full_name = account.full_name;

            const newPasswordPlain = crypto.randomBytes(12).toString('base64');
            const newPasswordHash = await bcrypt.hash(newPasswordPlain, 10);

            await db.query(
                'UPDATE account SET password = ? WHERE account_id = ?',
                [newPasswordHash, account_id]
            );

            const emailBody = `
                Hello ${full_name},

                Your password has been reset. Your new temporary password is:

                **${newPasswordPlain}**

                Please log in using this password and immediately change it to a new, strong password.

                If you did not request a password reset, please ignore this email and contact support.

                Sincerely,
                Your Movie Theater Team
            `;

            const emailSent = await sendEmail({
                to: email,
                subject: "Your Password Has Been Reset",
                html: emailBody
            })

            if (!emailSent) {
                console.error(`Failed to send password reset email to ${email}. (This is intentionally ignored for security).`);
            }

            return true; // Indicate that the forgot password process was initiated (email sent or would be sent)

        } catch (error) {
            console.error("Error in accountService.forgotPassword:", error);
            throw error;
        }
    },
}