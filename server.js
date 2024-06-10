const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// اتصال به MongoDB
mongoose.connect('mongodb+srv://ENMGGS:VgjgZuA10IMTzMth@cluster0.myqnkk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// ایجاد اسکیمای کاربر
const userSchema = new mongoose.Schema({
  userId: String,
  coins: Number,
  clickRate: Number,
  clickLimit: Number,
  clickValue: Number,
  upgradeCost: Number,
  upgradeValueCost: Number,
  clicks: Number,
  upgradeClickLevel: Number,
  upgradeValueLevel: Number
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// دریافت یا ایجاد کاربر جدید
app.post('/api/getOrCreateUser', async (req, res) => {
  const { userId } = req.body;
  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({
      userId,
      coins: 0,
      clickRate: 1,
      clickLimit: 5,
      clickValue: 1,
      upgradeCost: 100,
      upgradeValueCost: 100,
      clicks: 0,
      upgradeClickLevel: 1,
      upgradeValueLevel: 1
    });
    await user.save();
  }

  res.send(user);
});

// ذخیره داده‌های کاربر
app.post('/api/saveUser', async (req, res) => {
  const { userId, data } = req.body;

  const user = await User.findOneAndUpdate({ userId }, data, { new: true });

  res.send(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));