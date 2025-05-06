import db from '../../../../db';

export const cinemaService = {
    async getAllCinemas () {
        try {
            const cinemas = await db.query(
                `SELECT c.cinema_id, c.cinema_name,
                 JSON_OBJECT(
                    'address_id', a.address_id, 'address_name', a.address_name
                 ) AS address
                  
                 FROM cinema c
                 JOIN address a ON c.address_id = a.address_id`
            );
            return cinemas
        }
        catch (error) {
            console.error("Error getting all cinemas:", error);
            throw error    
        }
    },
};