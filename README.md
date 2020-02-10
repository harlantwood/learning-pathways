# LeaP - learning-pathways

LeaP is a Peer to Peer education system based on Holochain. Developed during the first community run Holochain DevCamp #6.

This repository is used as a learning resource for the students learning how to program Holochain hApps on the Rust lang.

### Running a UI (or two)
To be able to run the UI and have a working version, follow the below steps:

1. Navigate to the ui-folder
2. Run the 'npm install' command

#### Run two agents for demo-ing purpose:
1. Open terminal
2. Run 'nix-shell https://holochain.love"
3. Navigate to ui-folder
4. Run 'npm run demo'
5. Open browser window and visit: http://localhost:8080
6. Open second browser window and visit: http://localhost:8081

#### Run a single agent:
1. Open terminal
2. Run 'nix-shell https://holochain.love"
3. Navigate to ui-folder
4. Run 'npm run hc:alice'
5. Open another terminal
6. Run 'npm run ui:alice'
7. Open browser window and visit: http://localhost:8080

#### Frontend Stack
The front-end stack being used (see package.json):
* [LitElement](https://lit-element.polymer-project.org/)
* [GraphQL](https://graphql.org/)
* [ApolloClient](https://github.com/apollographql/apollo-client)
