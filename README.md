[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red)](https://nestjs.com/)

# Agent Escrow Backend

## Overview

Production backend for Agent Escrow - NestJS, PostgreSQL, Redis, WebSocket

## Features

- REST API for agent management
- WebSocket for real-time updates
- BullMQ for job queues
- PostgreSQL for data persistence
- Redis for caching and queues

## Tech Stack

- NestJS 10
- PostgreSQL
- Redis
- BullMQ
- Socket.IO
- TypeORM

## Setup

```bash
npm install
cp .env.example .env
npm run dev
