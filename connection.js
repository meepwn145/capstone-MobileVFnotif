const express = require('express');
const mongoose = require('mongoose');
const collection = require('./mongo');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  try {
    const avatarUrl = req.file.path;
    res.json({ avatarUrl });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error uploading avatar');
  }
});

app.delete("/delete/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const deletedRecord = await collection.findOneAndDelete({ email: email });

    if (!deletedRecord) {
      return res.status(404).send("Record not found");
    }

    res.send(deletedRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/update/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const updatedUserData = req.body;

    const updatedRecord = await collection.findOneAndUpdate(
      { email: email },
      { $set: updatedUserData },
      { returnOriginal: false }
    );

    if (!updatedRecord) {
      return res.status(404).send("User not found");
    }

    res.send(updatedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the user record.");
  }
});

app.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await collection.findOne({ email: email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/', cors(), (req, res) => {});
app.post('/', async (req, res) => {
  const { email, password, vehicle, plate, fName, lName, address, birthday,contact} = req.body;

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      if (check.password === password) {
        res.json('exist');
      } else {
        res.json('notexist');
      }
    } else {
      res.json('notexist');
    }
  } catch (e) {
    res.json('fail');
  }
});

app.post('/signup', async (req, res) => {
  const { email, password, vehicle, plate, fName, lName, address, birthday, contact} = req.body;

  const data = {
    email: email,
    password: password,
    vehicle: vehicle,
    plate: plate,
    fName: fName,
    lName: lName,
    address: address,
    birthday: birthday,
    contact: contact
  };

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      res.json('exist');
    } else {
      res.json('notexist');
      await collection.create(data);
    }
  } catch (e) {
    res.json('fail');
  }
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});