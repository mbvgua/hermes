# Backend

The application backend has been built in [`NodeJs`](https://nodejs.org/en) and [`Express`](https://expressjs.com/) with [`Typescript`](https://www.typescriptlang.org/), to get started you need to have NodeJs and your preferred package manager of choice; I have used [`pnpm`](https://pnpm.io/).

## Features

Some worthwhile features I intend to implement here include:

- [ ] Pagination of `GET` routes
- [ ] Rate-limiting with `express-rate-limit`
- [ ] Oauth with `passport.js`
- [ ] Mpesa Integration with `daraja api`
- [ ] Testing with `jest`
- [ ] Logging with `winston`

## Setup

1. Navigate to the project directory:

```bash
    cd backend/
```

1. Install all the necessary dependencies and once successful, start the server:

```bash
    pnpm install
    # or if using npm
    npm install
```

1. Next you need to create then add your environemt variables to the [.env](./.env) file:

```bash
    cp .env-example .env
```

1. Finally, you can start you server:

```bash
    pnpm start
    # or if using npm
    npm start
```

> [!NOTE]
>
> If you intend to work entirely with the backend, all the routes can be accessed in the [collections](./collections/) directory. All you need to have is an in-built rest-client; If you're in the Vim/Neovim ecosystem, `kulala.nvim` or `rest-client.nvim` are some popular choices.
>
> You will need to have Typescript installed on your machine, since the application is built in Typescript, then compiled to Javascript.
