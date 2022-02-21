const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepository(response, repositoryIndex){
  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found.' });
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota;

  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id); 
  validateRepository(response, repositoryIndex);

  const { title, url, techs, likes } = request.body;

  const oldRepository = repositories.find(oldRepository => oldRepository.id === id); 

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repository.likes = oldRepository.likes;
  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  // DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  validateRepository(response, repositoryIndex);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id); 
  validateRepository(response, repositoryIndex);

  const repository = repositories.find(repository => repository.id === id); 

  if(repository.id < 0)
    return response.status(400).json({ error: 'Repository not found.' });

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
