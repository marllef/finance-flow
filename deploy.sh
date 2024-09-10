#!/bin/bash

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

show_help() {
  echo "Uso: ./deploy.sh [--seed]"
  echo "    --seed  Executa o seed do banco de dados após aplicar as migrações"
  exit 0
}

if [[ "$1" == "--help" ]]; then
  show_help
fi

echo "Configurando ambiente..."
cp .env.example .env
if [["$1" == "-i"]]; then
  echo "Instalando dependências..."
  if command_exists yarn; then
    yarn install
  elif command_exists npm; then
    npm install
  else
    echo "Nenhum gerenciador de pacotes encontrado (yarn ou npm). Instale um deles e tente novamente."
    exit 1
  fi
fi

echo ""
echo "Subindo a aplicação com Docker Compose..."
sudo docker-compose up -d --build

sleep 10

if [[ "$1" == "--seed" ]]; then
  echo "Executando seed do banco de dados..."
  sudo docker-compose exec server npx prisma db seed
else
  echo "Seed não executado. Para executar o seed, use o parâmetro --seed."
fi

echo ""
sudo docker ps

echo ""
echo "===> Deploy concluído! <==="
echo ""