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
  const distributorAccount = await server.loadAccount(distributor.publicKey);

  const breadAsset = new Asset("BRD", issuer.publicKey);

  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };

  const manageSellOfferOpts = {
    selling: breadAsset,
    buying: Asset.native(),
    amount: "1000",
    price: "1.00000000"
  };

  const transaction = new TransactionBuilder(distributorAccount, txOptions)
    .addOperation(Operation.manageSellOffer(manageSellOfferOpts))
    .setTimeout(0)
    .build();

  transaction.sign(Keypair.fromSecret(distributor.secret));

  await server.submitTransaction(transaction);
};

main()
  .then(() => console.log("ok"))
  .catch(e => {
    console.log("Meh", e);
    throw e;
  });
