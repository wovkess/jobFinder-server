const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 7000;


app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
}).then(() => console.log('DB connected')).catch(err => console.log(err));

const jobSchema = new mongoose.Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    salaryRange: { type: String },
    status: { type: String, default: "Pending" },
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', async (req, res) => {
    try{
        res.json({message: 'hello world'});
    } catch (err){
        res.status(500).json({ error: err.message });
    }
})

app.post('/jobs', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/jobs/:id', async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/jobs/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));