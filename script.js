<script>
    const form = document.getElementById('budget-form');
    const expenseList = document.getElementById('expense-list');
    const remainingInput = document.getElementById('remaining');
    const incomeInput = document.getElementById('income');
    const feedbackForm = document.getElementById('feedback-form');

    let expenses = JSON.parse(localStorage.getItem('budgetExpenses')) || [];

    function calculateRemaining() {
        const income = Number(incomeInput.value) || 0;
        const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
        const balance = income - totalExpenses;
        remainingInput.value = balance;
        remainingInput.style.color = balance < 0 ? 'red' : 'green';
    }

    function renderExpenses() {
        expenseList.innerHTML = '';

        if (expenses.length === 0) {
            expenseList.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 12px; text-align: center; color: #666;">
                        No expenses added yet.
                    </td>
                </tr>
            `;
            calculateRemaining();
            return;
        }

        expenses.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${item.date}</td>
                <td>${item.category}</td>
                <td>${item.description || '—'}</td>
                <td>₹${Number(item.amount).toFixed(2)}</td>
                <td>
                    <button type="button" data-index="${index}" class="delete-btn"
                        style="background: #d9534f; color: white; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer;">
                        Delete
                    </button>
                </td>
            `;

            expenseList.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = Number(e.target.dataset.index);
                expenses.splice(index, 1);
                localStorage.setItem('budgetExpenses', JSON.stringify(expenses));
                renderExpenses();
            });
        });

        calculateRemaining();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const income = Number(incomeInput.value);
        const expense = Number(document.getElementById('expense').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        if (!income || !expense || !date) {
            alert('Please enter valid income, expense, and date.');
            return;
        }

        expenses.push({
            income,
            amount: expense,
            category,
            description,
            date
        });

        localStorage.setItem('budgetExpenses', JSON.stringify(expenses));
        form.reset();
        renderExpenses();
    });

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = document.getElementById('feedback').value.trim();
        if (!feedback) {
            alert('Please enter your feedback.');
            return;
        }
        alert('Thank you for your feedback!');
        feedbackForm.reset();
    });

    incomeInput.addEventListener('input', calculateRemaining);
    renderExpenses();
</script>
