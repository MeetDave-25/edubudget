
        // Data storage using basic JavaScript arrays and objects
        let monthlyBudget = 0;
        let expenses = [];
        
        // Load data from localStorage (basic data persistence)
        function loadData() {
            const savedBudget = localStorage.getItem('studentBudget');
            const savedExpenses = localStorage.getItem('studentExpenses');
            
            if (savedBudget) {
                monthlyBudget = parseFloat(savedBudget);
                document.getElementById('monthlyBudget').value = monthlyBudget;
            }
            
            if (savedExpenses) {
                expenses = JSON.parse(savedExpenses);
            }
            
            updateDashboard();
        }
        
        // Save data to localStorage
        function saveData() {
            localStorage.setItem('studentBudget', monthlyBudget.toString());
            localStorage.setItem('studentExpenses', JSON.stringify(expenses));
        }
        
        // Set monthly budget function
        function setBudget() {
            const budgetInput = document.getElementById('monthlyBudget');
            const budget = parseFloat(budgetInput.value);
            
            if (budget && budget > 0) {
                monthlyBudget = budget;
                saveData();
                updateDashboard();
                alert('✅ Monthly budget set successfully!');
                generateAISuggestions();
            } else {
                alert('❌ Please enter a valid budget amount!');
            }
        }
        
        // Add expense function
        function addExpense() {
            const name = document.getElementById('expenseName').value;
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const category = document.getElementById('expenseCategory').value;
            
            if (name && amount && amount > 0) {
                // Create expense object
                const expense = {
                    id: Date.now(), // Simple ID generation
                    name: name,
                    amount: amount,
                    category: category,
                    date: new Date().toLocaleDateString()
                };
                
                // Add to expenses array (using basic array operations)
                expenses.unshift(expense); // Add to beginning of array
                
                // Clear form
                document.getElementById('expenseName').value = '';
                document.getElementById('expenseAmount').value = '';
                
                saveData();
                updateDashboard();
                generateAISuggestions();
                
                alert('✅ Expense added successfully!');
            } else {
                alert('❌ Please fill all fields with valid data!');
            }
        }
        
        // Delete expense function
        function deleteExpense(id) {
            // Basic array filtering
            expenses = expenses.filter(expense => expense.id !== id);
            saveData();
            updateDashboard();
            generateAISuggestions();
        }
        
        // Calculate total spent (basic loop implementation)
        function calculateTotalSpent() {
            let total = 0;
            for (let i = 0; i < expenses.length; i++) {
                total += expenses[i].amount;
            }
            return total;
        }
        
        // Calculate category totals (basic DSA implementation)
        function calculateCategoryTotals() {
            const categoryTotals = {};
            
            // Simple loop to calculate totals
            for (let i = 0; i < expenses.length; i++) {
                const category = expenses[i].category;
                if (categoryTotals[category]) {
                    categoryTotals[category] += expenses[i].amount;
                } else {
                    categoryTotals[category] = expenses[i].amount;
                }
            }
            
            return categoryTotals;
        }
        
        // Update dashboard function
        function updateDashboard() {
            const totalSpent = calculateTotalSpent();
            const remaining = monthlyBudget - totalSpent;
            
            // Update statistics
            document.getElementById('totalBudget').textContent = '₹' + monthlyBudget.toFixed(0);
            document.getElementById('totalSpent').textContent = '₹' + totalSpent.toFixed(0);
            document.getElementById('remaining').textContent = '₹' + remaining.toFixed(0);
            document.getElementById('expenseCount').textContent = expenses.length;
            
            // Update expense list
            updateExpenseList();
            updateCategoryChart();
        }
        
        // Update expense list display
        function updateExpenseList() {
            const expenseList = document.getElementById('expenseList');
            
            if (expenses.length === 0) {
                expenseList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No expenses added yet. Add your first expense above!</p>';
                return;
            }
            
            let html = '';
            // Display only recent 10 expenses (basic array slicing)
            const recentExpenses = expenses.slice(0, 10);
            
            for (let i = 0; i < recentExpenses.length; i++) {
                const expense = recentExpenses[i];
                html += `
                    <div class="expense-item">
                        <div class="expense-details">
                            <div style="font-weight: bold;">${expense.name}</div>
                            <div class="expense-category">${expense.category} • ${expense.date}</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="expense-amount">₹${expense.amount}</div>
                            <button class="delete-btn" onclick="deleteExpense(${expense.id})">🗑️</button>
                        </div>
                    </div>
                `;
            }
            
            expenseList.innerHTML = html;
        }
        
        // Update category chart
        function updateCategoryChart() {
            const categoryTotals = calculateCategoryTotals();
            const chartContainer = document.getElementById('categoryChart');
            
            if (Object.keys(categoryTotals).length === 0) {
                chartContainer.innerHTML = '<p style="color: #666;">No spending data available yet.</p>';
                return;
            }
            
            let html = '';
            // Simple chart using CSS (basic visualization)
            for (const category in categoryTotals) {
                const amount = categoryTotals[category];
                const percentage = monthlyBudget > 0 ? (amount / monthlyBudget * 100).toFixed(1) : 0;
                
                html += `
                    <div class="chart-bar" style="width: ${Math.max(percentage * 2, 80)}px;">
                        ${category}<br>₹${amount}<br>${percentage}%
                    </div>
                `;
            }
            
            chartContainer.innerHTML = html;
        }
        
        // AI Suggestions Generator (rule-based system - basic AI simulation)
        function generateAISuggestions() {
            const totalSpent = calculateTotalSpent();
            const remaining = monthlyBudget - totalSpent;
            const spentPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget * 100) : 0;
            const categoryTotals = calculateCategoryTotals();
            
            const suggestions = [];
            
            // Basic rule-based AI suggestions
            if (spentPercentage > 80) {
                suggestions.push("⚠️ You've spent " + spentPercentage.toFixed(1) + "% of your budget! Try to reduce expenses.");
            } else if (spentPercentage > 60) {
                suggestions.push("💡 You're at " + spentPercentage.toFixed(1) + "% of your budget. Monitor your spending carefully.");
            } else {
                suggestions.push("✅ Great! You're managing your budget well at " + spentPercentage.toFixed(1) + "% spent.");
            }
            
            // Category-specific suggestions
            if (categoryTotals['Food'] && categoryTotals['Food'] > monthlyBudget * 0.4) {
                suggestions.push("🍳 Your food expenses are high. Try cooking at home more often!");
            }
            
            if (categoryTotals['Entertainment'] && categoryTotals['Entertainment'] > monthlyBudget * 0.2) {
                suggestions.push("🎬 Consider reducing entertainment expenses. Look for free activities!");
            }
            
            if (categoryTotals['Transport'] && categoryTotals['Transport'] > monthlyBudget * 0.15) {
                suggestions.push("🚌 Try using public transport or carpooling to save on travel costs.");
            }
            
            // Daily spending suggestions
            const daysInMonth = 30;
            const dailyBudget = monthlyBudget / daysInMonth;
            const avgDailySpent = expenses.length > 0 ? totalSpent / Math.min(expenses.length, daysInMonth) : 0;
            
            if (avgDailySpent > dailyBudget * 1.2) {
                suggestions.push("📅 Your daily average (₹" + avgDailySpent.toFixed(0) + ") exceeds daily budget (₹" + dailyBudget.toFixed(0) + ").");
            }
            
            // Money-saving tips
            const savingTips = [
                "💰 Create a shopping list before going out to avoid impulse purchases",
                "🎯 Set spending limits for different categories",
                "📱 Use student discounts whenever possible",
                "💡 Track your expenses daily to stay aware of your spending",
                "🏦 Consider opening a savings account for emergency funds"
            ];
            
            // Add random saving tip
            const randomTip = savingTips[Math.floor(Math.random() * savingTips.length)];
            suggestions.push(randomTip);
            
            // Update suggestions display
            let html = '';
            for (let i = 0; i < suggestions.length; i++) {
                html += '<div class="suggestion-item">' + suggestions[i] + '</div>';
            }
            
            document.getElementById('suggestions').innerHTML = html;
        }
        
        // Initialize app when page loads
        window.onload = function() {
            loadData();
            generateAISuggestions();
        };