// const express = require('express');
// eslint-disable-next-line no-undef
const express = require('express');
const app = express();
// This is a sample test API key.
// eslint-disable-next-line no-undef
const stripe = require('stripe')('sk_test_DuSG6ZnqiAFAngTiep2WnmsH');
// eslint-disable-next-line no-undef
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json());

app.use(cors());

const calculateOrderAmount = () => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 3000;
};

app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'eur',
    payment_method_types: [
      'giropay',
      'eps',
      'p24',
      'sofort',
      'sepa_debit',
      'card',
      'bancontact',
      'ideal'
    ]
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount
  });
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
