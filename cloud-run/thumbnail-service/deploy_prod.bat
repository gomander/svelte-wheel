set PROJECT_ID=svelte-wheel

call gcloud builds submit --tag gcr.io/%PROJECT_ID%/thumbnails-service ^
  --project %PROJECT_ID%

call gcloud run deploy thumbnails-service ^
  --image gcr.io/%PROJECT_ID%/thumbnails-service ^
  --platform managed ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --set-env-vars=NODE_ENV=prod ^
  --memory 1Gi ^
  --project %PROJECT_ID%
