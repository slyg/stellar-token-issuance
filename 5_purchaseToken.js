const {
  accounts: { issuer, distributor, buyer },
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
  const buyerAccount = await server.loadAccount(buyer.publicKey);

  const breadAsset = new Asset("BRD", issuer.publicKey);

  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };

  const changeTrustOpts = {
    asset: breadAsset,
    limit: "500"
  };

  const manageSellOfferOpts = {
    selling: Asset.native(),
    buying: breadAsset,
    amount: "1",
    price: "1"
  };

  const transaction = new TransactionBuilder(buyerAccount, txOptions)
    .addOperation(Operation.changeTrust(changeTrustOpts))
    .addOperation(Operation.manageSellOffer(manageSellOfferOpts))
    .setTimeout(0)
    .build();

  transaction.sign(Keypair.fromSecret(buyer.secret));

  await server.submitTransaction(transaction);
};

main()
  .then(console.log("ok"))
  .catch(e => {
    console.log("Meh", e);
    throw e;
  });
