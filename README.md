# WORKFLOW API

This repository is used to manage the development of the open-source "Workflow" application.
The application aims to bring a new way of doing project management with various integrations available.

## Development mode

To start the development, several solutions are possible.

### Using VSCode Dev Container

Clone the repository into your local machine

```bash
gh repo clone Torvald-Workflow/graphql-api # PREFERED METHOD
# OR
git@github.com:Torvald-Workflow/graphql-api.git
# OR
https://github.com/Torvald-Workflow/graphql-api.git
```

Then, launch the devcontainer using CTRL + MAJ + P and type `Remote-Containers: Open Folder in Container`.

Your are now ready to start!

### Using Node.JS directly

Clone the repository into your local machine

```bash
gh repo clone Torvald-Workflow/graphql-api # PREFERED METHOD
# OR
git@github.com:Torvald-Workflow/graphql-api.git
# OR
https://github.com/Torvald-Workflow/graphql-api.git
```

Then, install postgresql [using Docker](https://hub.docker.com/_/postgres/) or install [in your machine directly](https://www.postgresql.org/download/).

Do a `yarn install` and let's get started!

### Last step

You need to copy the `.env.example` to `.env` and fill with your informations (for devcontainers users, you may not need to edit the file as it is already configured).
