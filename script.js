let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;

const form = document.getElementById("entry-form");
const entriesList = document.getElementById("entries");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");
const filterRadios = document.querySelectorAll("input[name='filter']");

function renderEntries() {
  const filter = document.querySelector("input[name='filter']:checked").value;
  entriesList.innerHTML = "";

  let income = 0,
    expense = 0;

  entries.forEach((entry, index) => {
    if (filter === "all" || entry.type === filter) {
      const li = document.createElement("li");
      li.className = `flex justify-between items-center p-3 rounded border ${
        entry.type === "income" ? "bg-green-50" : "bg-red-50"
      }`;

      li.innerHTML = `
        <div>
          <p class="font-medium">${entry.description}</p>
          <p class="text-sm text-gray-500">${entry.type} - $${entry.amount}</p>
        </div>
        <div class="flex gap-2">
          <button onclick="editEntry(${index})" class="text-blue-500 cursor-pointer">Edit</button>
          <button onclick="deleteEntry(${index})" class="text-red-500 cursor-pointer">Delete</button>
        </div>
      `;
      entriesList.appendChild(li);
    }

    if (entry.type === "income") income += Number(entry.amount);
    else expense += Number(entry.amount);
  });

  totalIncome.textContent = `$${income}`;
  totalExpense.textContent = `$${expense}`;
  balance.textContent = `$${income - expense}`;

  localStorage.setItem("entries", JSON.stringify(entries));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = form.description.value.trim();
  const amount = Number(form.amount.value);
  const type = form.type.value;

  if (!description || !amount) return;

  const entry = { description, amount, type };

  if (editId !== null) {
    entries[editId] = entry;
    editId = null;
  } else {
    entries.push(entry);
  }

  form.reset();
  renderEntries();
});

function editEntry(index) {
  const entry = entries[index];
  form.description.value = entry.description;
  form.amount.value = entry.amount;
  form.type.value = entry.type;
  editId = index;
}

function deleteEntry(index) {
  entries.splice(index, 1);
  renderEntries();
}

filterRadios.forEach((radio) => {
  radio.addEventListener("change", renderEntries);
});

renderEntries();
