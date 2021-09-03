const express = require('express');
const Projects = require('./projects-model');
const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            if(!projects) {
                res.status(404).json([])
            } else {
                res.status(200).json(projects)
            }
        })
        .catch(error => {
            res.status(404).json({ message: 'could not find projects'})
        })
})

router.get('/:id', (req, res) => {
    const projectId = req.params.id;
    Projects.get(projectId)
        .then(currentProject => {
            if (currentProject) {
                res.status(200).json(currentProject);
            } else {
                res.status(404).json( { message: 'could not find projects'} )
            }
        })
        .catch(error => {
            res.status(404).json( { message: 'could not find projects'} )
        })
})

router.post('/', (req, res, next) => {
    const newProject = req.body;
    if (!newProject.name || !newProject.description) {
        res.status(400).json( {message: "missing requirements"});
    } else {
        Projects.insert(newProject)
            .then(insertedProject => {
                res.status(201).json(insertedProject);
            })
            .catch(next);
    }
})

router.put('/:id', (req, res, next) => {
    const updatedProject = req.body;
    const projectId = req.params.id;
    if (!updatedProject.name || !updatedProject.description || updatedProject.completed === undefined) {
        res.status(400).json( {message: "missing requirements"});
    } else { 
        Projects.update(projectId, updatedProject)
            .then(currentProject => { 
                if (currentProject) {
                    Projects.get(currentProject.id)
                        .then(update => {
                            res.status(200).json(update);
                        })
                } else {
                    res.status(404).json( {message: 'cannot find project with the given id'})
                }
            })
            .catch(next);
    }
})

router.delete('/:id', (req, res, next) => {
    const projectId = req.params.id;
    Projects.remove(projectId)
        .then(deletedProject => {
            if (deletedProject > 0) {
                res.status(200).json();
            } else {
                res.status(404).json( {message: 'cannot find project with the given id'})
            }
        })
        .catch(next);
})

router.get('/:id/actions', (req, res, next) => {
    const projectId = req.params.id;
    Projects.getProjectActions(projectId)
        .then(selectedProject => {
            if (selectedProject) {
                res.status(200).json(selectedProject);
            } else {
                res.status(404).json( {message: "cannot find project with the given id"})
            }
        })
        .catch(next);
})
 
module.exports = router;