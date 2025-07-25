import * as movieService from './movie';
import * as accountService from './account';
import * as directorService from './director';
import * as actorService from './actor';
import * as roomService from './room';
import * as showtimeService from './showtime';
import * as genreService from './genre';
import * as membershipService from './membership'
import * as bookingService from './booking';
import * as ticketService from './ticket';
import * as seatTypeService from './seat_type';
import * as cinemaService from './cinema';
import * as seatService from './seat';
import * as roleService from './role';
import * as residenceService from './residence';

export const services = {
    movieService,
    accountService,
    directorService,
    actorService,
    roomService,
    showtimeService,
    genreService,
    membershipService,
    bookingService,
    ticketService,
    seatService,
    seatTypeService,
    cinemaService,
    roleService,
    residenceService
};