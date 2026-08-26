# Serverless Cloud Portfolio & Real-Time Visitor Counter

A production-grade, globally distributed cloud portfolio hosted entirely on **Amazon Web Services (AWS)** utilizing modern DevOps practices, edge caching, least-privilege IAM security, and a serverless analytics backend.

🔗 **Live Deployment:** [d1f9cvb3gi4lhw.cloudfront.net](https://d1f9cvb3gi4lhw.cloudfront.net)

---

## 🏛️ Architecture Overview

```text
[ Client Browser ]
       │
       ├── (HTTPS / Edge Delivery) ──▶ [ Amazon CloudFront (CDN) ] ── (OAC) ──▶ [ Amazon S3 (Origin Bucket) ]
       │
       └── (API Call - GET /views) ──▶ [ Amazon API Gateway (HTTP API) ]
                                                   │
                                                   ▼
                                         [ AWS Lambda (Python) ]
                                                   │ (Atomic Updates)
                                                   ▼
                                         [ Amazon DynamoDB ]
```
### Key Engineering Highlights
-Global Edge Acceleration: Routed through Amazon CloudFront distribution with edge PoP caching, low-latency delivery, and automatic HTTPS redirection.

-Origin Security & Zero Public Exposure: S3 origin bucket configured with Block All Public Access enabled; access is restricted exclusively to CloudFront through Origin Access Control (OAC) and granular bucket policies.

-Serverless Visitor Tracking API: Built using Amazon API Gateway (HTTP API) integrated with AWS Lambda (Python 3.12) to record and serve live view counts.

-Atomic Counter Persistence: Backed by Amazon DynamoDB with an on-demand billing model and atomic ADD update expressions to prevent race conditions during concurrent traffic.

-DevOps & Automated CI/CD: Fully automated deployment pipeline using GitHub Actions. Pushes to main synchronize static assets to S3 and trigger immediate CloudFront cache invalidations via IAM credentials.

-Zero Cost Infrastructure: Built 100% within the permanent AWS Free Tier.

### Tech Stack
* Cloud Provider: Amazon Web Services (AWS)
* Compute: AWS Lambda (Python)
* Storage & Edge: Amazon S3, Amazon CloudFront
* Database: Amazon DynamoDB (NoSQL)
* API Layer: Amazon API Gateway (HTTP API)
* DevOps / CI/CD: GitHub Actions, Git
* Frontend: HTML5, CSS3, JavaScript (Fetch API)

### CI/CD Workflow Breakdown
-Code changes committed and pushed to the main branch trigger .github/workflows/deploy.yml.


-Pipeline authenticates via GitHub Secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).

-Assets are synced to the target S3 bucket via AWS CLI:
```bash
aws s3 sync . s3://<BUCKET-NAME> --exclude ".git*" --exclude "README.md" --delete
```

-Pipeline creates an invalidation on CloudFront to refresh edge caches globally:
```bash
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION-ID> --paths "/*"
```
### Author
Name: Shubh Pandya

GitHub: @ShubhPandya

LinkedIn: shubh-pandya-sp
