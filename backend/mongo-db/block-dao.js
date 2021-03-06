var path = require('path');
//------------------------------------------------------------------------------
//  DAO for block
//------------------------------------------------------------------------------

module.exports = class BlockDAO {

  constructor(execDir, client) {
    // this.aerospike = require(path.join(execDir, 'node_modules', 'mongodb'));
    this.client = client;
    this.blockInfoCollection = 'block';
  }

  upsertBlock(blockInfo, callback) {
    const queryObject = { '_id': parseInt(blockInfo.height) };
    const newObject = {
      'epoch': blockInfo.epoch,
      'status': blockInfo.status,
      'height': parseInt(blockInfo.height),
      'timestamp': blockInfo.timestamp,
      'hash': blockInfo.hash,
      'parent_hash': blockInfo.parent_hash,
      'proposer': blockInfo.proposer,
      'state_hash': blockInfo.state_hash,
      'transactions_hash': blockInfo.transactions_hash,
      'num_txs': blockInfo.num_txs,
      'txs': blockInfo.txs
    };
    this.client.upsert(this.blockInfoCollection, queryObject, newObject, callback);
  }

  getBlock(height, callback) {
    const queryObject = { '_id': height };
    this.client.findOne(this.blockInfoCollection, queryObject, function (error, record) {
      if (error) {
        console.log('ERR - ', error, height);
        // callback(error);
      } else if (!record) {
        callback(Error('NOT_FOUND - ' + height));
      } else {
        // console.log(record);
        var blockInfo = {};
        blockInfo.epoch = record.epoch;
        blockInfo.status = record.status;
        blockInfo.height = record.height;
        blockInfo.timestamp = record.timestamp;
        blockInfo.hash = record.hash;
        blockInfo.parent_hash = record.parent_hash;
        blockInfo.proposer = record.proposer;
        blockInfo.state_hash = record.state_hash;
        blockInfo.transactions_hash = record.transactions_hash;
        blockInfo.num_txs = record.num_txs;
        blockInfo.txs = record.txs;
        callback(error, blockInfo);
      }
    })

  }

  getBlocksByRange(min, max, callback) {
    const queryObject = { '_id': { $gte: min, $lte: max } };
    this.client.query(this.blockInfoCollection, queryObject, function (error, recordList) {
      var blockInfoList = []
      for (var i = 0; i < recordList.length; i++) {
        var blockInfo = {};
        blockInfo.epoch = recordList[i].epoch;
        blockInfo.status = recordList[i].status;
        blockInfo.height = recordList[i].height;
        blockInfo.timestamp = recordList[i].timestamp;
        blockInfo.hash = recordList[i].hash;
        blockInfo.parent_hash = recordList[i].parent_hash;
        blockInfo.proposer = recordList[i].proposer;
        blockInfo.state_hash = recordList[i].state_hash;
        blockInfo.transactions_hash = recordList[i].transactions_hash;
        blockInfo.num_txs = recordList[i].num_txs;
        blockInfo.txs = recordList[i].txs;
        blockInfoList.push(blockInfo);
      }
      callback(error, blockInfoList)
    })
  }
}