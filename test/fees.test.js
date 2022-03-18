process.env.NODE_ENV = "test";
process.env.PORT = 3001;
process.env.DB_URL = "mongodb://localhost:27017/lannister-pay-test";
let chai = require("chai");
let server = require("../index");
let chaiHttp = require("chai-http");
const { expect } = require("chai");

let should = chai.should();

chai.use(chaiHttp);

describe("/POST Fees", function () {
  it("It should post the fees", function (done) {
    chai
      .request(server)
      .post("/fees")
      .send({
        FeeConfigurationSpec:
          "LNPY1221 NGN * *(*) : APPLY PERC 1.4\\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55",
      })
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        res.body.should.have.property("status").eql("ok");
        done();
      });
  });
});

describe("/POST compute-transaction-fee", function () {
  it("It should accept a single payload and give transacton fees", function (done) {
    chai
      .request(server)
      .post("/compute-transaction-fee")
      .send({
        ID: 91203,
        Amount: 5000,
        Currency: "NGN",
        CurrencyCountry: "NG",
        Customer: {
          ID: 2211232,
          EmailAddress: "anonimized29900@anon.io",
          FullName: "Abel Eden",
          BearsFee: true,
        },
        PaymentEntity: {
          ID: 2203454,
          Issuer: "GTBANK",
          Brand: "MASTERCARD",
          Number: "530191******2903",
          SixID: 530191,
          Type: "CREDIT-CARD",
          Country: "NG",
        },
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("AppliedFeeID").eql("LNPY0222");
        res.body.should.have.property("AppliedFeeValue").eql(230);
        res.body.should.have.property("ChargeAmount").eql(5230);
        res.body.should.have.property("SettlementAmount").eql(5000);
        done();
      });
  });
});
