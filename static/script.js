document.addEventListener("DOMContentLoaded", () => {
  const solveButton = document.getElementById("solveButton");
  const resetButton = document.getElementById("resetButton");
  const message = document.getElementById("message");

  // Get the grid values
  function getGrid() {
    const grid = [];
    for (let i = 0; i < 9; i++) {
      const row = [];
      for (let j = 0; j < 9; j++) {
        const cell = document.getElementById(`cell-${i}-${j}`).value;
        row.push(cell === "" ? 0 : parseInt(cell));
      }
      grid.push(row);
    }
    return grid;
  }

  // Populate the grid
  function populateGrid(solution) {
    solution.forEach((row, i) => {
      row.forEach((value, j) => {
        const cell = document.getElementById(`cell-${i}-${j}`);
        if (cell.value === "") {
          cell.value = value;
          cell.classList.add("solved");
        }
      });
    });
  }

  // Clear solved classes
  function clearSolvedClasses() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove("solved");
    });
  }

  // Solve button event
  solveButton.addEventListener("click", async () => {
    clearSolvedClasses();
    const grid = getGrid();
    message.textContent = "Solving...";
    try {
      const response = await fetch("/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grid }),
      });
      const data = await response.json();
      if (data.status === "success") {
        populateGrid(data.solution);
        message.textContent = "Solved successfully!";
        message.style.color = "#4caf50"; // Success green
      } else {
        message.textContent = data.message;
        message.style.color = "#e53935"; // Error red
      }
    } catch (error) {
      message.textContent = "An error occurred. Please try again.";
      message.style.color = "#e53935";
    }
  });

  // Reset button event
  resetButton.addEventListener("click", () => {
    clearSolvedClasses();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = document.getElementById(`cell-${i}-${j}`);
        cell.value = "";
        cell.style.backgroundColor = "#fff";
      }
    }
    message.textContent = "";
    message.style.color = "#444";
  });
});
