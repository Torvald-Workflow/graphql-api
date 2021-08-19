[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9da19ea5000143919547027d2f76d34a)](https://www.codacy.com/gh/Torvald-Workflow/graphql-api/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Torvald-Workflow/graphql-api&utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/9da19ea5000143919547027d2f76d34a)](https://www.codacy.com/gh/Torvald-Workflow/graphql-api/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Torvald-Workflow/graphql-api&utm_campaign=Badge_Coverage)

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
