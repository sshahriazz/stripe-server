const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_DuSG6ZnqiAFAngTiep2WnmsH');
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const calculateOrderAmount = () => {
  return 3000;
};
app.post('/createpi', async (req, res) => {
  const { items } = req.body;

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

const YOUR_DOMAIN = 'http://localhost:3000/company-information';
const corsOptions = { origin: '*' };

app.post('/createcs', cors(corsOptions), async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // TODO: replace this with the `price` of the product you want to sell
        price: 'price_1JrJldEp7iMlLK9IYxXl0pfD',
        quantity: 5
      }
    ],
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`
  });
  res.send(session.url);
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
