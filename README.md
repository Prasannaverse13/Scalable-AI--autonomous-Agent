## 🌌 About
<div>
The Scalable AI Platform is a cutting-edge solution designed for creating, deploying, and managing autonomous and semi-autonomous AI agents powered by large language models (LLMs). This platform provides a robust environment for building intelligent workflows that can automate a wide range of tasks, such as QA chat bots, code generation, data extraction, data analysis, and more. 
<br>
</div>

##### Build AI powered workflows:
- QA chat bots
- Code generation
- Data extraction
- Data analysis
- Data augmentation
- Research assistants

## Key Features

### 🧠 Models
  - OpenAI
  - Google PaLM (Experimental)
  - Anthropic (Experimental)
  - Llama (Experimental)

### ⚒️ No-code Agent Editor
No-code editor for creating and testing agents. The editor provides an interface to drop and connect nodes into a graph
representing the cognitive logic of an agent. Chat is embedded in the editor to allow for rapid testing and debugging.

![Screenshot (823)](https://github.com/user-attachments/assets/8c42fda9-ffcb-45d7-91de-882ac05d6d5e)


### 💬 Multi-Agent Chat interface
Create your own teams of agents and interact with them through a single interface. Chat room support multiple agents.
By default it includes the IX moderator agent, which delegates tasks to other agents. You can `@mention` specific 
agents to complete the tasks.

![Screenshot (824)](https://github.com/user-attachments/assets/6f29dda2-5976-4c44-8245-57d81d70af6f)


### ⚙️ Component Config Layer

IX implements a component config layer that maps LangChain components to the configuration graph. The config layer
powers a number of other systems and features. For example, component field and connector definitions are used to
render nodes and forms dynamically in the no-code editor. 


## 🛠️ Getting Started

##### Prerequisites
<details> 
  <summary>Windows Linux Subsystem (windows only)</summary> 
  <ol>
      <li>Open powershell</li>
      <li>run `wsl --install` to install and/or activate WSL</li>
  </ol>
</details>
<details> 
  <summary>Docker</summary>
  Install Docker Desktop for your OS:<br/>
  <A href="https://www.docker.com/products/docker-desktop/">https://www.docker.com/products/docker-desktop/</A>

  Detailed install instructions:
  <ul>
    <li><a href="https://docs.docker.com/desktop/install/mac-install/">Mac</a></li>
    <li><a href="https://docs.docker.com/desktop/install/windows-install/">Windows</a></li>
  </ul>
</details>
<details> 
  <summary>Python</summary> 
  Python 3.8 or higher is required for the CLI. The app python version is managed by the image.
</details>


### Agent-IX CLI

The quickest way to start IX is with the agent-ix CLI. The CLI starts a preconfigured docker cluster with 
docker-compose. It downloads the required images automatically and starts the app cluster.

```bash
pip install agent-ix
ix up
```

Scale agent workers with the `scale` command. Each worker will run agent processes in parallel. The limit to the number
of workers is based on available memory and CPU capacity.

```bash
ix scale 5
```

The client may start a specific version, including the unstable `dev` image built on `master` branch.
```bash
ix up --version dev
```


## How does it work


### Basic Usage
You chat with an agent that uses that direction to investigate, plan, and complete tasks. The agents are
capable of searching the web, writing code, creating images, interacting with other APIs and services. If it can be 
coded, it's within the realm of possibility that an agent can be built to assist you.

1. Setup the server and visit [http://0.0.0.0:8000](http://0.0.0.0:8000), a new chat will be created automatically with the default agents.

2. Enter a request and the IX moderator will delegate the task to the agent best suited for the response. Or `@mention`
an agent to request a specific agent to complete the task.

3. Customized agents may be added or removed from the chat as needed to process your tasks

### Creating Custom Agents and Chains

IX provides the moderator agent IX, a coder agent, and other example agents. Custom agents 
may be built using the chain editor or the python API. 

#### Chain Editor

1. Navigate to the [chain editor](http://localhost:8000/chains/new)
2. Click on the root connector to open the component search
3. Drag agents, chains, tools, and other components into the editor
4. Connect the components to create a chain
5. Open the test chat to try it out!

#### Python API
Chains [python API docs](docs/chains/chains.rst)



## 🧙 Development setup

### 1. Prerequisites

Before getting started, ensure you have the following software installed on your system:

<details> 
  <summary>Windows Linux Subsystem (windows only)</summary> 
  <ol>
      <li>Open powershell</li>
      <li>run `wsl --install` to install and/or activate WSL</li>
  </ol>
</details>
<details> 
  <summary>Docker</summary>
  Install Docker Desktop for your OS:<br/>
  <A href="https://www.docker.com/products/docker-desktop/">https://www.docker.com/products/docker-desktop/</A>

  Detailed install instructions:

  <ul>
    <li><a href="https://docs.docker.com/desktop/install/mac-install/">Mac</a></li>
    <li><a href="https://docs.docker.com/desktop/install/windows-install/">Windows</a></li>
  </ul>
</details>
<details> 
  <summary>Git & Make</summary> 
  <ul>
    <li><b>Mac:</b> <code>brew install git make</code></li>
    <li><b>Linux:</b> <code>apt install git make</code></li>
    <li><b>Windows (WSL):</b> <code>apt install git make</code></li>
  </ul>
</details>


### 2. Clone the repository

```bash
git clone https://github.com/kreneskyp/ix.git
cd ix
```

### 3. Setup env

Setup config in `.env`

```bash
cp .env.template .env
```

```
OPENAI_API_KEY=YOUR_KEY_HERE
```

### 4. Build & Initialize the IX cluster.
The image will build automatically when needed in most cases. Set `NO_IMAGE_BUILD=1` to skip rebuilding the image.

Use the `image` target to build and start the IX images. The `dev_setup` target will build the frontend and 
initialize the database. See the developer tool section for more commands to manage the dev environment.

```
make dev_setup
```

### 5. Run the IX cluster

The IX cluster runs using docker-compose. It will start containers for the web server, app server, agent workers, database,
redis, and other supporting services.

```bash
make cluster
```

### 6. View logs

Web and app container logs
```bash
make server
```

Agent worker container logs
```bash
make worker
```


### 7. Open User Interface

Visit [http://0.0.0.0:8000](http://0.0.0.0:8000) to access the user interface. From there you may create and edit
agents and chains. 
The platform will automatically spawn agent processes to complete tasks as needed.


### Scaling workers
Adjust the number of active agent workers with the `scale` target. The default is 1 agent worker to handle tasks. There
is no hard limit on agents, but the number of workers is limited by available memory and CPU capacity.

```bash
make scale N=5
```


## Developer Tools

Here are some helpful commands for developers to set up and manage the development environment:

### Running:
- `make up` / `make cluster`: Start the application in development mode at [http://0.0.0.0:8000](http://0.0.0.0:8000).
- `make server`: watch logs for web and app containers.
- `make worker`: watch logs for agent worker containers.

### Building:
- `make image`: Build the Docker image.
- `make frontend`: Rebuild the front end (GraphQL, relay, webpack).
- `make webpack`: Rebuild JavaScript only.
- `make webpack-watch`: Rebuild JavaScript on file changes.
- `make dev_setup`: Builds frontend and generates database.
- `make node_types_fixture`: Builds database fixture for component type definitions.

### Database
- `make migrate`: Run Django database migrations.
- `make migrations`: Generate new Django database migration files.

### Utility
- `make bash`: Open a bash shell in the Docker container.
- `make shell`: Open a Django shell_plus session.

### Agent Fixtures

Dump fixtures with the `dump_agent` django command. This command will gather and dump the agent and chain, including
the component graph.

1.
    ```
    make bash
    ```
2.
    ```bash
    ./manage.py dump_agent -a alias
    ```
