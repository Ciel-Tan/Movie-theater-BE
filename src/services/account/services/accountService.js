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

            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: 3600 });
            return {
                token,
                expiresIn: 3600
            }
        }
        catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    },

    async register(accountData) {
        const { full_name, gender, birthday, id_number, phone_number, email, password } = accountData;

        try {
            const sql = 'INSERT INTO account ' +  
                        '(role_id, membership_id,full_name, gender, birthday, id_number, phone_number, email, password) ' + 
                        'VALUES (2, 1, ?, ?, ?, ?, ?, ?, ?)';
            const hashPassword = await bcrypt.hash(password, 10)

            const values = [full_name, gender, birthday, id_number, phone_number, email, hashPassword];
            await db.query(sql, values);

            const token = await this.login({ email, password });
            return token
        }
        catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    }
}