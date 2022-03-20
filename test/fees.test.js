process.env.NODE_ENV = "test";
process.env.PORT = 3001;
process.env.DB_URL = "mongodb://localhost:27017/lannister-pay-test";
let chai = require("chai");
let server = require("../index");
let chaiHttp = require("chai-http");
const { expect } = require("chai");
const mongoose = require("mongoose");
let should = chai.should();

chai.use(chaiHttp);

describe("/POST Upload and compute fees", function () {
  after(async () => {
    await mongoose.connection.db.dropCollection("fees");
  });
  it("It should post the fees", function (done) {
    chai
      .request(server)
      .post("/fees")
      .send({
        FeeConfigurationSpec:
          "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55",
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
        res.body.should.have.property("AppliedFeeID").eql("LNPY1223");
        res.body.should.have.property("AppliedFeeValue").eql(120);
        res.body.should.have.property("ChargeAmount").eql(5120);
        res.body.should.have.property("SettlementAmount").eql(5000);
        done();
      });
  });

  it("It should accept a single payload and give transacton fees 2", function (done) {
    chai
      .request(server)
      .post("/compute-transaction-fee")
      .send({
        ID: 91204,
        Amount: 3500,
        Currency: "NGN",
        CurrencyCountry: "NG",
        Customer: {
          ID: 4211232,
          EmailAddress: "anonimized292200@anon.io",
          FullName: "Wenthorth Scoffield",
          BearsFee: false,
        },
        PaymentEntity: {
          ID: 2203454,
          Issuer: "AIRTEL",
          Brand: "",
          Number: "080234******2903",
          SixID: 080234,
          Type: "USSD",
          Country: "NG",
        },
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("AppliedFeeID").eql("LNPY1221");
        res.body.should.have.property("AppliedFeeValue").eql(49);
        res.body.should.have.property("ChargeAmount").eql(3500);
        res.body.should.have.property("SettlementAmount").eql(3451);
        done();
      });
  });

  it("It should accept a single payload and give error for no configuration", function (done) {
    chai
      .request(server)
      .post("/compute-transaction-fee")
      .send({
        ID: 91204,
        Amount: 3500,
        Currency: "USD",
        CurrencyCountry: "US",
        Customer: {
          ID: 4211232,
          EmailAddress: "anonimized292200@anon.io",
          FullName: "Wenthorth Scoffield",
          BearsFee: false,
        },
        PaymentEntity: {
          ID: 2203454,
          Issuer: "WINTERFELLWALLETS",
          Brand: "",
          Number: "AX0923******0293",
          SixID: "AX0923",
          Type: "WALLET-ID",
          Country: "NG",
        },
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have
          .property("Error")
          .eql("No fee configuration is applicable to this transaction.");

        done();
      });
  });
});
