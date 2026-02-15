# =========================
# ⚡ Base Image
# =========================
FROM node:lts-bullseye

# =========================
# 🛠️ Install Dependencies
# =========================
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg \
        webp \
        git \
        curl \
        unzip && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# =========================
# 👤 Switch to non-root user
# =========================
USER node
WORKDIR /home/node

# =========================
# 🌐 Clone Repository
# =========================
RUN git clone https://github.com/Tappy-TechX/Xtech.git
WORKDIR /home/node/Xtech

# =========================
# 🔧 Permissions & Install
# =========================
RUN chmod -R 777 /home/node/Xtech
RUN yarn install --network-concurrency 1

# =========================
# 🔌 Expose Port & Env
# =========================
EXPOSE 7860
ENV NODE_ENV=production

# =========================
# 🚀 Start Bot
# =========================
CMD ["npm", "start"]