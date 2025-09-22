URL Shortener

A lightweight Node.js service that takes long, messy URLs and turns them into clean, shareable short links. Built for simplicity, deployable with Docker, and designed as a foundation you can expand into a production-ready tool.

Features

Shorten URLs: Generate compact links from long URLs.

Customizable routes: Organized via Express router.

Database models ready: Project structured for persistence (MongoDB or similar).

Middleware support: Easy to extend with validation, logging, or rate limiting.

Containerized: Includes a Dockerfile for quick deployment.

Tech Stack

Node.js with Express

Yarn for dependency management

Docker for containerization

Project Structure
├── config/ # Configuration files
├── middleware/ # Request/response middlewares
├── models/ # Database models
├── routes/ # API routes for URL shortening & redirection
├── index.js # Entry point
├── Dockerfile # Container setup
├── package.json # Dependencies and scripts

Getting Started

Clone the repo:

git clone https://github.com/sairaviteja-vadrevu/url-shortener.git
cd url-shortener

Install dependencies:

yarn install

Run locally:

yarn start

Or run with Docker:

docker build -t url-shortener .
docker run -p 3000:3000 url-shortener

Possible Extensions

Add analytics (click counts, referrers, geo data).

Support link expiration dates.

Enable custom slugs.

Integrate user accounts and authentication.

Build a simple frontend dashboard.
