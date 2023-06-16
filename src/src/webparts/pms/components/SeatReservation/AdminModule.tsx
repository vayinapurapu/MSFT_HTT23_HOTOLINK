import * as React from 'react';
import { Button, Container, Row, Table } from 'react-bootstrap';
import { AdminModuleProps, AdminModuleState, Reservation } from './ISeatReservation';
import SharePointService from '../SharePointServices';
import * as moment from 'moment';

export default class AdminModule extends React.Component<AdminModuleProps, AdminModuleState> {
    private sharePointService: SharePointService;
    constructor(props: any) {
        super(props);
        this.state = {
            reservations: [{ ID: null, BookingDate: null, Location: '', Slot: '', Author: {Title:''} }],
            upcomingBookings: [{ ID: null, BookingDate: null, Location: '', Slot: '', Author: {Title:''} }],
        };
        this.sharePointService = new SharePointService();
    }
    componentDidMount(): void {
        this.getReservations();
    }
    getReservations = async () => {
        const today = moment(new Date()).format('YYYY-MM-DDT00:00:00.00Z');
        const items: Reservation[] = await this.sharePointService.getItems("Reservations");
        const upcomingBookings = items.filter(
            (reservation) => moment(reservation.BookingDate).format('YYYY-MM-DDT00:00:00.00Z') >= today
        );
        this.setState({ upcomingBookings: upcomingBookings })
    }
    public render(): React.ReactElement<{}> {
        const { upcomingBookings } = this.state;
        return (
            <>
                <div style={{ margin: '100px' }}>
                    <Row>
                        <Container>
                            <iframe title="Report Section"
                                height="500"
                                width="1500"
                                src="https://app.powerbi.com/view?r=eyJrIjoiNzY4NWI1OTktY2NmNi00MWQ3LTgxYWMtNGQ5NGVjMGI5YWIzIiwidCI6ImM0OTRiZjBiLTQxMDctNDY3NS1iZjFhLWY1ZWNkNjU0YTdkMyJ9">
                            </iframe>
                        </Container>
                    </Row>
                    <Row className='mt-2'>
                        <h2>Upcoming Bookings</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Reserved By</th>
                                    <th>BookingDate</th>
                                    <th>Location</th>
                                    <th>Slot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingBookings.map((booking) => (
                                    <tr key={booking.ID}>
                                        <td>{booking.ID}</td>
                                        <td>{booking.Author.Title}</td>
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