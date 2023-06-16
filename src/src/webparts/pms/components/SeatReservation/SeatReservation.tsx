import * as React from 'react';
import { useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import styles from './SeatReservation.module.scss';
import { BookedSlots, SeatReservationProps } from './ISeatReservation';
import Accordion from 'react-bootstrap/Accordion';
import SharePointService from '../SharePointServices';
import * as moment from 'moment';

const SeatReservation: React.FC<SeatReservationProps> = (props) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [selectedLocation, setSelectedLocation] = useState('Block 1');
  const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [bookedSlots, setBookedSlots] = useState<BookedSlots[]>([{ Location: '', Slot: '' }]);

  const sharePointService = new SharePointService();

  React.useEffect(() => {
    const dropdownOptions: IDropdownOption[] = [
      { key: 'Block 1', text: 'Block 1' },
      { key: 'Block 2', text: 'Block 2' },
    ];
    setDropdownOptions(dropdownOptions);
    getSlots(moment(new Date()));
  },[]);

  React.useEffect(() => {
    getSlots(moment(new Date()));
  },[showSuccessModal])

  const handleSeatSelect = (seat: string) => {
    if (selectedSeat !== seat) {
      setSelectedSeat(seat);
    } else {
      setSelectedSeat(null);
    }
  };

  const handleCardsPerRowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cardsPerRow = parseInt(event.target.value, 10);
    setCardsPerRow(cardsPerRow);
    setSelectedSeat(null);
  };

  const handleLocationChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      setSelectedLocation(option.text);
      getSlots(selectedDate);
      setSelectedSeat(null);
    }
  };

  const handleDateChange = (date: Date | null | undefined) => {
    if (date) {
      setSelectedDate(date);
      getSlots(date);
      setSelectedSeat(null);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedSeat(null);
    props.showHomeFun();
  };

  const reserveSlot = async () => {
    const itemData = {
      Title: 'New Slot Reservation',
      Slot: selectedSeat,
      Location: selectedLocation,
      BookingDate: moment(selectedDate).format('YYYY-MM-DDT00:00:00.00Z'),
    };
    try {

      const item: any = await sharePointService.createListItem('Reservations', itemData);
      setShowSuccessModal(true);
      setMsg('Reserved Successfully. Your Unique ID: ' + item.data.ID);
    } catch (error) {
      setShowSuccessModal(true);
      setMsg('Something Went Wrong!' + error);
    }
  };

  const getSlots = async (ipDate: any) => {
    const selectedDate = ipDate;
    try {
      const items: any = await sharePointService.getItems('Reservations');
      const upcomingBookings: BookedSlots[] = items.filter(
        (reservation: any) =>
          moment(reservation.BookingDate).format('YYYY-MM-DDT00:00:00.00Z') >=
          moment(selectedDate).format('YYYY-MM-DDT00:00:00.00Z')
      );
      const upcomingBookingsTmp: BookedSlots[] = upcomingBookings.filter(
        (reservation: any) =>
          moment(reservation.BookingDate).format('YYYY-MM-DDT00:00:00.00Z') <
          moment(selectedDate).add(1, 'days').format('YYYY-MM-DDT00:00:00.00Z')
      );
      setBookedSlots(upcomingBookingsTmp);
    } catch (error) {
      console.log(error);
    }
  };

  const checkAvailable = (seat: string) => {
    return bookedSlots.some((slot) => slot.Slot === seat && slot.Location === selectedLocation);
  };

  const renderSeats = () => {
    const seats = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'];

    return seats.map((seat) => (
      <Card
        key={seat}
        bg={selectedSeat === seat ? 'primary' : !checkAvailable(seat) ? 'success' : 'light'}
        text={selectedSeat === seat ? 'white' : !checkAvailable(seat) ? 'white' : 'dark'}
        style={{ margin: '1rem', cursor: 'pointer' }}
        onClick={() => (checkAvailable(seat) ? alert('Slot Not Available') : handleSeatSelect(seat))}
      >
        <Card.Body className="text-center">
          <Card.Title>{seat}</Card.Title>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <div className={styles.SeatReservation}>
      <Row xs={12} className="mt-5">
        <Col xs={4}>
          <h3 className={styles.heading}>Select Date</h3>
          <DatePicker value={selectedDate} onSelectDate={handleDateChange} />
        </Col>
        <Col xs={4}>
          <h3 className={styles.heading}>Location</h3>
          <Dropdown
            placeholder="Choose location"
            selectedKey={selectedLocation}
            options={dropdownOptions}
            onChange={handleLocationChange}
          />
        </Col>
        <Col xs={4}>
          <h3 className={styles.heading}>Slots Per Row</h3>
          <div>
            <input
              className={styles.formControl}
              type="number"
              id="cardsPerRow"
              min="1"
              value={cardsPerRow}
              onChange={handleCardsPerRowChange}
            />
          </div>
        </Col>
      </Row>
      <Accordion defaultActiveKey="0" className="mt-2">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <strong>{selectedLocation}</strong>
          </Accordion.Header>
          <Accordion.Body>
            <Card.Body>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }}>{renderSeats()}</div>
            </Card.Body>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Row xs={12} className={`mt-5`}>
        <div className="text-end">
          <Button className="btnStyles" style={{ marginRight: '10px' }} onClick={props.showHomeFun}>
            Home
          </Button>
          <Button className="btnStyles" onClick={reserveSlot}>
            Reserve Slot
          </Button>
        </div>
      </Row>
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Body>{msg}</Modal.Body>
      </Modal>
    </div>
  );
};

export default SeatReservation;