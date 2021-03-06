var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var transactionRouter = (app, transactionDao, progressDao, config) => {
  router.use(bodyParser.urlencoded({ extended: true }));

  router.get("/transaction/:hash", (req, res) => {
    let hash = req.params.hash;
    console.log('Querying one transaction by using uuid: ' + hash);
    progressDao.getProgressAsync(config.blockchain.network_id)
      .then((progressInfo) => {
        latest_transaction_count = progressInfo.count;
        return transactionDao.getTransactionByPkAsync(hash)
      })
      .then(transactionInfo => {
        var data = ({
          type: 'transaction',
          body: transactionInfo,
          totalTxsNumber: latest_transaction_count
        });
        res.status(200).send(data);
      })
      .catch(error => {
        if (error.message.includes('NOT_FOUND')) {
          const err = ({
            type: 'error_not_found',
            error
          });
          res.status(404).send(err);
        } else {
          console.log('ERR - ', error)
        }
      });;
  });

  router.get("/transactions", (req, res) => {
    progressDao.getProgressAsync(config.blockchain.network_id)
      .then((progressInfo) => {
        latest_transaction_count = progressInfo.count;
        return transactionDao.getTransactionsAsync(1, latest_transaction_count)
      })
      .then(transactionInfoList => {
        var data = ({
          type: 'transaction_list',
          body: transactionInfoList,
        });
        res.status(200).send(data);
      });
  });

  router.get("/transactions/range", (req, res) => {
    numberOfTransactions = 10;
    let totalPageNumber, pageNumber = 1;
    progressDao.getProgressAsync(config.blockchain.network_id)
      .then((progressInfo) => {
        latest_transaction_count = progressInfo.count;
        console.log('Latest transaction count: ' + latest_transaction_count.toString());
        var query_txs_count_max = latest_transaction_count;
        var query_txs_count_min = Math.max(0, query_txs_count_max - numberOfTransactions + 1); // pushing 100 blocks initially
        totalPageNumber = Math.ceil(latest_transaction_count / req.query.limit);
        if (req.query.pageNumber !== undefined && req.query.limit !== undefined) {
          const { limit } = req.query;
          pageNumber = req.query.pageNumber;
          query_txs_count_max = latest_transaction_count - pageNumber * limit;
          query_txs_count_min = Math.max(1, query_txs_count_max - limit + 1);
        }
        console.log('REST api querying transactions from ' + query_txs_count_min.toString() + ' to ' + query_txs_count_max.toString())
        //return blockDao.getBlockAsync(123) 
        return transactionDao.getTransactionsAsync(query_txs_count_min, query_txs_count_max)
      })
      .then(transactionInfoList => {
        var data = ({
          type: 'transaction_list',
          body: transactionInfoList,
          totalPageNumber,
          currentPageNumber: pageNumber
        });
        res.status(200).send(data);
      });
  })
  //the / route of router will get mapped to /api
  app.use('/api', router);
}

module.exports = transactionRouter;