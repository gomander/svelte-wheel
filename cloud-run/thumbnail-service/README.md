# Svelte Wheel Thumbnail Service

# Developing

Install dependencies: `pnpm i`  
Create the `env.js` file from the template  
Get the necessary files from the main app: `pnpm copy-files-to-lib`  
Start the development server: `pnpm dev`

## Building

To build for production: `pnpm build`  

## Testing

No tests are available for the service currently.  

## Deploying

Deploying must currently be done manually by running `pnpm run deploy`. In the
future it will be handled by GitHub Actions.  
GitHub repository secrets: `THUMBNAIL_SERVICE_ENV_FILE` should contain the
contents of `env.js`. Also uses `FIREBASE_DEPLOYER_SERVICE_ACCOUNT`.  
