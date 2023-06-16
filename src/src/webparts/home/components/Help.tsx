import * as React from 'react';
import 'office-ui-fabric-react/dist/css/fabric.css';
import styles from './Home.module.scss';
import { Modal } from 'react-bootstrap';

interface IHelpProps {
    closeModal: any;
    showModal: boolean;
}

export default class Help extends React.Component<IHelpProps, {}> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactElement<{}> {
        return (
            <div>
                <Modal show= {this.props.showModal} contentClassName={styles.modalheight} onHide={this.props.closeModal}>
                    <Modal.Header closeButton>
                        Zoya - The Chat Assist
                    </Modal.Header>
                    <Modal.Body>
                        <iframe
                            src="https://web.powerva.microsoft.com/environments/Default-c494bf0b-4107-4675-bf1a-f5ecd654a7d3/bots/crcea_zoyaTheHelpAssist/webchat?__version__=2Y"
                            style={{ width: '100%', height: '100%' }}
                        ></iframe>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}