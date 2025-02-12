#!/bin/bash


echo "Enter the ids of the challenges you wish to test (separated by commas) and hit enter."
read -r input


IFS=',' challengeIDS=($input)

for challengeID in "${challengeIDS[@]}";
do
  challengeID="$(tr -d ' ' <<< "$challengeID")"
  FCC_CHALLENGE_ID=$challengeID pnpm run test:curriculum
done
