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
  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };

  const distributorAccount = await server.loadAccount(distributor.publicKey);

  const breadAsset = new Asset("BRD", issuer.publicKey);

  const changeTrustOpts = {
    asset: breadAsset,
    limit: "1000"
  };

  const transaction = new TransactionBuilder(distributorAccount, txOptions)
    .addOperation(Operation.changeTrust(changeTrustOpts))
    .setTimeout(0)
    .build();

  transaction.sign(Keypair.fromSecret(distributor.secret));

  await server.submitTransaction(transaction);
};

main()
  .then(console.log("ok"))
  .catch(e => {
    console.log("Meh", e);
    throw e;
  });
