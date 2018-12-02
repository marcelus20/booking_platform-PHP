class Booking {
    constructor(booking_status, review){
        this.booking_status = booking_status;
        this.review = review;
    }
}

const booking = (booking_status, review) => new Booking(booking_status, review);