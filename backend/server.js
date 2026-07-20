const express = require("express");
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(
  path.join(__dirname, '../docs/openapi.yaml')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/swagger-test', (req, res) => {
  res.send('Swagger route exists');
});

let bugs = [
    {
        id: 1,
        title: "Login error",
        priority: "HIGH",
        status: "OPEN"
    },
    {
        id: 2,
        title: "Button not working",
        priority: "MEDIUM",
        status: "TESTING"
    }
];


// GET all bugs
app.get("/api/bugs", (req, res) => {

    res.json(bugs);

});


// GET bug by id
app.get("/api/bugs/:id", (req, res) => {

    const bug = bugs.find(
        b => b.id === Number(req.params.id)
    );


    if (!bug) {
        return res.status(404).json({
            message: "Bug not found"
        });
    }


    res.json(bug);

});


// POST create bug
app.post("/api/bugs", (req, res) => {

    if (!req.body.title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

   const newBug = {
    id: bugs.length > 0 
        ? Math.max(...bugs.map(bug => bug.id)) + 1 
        : 1,
    title: req.body.title,
    priority: req.body.priority,
    status: "OPEN"
};

    const existingBug = bugs.find(
    bug => bug.title === req.body.title
);

if (existingBug) {
    return res.status(400).json({
        message: "Bug title already exists"
    });
}

    bugs.push(newBug);

    res.status(201).json(newBug);

});

// PUT update bug
app.put("/api/bugs/:id", (req, res) => {

    const bug = bugs.find(
        b => b.id === Number(req.params.id)
    );


    if (!bug) {

        return res.status(404).json({
            message: "Bug not found"
        });

    }


    if (req.body.title) {
        bug.title = req.body.title;
    }


    if (req.body.priority) {
        bug.priority = req.body.priority;
    }


    if (req.body.status) {
        bug.status = req.body.status;
    }


    res.json(bug);

});

// DELETE bug
app.delete("/api/bugs/:id", (req, res) => {

    const bugIndex = bugs.findIndex(
        b => b.id === Number(req.params.id)
    );


    if (bugIndex === -1) {
        return res.status(404).json({
            message: "Bug not found"
        });
    }


    const deletedBug = bugs.splice(bugIndex, 1);


    res.json(deletedBug[0]);

});

// GET system status
console.log("STATUS ROUTE LOADED");

app.get("/api/status", (req, res) => {

    res.json({
        status: "OK",
        service: "Bug Tracker API",
        timestamp: new Date()
    });

});


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;