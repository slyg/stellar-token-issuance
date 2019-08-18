const {
  accounts: { issuer, distributor, buyer },
  serverUrl
} = require("./config.json");
const { Server } = require("stellar-sdk");

const displayTemplate = ({ name, accountId, balances }) => {
  console.log(
    `\u001b[33m${name}\u001b[0m \u001b[37;2m${accountId.substring(
      0,
      9
    )}${Array.from(new Array(15 - name.length))
      .map(() => "⋅")
      .join("")}\u001b[0m${balances}`
  );
};

const server = new Server(serverUrl);

const checkAccounts = async () => {
  const stellarAccounts = await Promise.all(
    [issuer, distributor, buyer].map(async ({ name, publicKey }) => {
      const account = await server.loadAccount(publicKey);
      return {
        name,
        accountId: publicKey,
        balances: account.balances.map(
          ({ balance, asset_type, asset_code }) =>
            `${balance} ${asset_type === "native" ? "XLM" : asset_code}`
        )
      };
    })
  );

  stellarAccounts.forEach(displayTemplate);
};

checkAccounts().catch(e => {
  console.log("Meh", e);
  throw e;
});
