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