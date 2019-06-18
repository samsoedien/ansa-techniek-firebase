const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator/check");

const app = express();

app.use(cors({ origin: true }));

app.use(express.json({ extended: false }));

app.post(
  "/",
  [
    check("firstName", "Het invullen van uw voornaam is verplicht")
      .not()
      .isEmpty(),
    check("lastName", "Het invullen van uw achternaam is verplicht")
      .not()
      .isEmpty(),
    check("email", "Het invullen van uw e-mailadres is verplicht")
      .isEmail()
      .not()
      .isEmpty(),
    check("phone", "Het invullen van uw telefoonnummer is verplicht")
      .not()
      .isEmpty(),
    check("message", "Het invullen van een bericht is verplicht")
      .not()
      .isEmpty(),
    check("lastName", "Het invullen van een bericht is verplicht")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    res.status(200).json({ message: "email route works" });

    ("use strict");
    async function main() {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      // let account = await nodemailer.createTestAccount();

      const htmlEmail = `
      <p>Geachte ${req.body.firstName} ${req.body.lastName},</p>

      <p class="default-style">Bedankt voor uw bericht. Ik zal zo spoedig contact met u opnemen.</p>
        
      <h3>Uw contactgegevens</h3>
      <ul>
        <li>Naam: ${req.body.firstName} ${req.body.lastName}</li>
        <li>Adres: ${req.body.address} ${req.body.postalCode} ${
        req.body.city
      }</li>
        <li>Email: ${req.body.email}</li>
        <li>Telefoonnummer: ${req.body.phone}</li>
        <li>Omschrijving: ${req.body.subject}</li>
        <li>Offerte: ${
          req.body.offerte
            ? "Er is een verzoek ingedient voor een offerte"
            : "Niet van toepassing"
        }</li>
      </ul>
      <h3>Uw bericht</h3>
      <p>${req.body.message}</p>
      
      <p class="default-style"><span style="font-size: 10pt; font-family: helvetica;">Met vriendelijke groet,<br /></span></p>
      <p class="default-style"><span style="font-size: 10pt; font-family: helvetica;">André Samsoedien</span></p>
      <div class="default-style"><span style="font-size: 7pt; font-family: helvetica;">--</span></div>
      <div class="default-style"><span style="font-size: 7pt; font-family: helvetica;">A. Samsoedien</span></div>
      <div class="default-style"><span style="font-size: 7pt; font-family: helvetica;">Oprichter Ansa-techniek</span><span style="font-size: 7pt; font-family: helvetica;"></span></div>
      <div class="default-style"></div>
      <div class="default-style"><span style="font-size: 7pt; font-family: helvetica;">T: +31 (0)6 37 36 28 17</span></div>
      <div class="default-style"><span style="font-size: 7pt; font-family: helvetica;">E: <a href="mailto:info@ansa-techniek.nl">info@ansa-techniek.nl</a></span></div>
      <div class="default-style"><span style="font-size: 7pt; font-family: helvetica;">W: <a href="https://www.ansa-techniek.nl">https://www.ansa-techniek.nl</a></span></div>
    `;

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: process.env.TRANSPORTER_HOST,
        port: process.env.TRANSPORTER_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.TRANSPORTER_USERNAME, //account.user, // generated ethereal user
          pass: process.env.TRANSPORTER_PASSWORD //account.pass // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Samsoedien, A" <info@ansa-techniek.nl>', // sender address
        to: req.body.email, // list of receivers
        cc: "info@ansa-techniek.nl",
        replyTo: req.body.email,
        subject: req.body.subject, // Subject line
        text: req.body.message, // plain text body
        html: htmlEmail // html body
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      console.log(transporter.options.host);

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      return res.status(201).json({ confirmation: true });
    }
    main().catch(console.error);
  }
);

exports.contact = functions.https.onRequest(app);
