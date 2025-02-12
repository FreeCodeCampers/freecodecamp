#!/bin/bash

# Define the source file
source_file="curriculum/challenges/english/22-rosetta-code/rosetta-code-challenges/execute-brain.md"

# Define the destination directory
destination_dir="curriculum/challenges"

# Loop through all directories except _meta and english
for dir in $(find "$destination_dir" -mindepth 1 -maxdepth 1 -type d ! -name '_meta' ! -name 'english'); do
    # Copy the file to each directory
    cp "./$source_file" "./$dir/22-rosetta-code/rosetta-code-challenges/"
done
