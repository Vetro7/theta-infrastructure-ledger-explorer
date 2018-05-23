import React, { Component } from "react";
import { browserHistory } from 'react-router';
import socketClient from 'socket.io-client';
import BlockInfoRows from './block-info-rows';
import BlockExplorerTable from './block-explorer-table';
import { blocksService } from '/common/services/block';
import { Link } from "react-router"
import LinkButton from "common/components/link-button";


// import './styles.scss';

export default class BlocksExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // backendAddress: this.props.route.backendAddress,
      // backendAddress: "52.53.243.120:9000",
      backendAddress: "localhost:9000",
      blockInfo: null
    };
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.params.blockHeight !== this.props.params.blockHeight) {
      this.gerOneBlockByHeight(nextProps.params.blockHeight);
    }
  }
  componentDidMount() {
    const { blockHeight } = this.props.params;
    browserHistory.push(`/blocks/${blockHeight}`);

    const { backendAddress } = this.state;
    this.gerOneBlockByHeight(blockHeight);
  }
  gerOneBlockByHeight(height) {
    blocksService.getBlockByHeight(height)
      .then(res => {
        if (res.data.type == 'block') {
          this.setState({ blockInfo: res.data.body })
        }
      }).catch(err => {
        console.log(err);
      })
  }

  render() {
    const { blockInfo } = this.state;
    const height = Number(this.props.params.blockHeight);
    return (
      <div>
        {/* <Link to={"/blocks"}><button>Back to Blocks</button></Link> */}
        {/* <Link to={`/blocks/${height - 1}`}><button>{height - 1}</button></Link>
        <Link to={`/blocks/${height + 1}`}><button>{height + 1}</button></Link> */}
        {/* {blockInfo !== null ?
          <BlockInfoRows blockInfoList={[blockInfo]} /> : <div></div>} */}
        <div className="th-block-explorer__title">
          {/* <LinkButton url={"/blocks"} className="th-be-button__back">Back to Blocks</LinkButton> */}
          <span>Block Detail: {height}</span>
        </div>
        <div className="th-block-explorer__buttons">
          <LinkButton className="th-block-explorer__buttons--prev" url={`/blocks/${height - 1}`} left>Prev</LinkButton>
          <LinkButton className="th-block-explorer__buttons--next" url={`/blocks/${height + 1}`} right>Next</LinkButton>
        </div>
        {blockInfo !== null ?
          <BlockExplorerTable blockInfo={blockInfo} /> : <div></div>}
      </div>
    );
  }
}