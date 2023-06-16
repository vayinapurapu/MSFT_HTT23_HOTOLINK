import * as React from 'react';
// import styles from './Pms.module.scss';'
import 'bootstrap/dist/css/bootstrap.min.css';
import { IPmsProps } from './IPmsProps';
import SeatReservation from './SeatReservation/SeatReservation';

export default class Pms extends React.Component<IPmsProps, {}> {
  public render(): React.ReactElement<IPmsProps> {
    return (
      <div>
        <SeatReservation></SeatReservation>
      </div>
    );
  }
}