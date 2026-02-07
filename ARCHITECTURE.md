# Architecture Diagrams 

## Data Flow Diagram
<img width="1053" height="610" alt="Screenshot 2026-02-06 at 10 49 07 AM" src="https://github.com/user-attachments/assets/527b6326-e814-4550-9c93-fd59c78a5aba" />

This data flow diagram shows how user commands flow from Discord
into the bot, how recipe selections made by users are processed, how user state is
stored, and how alternative recipes for the stored allergens are generated.

## Control-Flow Graphs
The following three graphs show the possible path traversals for the execute methods for our /recipes, /pick, and /allergens commands respectively.

### 1. Execute (/recipes)
<img src = "control-flowDiagrams/recipesExecute.png">

### 2. Execute (/pick)
<img src = "control-flowDiagrams/pickExecute.png">

### 3. Execute (/allergens)
<img src = "control-flowDiagrams/allergensExecute.png">

