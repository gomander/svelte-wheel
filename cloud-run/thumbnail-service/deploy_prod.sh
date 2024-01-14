PROJECT_ID=svelte-wheel

gcloud run deploy thumbnails-service \
  --source dist \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars=NODE_ENV=prod \
  --memory 1Gi \
  --project $PROJECT_ID
