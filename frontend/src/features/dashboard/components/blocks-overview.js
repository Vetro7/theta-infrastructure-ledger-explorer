import React, { Component } from "react";
import socketClient from 'socket.io-client';
import BlockOverviewTable from 'features/blocks/components/block-overview-table';
import LinkButton from "common/components/link-button";
import '../styles.scss';

export default class BlocksOverView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.backendAddress,
      // backendAddress: "localhost:3000",
      blockHeight: 0,
      blockInfoList: []
    };
    this.onSocketEvent = this.onSocketEvent.bind(this);
  }

  componentDidMount() {
    const { backendAddress } = this.state;

    // Initial the socket
    this.socket = socketClient(backendAddress);
    this.socket.on('event', this.onSocketEvent)

  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  onSocketEvent(data) {
    if (data.type == 'block_list') {
      this.setState({ blockInfoList: data.body })
    }
  }

  render() {
    const { blockInfoList } = this.state;
    return (
      <div className="th-overview">
        <div className="th-overview__title">Blockchains overview</div>
        {blockInfoList !== undefined ?
          <BlockOverviewTable blockInfoList={blockInfoList} /> : <div></div>}
        <div className="th-overview__button">
          <LinkButton className="th-overview__button--a" url="/blocks">View All</LinkButton>
        </div>
      </div>
    );
  }
}