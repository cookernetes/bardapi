# bardapi

<p>
A strongly typed (unofficial) interface to communicate with Google's Bard AI via NodeJS.
<br/>
</p>

![Contributors](https://img.shields.io/github/contributors/cookernetes/bardapi?color=dark-green) ![Issues](https://img.shields.io/github/issues/cookernetes/bardapi) ![License](https://img.shields.io/github/license/cookernetes/bardapi)

## Table Of Contents

- [bardapi](#bardapi)
  - [Table Of Contents](#table-of-contents)
  - [Built With](#built-with)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Authentication](#authentication)
  - [Usage](#usage)
  - [License](#license)
  - [Authors](#authors)

## Built With

- TypeScript

## Getting Started

To get started, follow these steps:

### Prerequisites

Install the NPM package:

```sh
npm install bardapi
```

Or with yarn:

```sh
yarn add bardapi
```

### Authentication

> ⚠️ Please note that getting your token will **may not be correct** if you are signed into multiple Google accounts. If you are signed into multiple accounts, please open an Incognito tab and only sign into the account that has access to Bard in order to obtain the correct token.

Go to https://bard.google.com/

- Press F12 to open the developer console
- Application > Cookies > `https://bard.google.com` > `__Secure-1PSID` > Copy the cookie value

Create a `.env` file where `BARD_TOKEN` is the value you copied from the cookie.

```env
TOKEN="BARD_TOKEN"
```

## Usage

Import the API and create an instance of Bard:

```js
import { config } from "dotenv";
import { BardAPI } from "bardapi";

config(); // initialise dotenv

const bard = new BardAPI({ sessionId: process.env.TOKEN });
```

Simple conversation:

```js
const res = await bard.ask({ message: "What's the news today?" });
console.log(res.response);

const res2 = await bard.ask({
  message: "Summarise the information into a small paragraph",
});
console.log(res2.response);
```

Accessing different choices of response:

```js
const res = await bard.ask({ message: "Pick a random number" });
console.log(res.otherChoices[1].message);

const res2 = await bard.ask({
  message: "What number did you pick?",
  previousChoiceId: res.otherChoices[1].choiceId, // continue using otherChoices[1]
});
console.log(res.response);

bard.reset(); // clears Bard's memory of the chat
```

## License

Distributed under the Apache 2.0 License. See [LICENSE](https://github.com/cookernetes/bardapi/blob/main/LICENSE) for more information.

## Authors

- [**cookernetes**](https://github.com/cookernetes/) - Project Lead
- [**Conqu3red**](https://github.com/conqu3red/) - Reverse Engineering Aid
