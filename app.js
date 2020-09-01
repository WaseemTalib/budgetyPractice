var uiCtrl = (function () {
    domStrings = {
        totalBudget: ".budget__value",
        totalIncome: ".budget__income--value",
        totalIncomePercentage: ".budget__income--percentage",
        totalExpenses: ".budget__expenses--value",
        totalExpensesPercentage: ".budget__expenses--percentage",
        incList: ".inc__list",
        expList: ".exp__list",
    }



    return {

        totalBudget: function (data) {
            document.querySelector(domStrings.totalBudget).textContent = data.totalBudget >= 0 ? `+ ${data.totalBudget}` : data.totalBudget;
            document.querySelector(domStrings.totalIncome).textContent = `+ ${data.totalIncome}`;
            document.querySelector(domStrings.totalExpenses).textContent = `- ${data.totalExpenses}`
            document.querySelector(domStrings.totalExpensesPercentage).textContent = `${data.totalExpensesPercentage} %`
            document.querySelector(domStrings.totalIncomePercentage).textContent = `${data.totalIncomePercentage} %`
        },

        inputValues: function () {

            return {
                inputType: document.querySelector(".add__type").value,
                desc: document.querySelector(".add__description").value,
                value: document.querySelector(".add__value").value
            }
        },
        uiNewItem: function (obj, type) {
            var html, newHtml, element, el = [];

            if (type === 'inc') {
                element = domStrings.incList;
                el = obj.allItems["inc"];
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = domStrings.expList;
                el = obj.allItems["exp"];
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            if (type === undefined) {
            } else {
                document.querySelector(`.${type}__list`).innerHTML = ""
            }

            el.map((ele) => {
                newHtml = html.replace('%id%', ele.id);
                newHtml = newHtml.replace('%description%', ele.desc);
                newHtml = newHtml.replace('%value%', ele.value);

                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            })
        },
        uiDelItem: function (item) {
            var list = document.querySelector(`#${item.itemType}-${item.itemId}`);
            list.style.display = "none"
        }
    }
})()

var budgetCtrl = (function () {

    var data = {
        totalBudget: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalExpensesPercentage: 0,
        totalIncomePercentage: 0,
        allItems: {
            inc: [],
            exp: [],
        },
    }

    return {
        updateUI: function () {
            uiCtrl.totalBudget(data);
            return data
        },
        newItem: function (inputValues) {
            var id = Math.round(Math.random() * 100000);
            if (inputValues.inputType === "inc") {
                var income = data.allItems["inc"];
                var incomeObj = {
                    id: id,
                    value: inputValues.value,
                    desc: inputValues.desc,
                    type: inputValues.inputType
                }
                income.push(incomeObj);
            } else if (inputValues.inputType === "exp") {
                var expense = data.allItems["exp"];
                var expensesObj = {
                    id: id,
                    value: inputValues.value,
                    desc: inputValues.desc,
                    type: inputValues.inputType
                }
                expense.push(expensesObj);
            }
            this.calculateTotal(inputValues.inputType);
            this.totalBudget();
            this.calculatePercentage(inputValues);
            uiCtrl.uiNewItem(data, inputValues.inputType)
            this.updateUI();

        },
        calculateTotal: function (type) {
            var arr = 0;
            if (type === "inc") {
                for (var i = 0; i <= (data.allItems["inc"].length - 1); i++) {
                    arr += Number(data.allItems["inc"][i].value)
                }
                data.totalIncome = arr
            } else if (type === "exp") {
                for (var i = 0; i <= (data.allItems["exp"].length - 1); i++) {
                    arr += Number(data.allItems["exp"][i].value)
                }
                data.totalExpenses = arr
            }
        },
        totalBudget: function () {
            var totalBudget = data.totalIncome - data.totalExpenses
            data.totalBudget = totalBudget
        },
        delItem: function (event) {
            var eventId = event.target.parentNode.parentNode.parentNode.parentNode.id;
            var splitId = eventId.split('-');
            var itemType = splitId[0];
            var itemId = parseInt(splitId[1]);

            data.allItems[itemType].map((el, i) => {
                if (el.id === itemId) {
                    data.allItems[itemType].splice(i, 1);
                }
            })
            return { itemType, itemId }
        },

        calculatePercentage: function (values) {
            if (data.totalExpenses > data.totalIncome) {
                data.totalExpensesPercentage = -1
                data.totalIncomePercentage = -1
            } else {

                var incomePercentage = Math.round((data.totalBudget / data.totalIncome) * 100);
                data.totalIncomePercentage = incomePercentage
                var expensesPercentage = 100 - incomePercentage;

                if (data.totalExpenses > 0) {
                    data.totalExpensesPercentage = expensesPercentage
                } else {
                    data.totalExpensesPercentage = -1
                }
            }

        }
    }


})()



var controller = (function (uiCtrl, budgetCtrl) {

    // UICONTROLLER
    function startController() {
        document.querySelector(".add__btn").addEventListener("click", addItem)
        document.addEventListener("keypress", function (ev) {
            if (ev.keyCode === 13) {
                addItem();
            }
        })
    }

    // budget in the start
    budgetCtrl.updateUI();


    var addItem = function addItem() {
        var inputValues = uiCtrl.inputValues()

        budgetCtrl.newItem(inputValues)
    }

    document.querySelector('.container').addEventListener("click", (event) => {

        var delItem = budgetCtrl.delItem(event);
        budgetCtrl.calculateTotal(delItem.itemType);
        budgetCtrl.totalBudget();
        budgetCtrl.updateUI()
        uiCtrl.uiDelItem(delItem);
    });

    function month() {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var date = new Date();
        var element = document.querySelector('.budget__title--month')
        var singleMonth = date.getMonth();
        var year = date.getFullYear();
        
        element.innerHTML = `${months[singleMonth]}, ${year}`
    }

    // startController(inputValues)
    return {
        init: function () {
            startController()
            month()
        }
    }

})(uiCtrl, budgetCtrl)
controller.init()

