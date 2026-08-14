# Yohannes Bayeh — Frontend Developer Portfolio

A high-performance, responsive portfolio web application featuring interactive project case studies, dual-theme switching (Light & Dark), animated UI components, and containerized deployment with Docker & Nginx.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://yohannesbayeh.vercel.app/)
[![Dockerized](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#docker-setup)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100%20Accessibility%20%7C%20100%20SEO-00CC66?style=for-the-badge&logo=lighthouse&logoColor=white)](#lighthouse--performance-scores)

---

## Tech Stack

### Frontend Architecture
- **Core Library**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations & Motion**: [Framer Motion](https://www.framer.com/motion/) (with LazyMotion feature optimization)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Icons & UI**: [Lucide React](https://lucide.dev/), Custom SVG Architecture Icons, [Swiper](https://swiperjs.com/)

### Infrastructure & Containerization
- **Containerization**: [Docker](https://www.docker.com/) (Multi-stage build: node:20-slim build stage -> nginx:alpine serve stage)
- **Web Server**: [Nginx Alpine](https://nginx.org/) (configured with SPA client-side routing fallback)
- **Hosting / CD**: [Vercel](https://vercel.com/) (Automated CI/CD deployment from GitHub main branch)

---

## Key Features

- **High Performance & Zero CLS**: 100/100 Accessibility, 100/100 Best Practices, and 100/100 SEO.
- **Dual Theme System (Light & Dark)**: Instant theme toggling using CSS Custom Properties (`var(--th-*)`) with custom adaptive mouse cursor.
- **Interactive Case Studies**: 4-phase structured breakdowns (SCOPE, DESIGN, BUILD, TEST):
  - **Architecture Diagrams**: SVG node flows showcasing system architecture.
  - **Implementation Snippets**: Code previews with syntax highlighting.
  - **Technical Decisions**: Numbered badges and engineering rationale.
- **Certificate Lightbox Preview**: Instant eager-loaded certificate viewer modal.
- **100% Mobile Responsive**: Customized layouts for mobile, tablet, and desktop viewports.

---

## Docker Setup

This repository contains a production-ready, multi-stage `Dockerfile` and `nginx.conf` that packages the application into a lightweight (~20MB) standalone container.

### 1. Build the Docker Image
```bash
docker build -t portfolio .
