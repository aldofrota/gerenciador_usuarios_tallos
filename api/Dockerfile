# Usa a imagem base do Ubuntu 20.04
FROM ubuntu:20.04
LABEL maintainer="aldofrotadev"


# Atualiza o sistema e instala as dependências
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install -y gnupg2 && \
    apt-get install -y software-properties-common

# Instala o Node.js 16.x
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    add-apt-repository "deb https://deb.nodesource.com/node_18.x $(lsb_release -cs) main" && \
    apt-get update && \
    apt-get install -y nodejs

# Instala o npm e o Yarn
RUN npm install -g npm && \
    npm install -g yarn

# Crie um usuário não-root
RUN useradd -m -s /bin/bash ubuntu

# Torne o usuário um sudoer (opcional)
RUN usermod -aG sudo ubuntu

# Mude para o usuário não-root
USER ubuntu

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Comando padrão para execução (pode ser substituído quando o container for iniciado)
CMD tail -f /dev/null

LABEL image.name="ubuntu"