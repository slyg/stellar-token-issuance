const {
  accounts: { issuer, distributor },
  serverUrl
} = require("./config.json");
const {
  Server,
  Networks,
  Asset,
  TransactionBuilder,
  Operation,
  Keypair
} = require("stellar-sdk");

const server = new Server(serverUrl);

const main = async () => {
  const issuingAccount = await server.loadAccount(issuer.publicKey);

  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };

  const thresholds = {
    masterWeight: 0, // issuing account private key signature counts for 0, no rights :)
    lowThreshold: 0,
    medThreshold: 0,
    highThreshold: 0 // no more transaction on this account anymore !
  };

  const transaction = new TransactionBuilder(issuingAccount, txOptions)
    .addOperation(Operation.setOptions(thresholds))
    .setTimeout(0)
    .build();

  transaction.sign(Keypair.fromSecret(issuer.secret));

  await server.submitTransaction(transaction);
};

main()
  .then(console.log("ok"))
  .catch(e => {
    console.log("Meh", e);
    throw e;
  });
