import * as React from 'react';
import 'office-ui-fabric-react/dist/css/fabric.css';
import styles from './Home.module.scss';
import { IHomeProps } from './IHomeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Button} from 'react-bootstrap';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { HomeState } from './IHomeModels';
import SeatReservation from '../../pms/components/SeatReservation/SeatReservation';
import Help from './Help';
import ViewReservations from '../../pms/components/SeatReservation/ViewReservations';
import SharePointService from '../../pms/components/SharePointServices';
import AdminModule from '../../pms/components/SeatReservation/AdminModule';

export default class Home extends React.Component<IHomeProps, HomeState> {
  private sharePointService: SharePointService;
  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      showModal: false,
      showHome: true,
      showReservation: false,
      viewReservation: false,
      adminModule: false,
      isAdmin: false
    };
    this.sharePointService = new SharePointService();
  }

  componentDidMount(): void {
    this.checkIsAdmin();
  }

  private openModal = () => {
    this.setState({ showModal: true });
  }

  private closeModal = () => {
    this.setState({ showModal: false });
  }

  private showReservationComponent = () => {
    this.setState({ showReservation: true, showHome: false, viewReservation: false, adminModule: false });
  }

  private viewReservationComponent = () => {
    this.setState({ showReservation: false, showHome: false, viewReservation: true, adminModule: false });
  }

  private showHomeComponent = () => {
    this.setState({ showReservation: false, showHome: true, viewReservation: false, adminModule: false });
  }

  private showAdminComponent = () => {
    this.setState({ showReservation: false, showHome: false, viewReservation: false, adminModule: true });
  }

  private checkIsAdmin = async () => {
    let isAdmin:boolean = await this.sharePointService.checkUserisAdmin(this.props.userEmail);
    this.setState({isAdmin:isAdmin });
  }

  public render(): React.ReactElement<IHomeProps> {
    const { isDarkTheme, userDisplayName } = this.props;
    const { showModal, showHome, showReservation, viewReservation, adminModule, isAdmin } = this.state;

    return (
      <>
        <div className={`${styles.home}`} style={{ display: showHome ? "inline" : "none" }}>
          <div className={styles.welcome}>
            <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
            <h3>Hello, {escape(userDisplayName)}!</h3>
            <div><h2>Welcome to Contoso Hotolink Management System</h2></div>
          </div>
          <div className={`${styles.welcome} mt-5`}>
            <Button variant="primary" style={{marginRight:'10px'}} onClick={this.showReservationComponent}>
              Make Reservation
            </Button>
            <Button variant="primary" style={{marginRight:'10px'}} onClick={this.viewReservationComponent}>
              View Reservation
            </Button>
            <Button variant="primary" onClick={this.showAdminComponent} style = {{display: isAdmin ? 'inline':'none'}}>
              Admin Module
            </Button>
          </div>
          <div>
            <Help showModal={showModal} closeModal={this.closeModal}></Help>
          </div>
          <Button variant="primary" className={styles.botIcon} onClick={this.openModal}>
            <Icon iconName="Robot" />
          </Button>
        </div>
        <div style={{ display: showReservation ? "inline" : "none" }}>
          <SeatReservation showHomeFun={this.showHomeComponent}></SeatReservation>
        </div>
        <div style={{ display: viewReservation ? "inline" : "none" }}>
          <ViewReservations showHomeFun={this.showHomeComponent}></ViewReservations>
        </div>
        <div style={{ display: adminModule ? "inline" : "none" }}>
          <AdminModule showHomeFun={this.showHomeComponent}></AdminModule>
        </div>
      </>
    );
  }
}