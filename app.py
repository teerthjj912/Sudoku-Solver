from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# Sudoku Solver Logic
def is_valid(grid, row, col, num):
    for i in range(9):
        if grid[row][i] == num or grid[i][col] == num:
            return False
    subgrid_row, subgrid_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(subgrid_row, subgrid_row + 3):
        for j in range(subgrid_col, subgrid_col + 3):
            if grid[i][j] == num:
                return False
    return True

def solve_sudoku(grid):
    for row in range(9):
        for col in range(9):
            if grid[row][col] == 0:
                for num in range(1, 10):
                    if is_valid(grid, row, col, num):
                        grid[row][col] = num
                        if solve_sudoku(grid):
                            return True
                        grid[row][col] = 0
                return False
    return True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/solve', methods=['POST'])
def solve():
    data = request.get_json()
    grid = data.get('grid')
    if grid:
        if solve_sudoku(grid):
            return jsonify({"status": "success", "solution": grid})
        else:
            return jsonify({"status": "error", "message": "No solution exists."})
    return jsonify({"status": "error", "message": "Invalid input."})

if __name__ == '__main__':
    app.run(debug=True)

# Create a directory structure as follows:
# /templates
#   |- index.html
# /static
#   |- style.css
#   |- script.js
