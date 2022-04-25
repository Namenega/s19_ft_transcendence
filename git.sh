#!/bin/bash

#Constant
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
RESET='\033[0m'

if [ "x$1" = "x" ]; then
	echo "${YELLOW}Supply first arg = Commit's name.${RESET}"
	exit 0
fi

echo "${GREEN}Git ADD${RESET}"
echo ""
sleep 1
git add ./*

echo "${GREEN}Git STATUS${RESET}"
echo ""
sleep 1
git status

echo "${YELLOW}Time to check if there is something wrong ...${RESET}"
echo ""
sleep 4

echo "${GREEN}Git COMMIT $1${RESET}"
echo ""
sleep 1
git commit -m "$1"

echo "${GREEN}Git PUSH${RESET}"
echo ""
sleep 1
git push
