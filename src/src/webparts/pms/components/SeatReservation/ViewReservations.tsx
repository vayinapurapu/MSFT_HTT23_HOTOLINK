import * as React from 'react';
import { Button, Row, Table } from 'react-bootstrap';
import { Reservation, ViewReservationsProps, ViewReservationsState } from './ISeatReservation';
import SharePointService from '../SharePointServices';
import * as moment from 'moment';



export default class ViewReservations extends React.Component<ViewReservationsProps, ViewReservationsState> {
    private sharePointService: SharePointService;
    constructor(props: any) {
        super(props);
        this.state = {
            reservations: [{ ID: null, BookingDate: null, Location: '', Slot: '', Author: {Title:''} }],
            pastBookings: [{ ID: null, BookingDate: null, Location: '', Slot: '', Author: {Title:''} }],
            upcomingBookings: [{ ID: null, BookingDate: null, Location: '', Slot: '', Author: {Title:''} }],

        };
        this.sharePointService = new SharePointService();
    }
    componentDidMount(): void {
        this.getReservations();
    }
    getReservations = async () => {
        const items: Reservation[] = await this.sharePointService.getItems("Reservations");
        const pastBookings = items.filter(
            (reservation) => moment(reservation.BookingDate).format('YYYY-MM-DDT00:00:00.00Z') < moment(new Date()).format('YYYY-MM-DDT00:00:00.00Z')
        );
        const upcomingBookings = items.filter(
            (reservation) => moment(reservation.BookingDate).format('YYYY-MM-DDT00:00:00.00Z') >= moment(new Date()).format('YYYY-MM-DDT00:00:00.00Z')
        );
        this.setState({ pastBookings: pastBookings, upcomingBookings: upcomingBookings })
    }
    public render(): React.ReactElement<{}> {
        const { pastBookings, upcomingBookings } = this.state;
        return (
            <>
                <div style={{ margin: '50px' }}>
                    <Row>
                        <h2>My Upcoming Bookings</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>BookingDate</th>
                                    <th>Location</th>
                                    <th>Slot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingBookings.map((booking) => (
                                    <tr key={booking.ID}>
                                        <td>{booking.ID}</td>
                                        <td>{moment(booking.BookingDate).format('DD-MMM-YYYY')}</td>
                                        <td>{booking.Location}</td>
                                        <td>{booking.Slot}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>

                    <Row className='mt-2'>
                        <h2>My Past Bookings</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>BookingDate</th>
                                    <th>Location</th>
                                    <th>Slot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastBookings.map((booking) => (
                                    <tr key={booking.ID}>
                                        <td>{booking.ID}</td>
                                        <td>{moment(booking.BookingDate).format('DD-MMM-YYYY')}</td>
                                        <td>{booking.Location}</td>
                                        <td>{booking.Slot}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                </div>
                <Row xs={12} className={`mt-5`} style={{ margin: '50px' }}>
                    <div className="text-end">
                        <Button className='btnStyles' onClick={this.props.showHomeFun}>Home</Button>
                    </div>
                </Row>
            </>
        );
    }
};