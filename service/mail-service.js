const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // async sendActivationMail(to, link) {
  //   await this.transporter.sendMail({
  //     from: process.env.SMTP_USER,
  //     to,
  //     subject: "Crypto Trade",
  //     text: "",
  //     html: `
  //                   <div>
  //                       <h1>Activate your account on Crypto Trade</h1>
  //                       <h2>Your accout is created! To use it you have to confirm your email. To activate yout account tap the link below and login</h2>
  //                       <a href="${link}">${link}</a>
  //                   </div>
  //               `,
  //   });
  // }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Crypto Trade",
      text: "",
      html: `
      <!DOCTYPE html>
<html>
  <head>
    <title>Стилизованное письмо</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f1f1f1;
      }
      .container {
        max-width: 440px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #cccccc;
      }
      h1 {
        color: #007bff;
      }
      p {
        color: #333333;
      }

      .letter-main-logo {
        align-self: center;
        width: 230px;
        height: 65px;
        margin: 0 auto;
        margin-bottom: 10px;
      }

      .letter-body {
        padding: 20px 10px;
        border-radius: 10px;
        border: 1px solid #7d06d2;
        background: #fff;
      }

      .letter-body__main {
      }
      .letter__title {
        font-size: 26px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        color: #414141;
        text-align: center;
        margin-bottom: 30px;
      }

      .letter__title span {
        color: #7d06d2;
        font-size: 26px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      .letter__text {
        color: #242424;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-bottom: 50px;
      }

      .letter__link {
        color: #fff !important;
        font-size: 22px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        border-radius: 10px;
        background: #797ecd;
        text-align: center;
        padding: 5px 10px;
        text-decoration: none;
        max-width: 200px;
        align-self: center;
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
      }

      .letter__alert {
        color: #ff3030;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-bottom: 30px;
      }

      .letter-body__footer {
        border-top: 1px solid #797ecd;
      }
      .letter__logo {
        color: #8d3dc7;
        font-size: 26px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
      }
      .letter__info {
        color: #000;
        text-align: center;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-bottom: 10px;
      }
      .letter__copirighting {
        color: #000;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="letter-body">
        <div class="letter-body__main">
          <h2 class="letter__title">
            Activate account on <span>CryptoTrade</span>
          </h2>
          <p class="letter__text">
            Your accout is created! To use it you have to confirm your email. To
            activate yout account tap the button below and login
          </p>

          <a href="${link}" class="letter__link">activate email</a>
          <p class="letter__alert">
            If you have not registered on our site, ignore this letter.
          </p>
        </div>
        <div class="letter-body__footer">
          <div class="letter__logo">CryptoTrade</div>
          <p class="letter__info">
            Crypto Change operates under the rules of financial, operational and
            legal safety, as well as AML and KYC regulations. All transactions
            are processed via encrypted HTTPS connections with the use of safe
            TLS protocols and encryption algorithms.
          </p>
          <p class="letter__copirighting">
            Crypto Change © All right reserved 2015 - 2023.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>


                `,
    });
  }
}

module.exports = new MailService();
