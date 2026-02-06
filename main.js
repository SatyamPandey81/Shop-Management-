//  Creating Database in indexdb 

let request = indexedDB.open("MyKirana App", 1);
let db;

request.onupgradeneeded = (e) => {
    db = e.target.result;

    // Stock inventory DB
    if(!db.objectStoreNames.contains("inventory")){
        db.createObjectStore("inventory",{keyPath: "name"});
    }

    // Udhaar DB
    if(!db.objectStoreNames.contains("udhaar")){
        db.createObjectStore("udhaar",{keyPath : "name"});
    }

    // Udhaar History DB
    if(!db.objectStoreNames.contains("udhaarHistory")){
        db.createObjectStore("udhaarHistory", {
        keyPath: "id",
        autoIncrement: true
        });
    }

    // Daily Profit DB
    if(!db.objectStoreNames.contains("dailyProfit")){
        db.createObjectStore("dailyProfit",{keyPath : "date"});
    }

    // Monthly Profit DB
    if(!db.objectStoreNames.contains("monthlyProfit")){
        db.createObjectStore("monthlyProfit",{keyPath : "month"});
    }

    // Udhaar Profit DB
    if(!db.objectStoreNames.contains("udhaarProfit")){
        db.createObjectStore("udhaarProfit",{keyPath : "name"});
    }

    // NetProfit DB 
    if(!db.objectStoreNames.contains("netProfit")){
    db.createObjectStore("netProfit", { keyPath: "month" });
    }
   
}
request.onsuccess = (e) => {
  db = e.target.result;
  
};

document.addEventListener("DOMContentLoaded",function(){

    //  Toggle the Menu Icon
    let menubtn = document.getElementById("menu_icon"); // getting menu baar .
    let menulist = document.getElementById("menu_list"); // getting menu list.
    let addbtn = document.getElementById('addStockBtn'); // btn for adding stocks.
    menubtn.addEventListener("click",function(){ // toggle the menu baar.
        menulist.classList.toggle("show");
        menubtn.classList.toggle("open"); 
    });


    let popupBtn = document.getElementById('closeLowStock');
    popupBtn.addEventListener('click',function(){
        let popUp = document.getElementById('lowStockPopup');
        popUp.classList.toggle("lowitems");
    })


    // Adding stocks  function.
    addbtn.addEventListener('click',function(){
        addStock();
    });


    // This function is for show and hide the list.
    let stockList = document.getElementById('stockTable'); 
    let aroBtn = document.getElementById('toggle')
    let isOpen = false;

    aroBtn.addEventListener('click',function(){
    
        if(isOpen === false){
            aroBtn.innerHTML = "&#9660;" ;
            stockList.classList.toggle('openList');
            isOpen = true;
        }else{
            aroBtn.innerHTML = "&#9654;";
            stockList.classList.toggle('openList');
            isOpen = false;
        }
        
    });

    // Sell stock function.
    let sellBtn = document.getElementById("sellBtn");

    sellBtn.addEventListener('click',function(){
        let sellName = document.getElementById("sellName").value.trim();
        let sellQty = parseInt(document.getElementById("sellQty").value);
        addSellQty(sellName,sellQty);
        dailyProfit(sellName,sellQty);
    });

    // Searching stocks from the list
    let input = document.getElementById('stockSearch');

    input.addEventListener('input',function(){
        let inputVal = document.getElementById('stockSearch').value.trim();
        if(inputVal.length > 0){
            searchItem(inputVal);
        }else{
            getAllInventory();
        }
    });    

    // Udhaar management
    let udhaarBtn = document.getElementById('addUdhaarBtn');

    udhaarBtn.addEventListener('click',function(){
        addUdhaar();
    });

    let udhaarTable = document.getElementById('udhaarTable'); 
    let toggleUdhaarList = document.getElementById('toggleUdhaarList')
    let isShow = false;

    
    toggleUdhaarList.addEventListener('click',function(){
    
        if(isShow === false){
            toggleUdhaarList.innerHTML = "&#9660;" ;
            udhaarTable.classList.toggle('show');
            isShow = true;
        }else{
            toggleUdhaarList.innerHTML = "&#9654;";
            udhaarTable.classList.toggle('show');
            isShow = false;
        }
        
    });

    // paidding Udhaar Btn
    let payBtn = document.getElementById("pay_btn");
    payBtn.addEventListener("click",function(){
        let paidAmountSec = document.getElementById("paidAmountSec");
        paidAmountSec.classList.add("paid");
    })

    // Paidding the money by the person
    let paidBtn = document.getElementById("OK");
    paidBtn.addEventListener("click",function(){
        paidMoney();
        paidAmountSec.classList.remove("paid");
    });

    // Open History Btn
    let his_btn = document.getElementById("his_btn");
    his_btn.addEventListener("click",function(){
        let historySec = document.getElementById("historySec");
        historySec.classList.add("history");

    });

    // CLose History Btn
    let closeHistory = document.getElementById("closeHistory");
    closeHistory.addEventListener("click",function(){
        let historySec = document.getElementById("historySec");
        historySec.classList.remove("history");
    });

    // Toggle Delete Section
    let deleteBtn = document.getElementById("deleteBtn");
    deleteBtn.addEventListener("click",function(){
        let delPersonSec = document.getElementById("delPersonSec");
        delPersonSec.classList.add("del");
    });

    // Delete Person from udhaar and udhaar history and Close the Delete Section
    let okay = document.getElementById("okay");
    okay.addEventListener("click",function(){
        let delName = document.getElementById("delName").value.trim();
        deleteUdhaar(delName);
        deleteHistory(delName);
        delUdhaarProfitHistory(delName);
        let delPersonSec = document.getElementById("delPersonSec");
        delPersonSec.classList.remove("del");
    });

    // Search person in Udhaar List
    let udhaarSearch = document.getElementById("udhaarSearch");
    udhaarSearch.addEventListener("input",function(){
        let udhaarName = document.getElementById("udhaarSearch").value.trim();
        if(udhaarName.length > 0){
            showPerson(udhaarName);
        }else{
            updateUdhaarTable();
        }
    });

    // Search person in Udhaar History
    let searchHistory = document.getElementById("searchHistory");
    searchHistory.addEventListener("input",function(){
        let inputValue = document.getElementById("searchHistory").value.trim();
        if(inputValue.length > 0){
            searchInHistory(inputValue);
        }else{
            updateUdhaarHistoryTable();
        }
    });

    // Adding expense 
    let addExpenseBtn = document.getElementById("addExpenseBtn");
    addExpenseBtn.addEventListener("click",function(){
        let expenseAmount = parseInt(document.getElementById("expenseAmount").value);
        calculateMonthlyProfit(expenseAmount);
        document.getElementById("expenseAmount").value ="";
    })
    
    // Starting Functions at open or  on refresh
    window.onload = function(){
        getAllInventory();
        lowStocksPopup();
        updateUdhaarTable();
        updateUdhaarHistoryTable();
        showDailyProfit();
        calculateMonthlyProfit();
        cleanupDailyProfit();
        showNetProfit();
        autoDeleteZeroStock();
        cleanupYearlyMonthlyProfit();
    };

    
}); 

    // Add Stocks Function.
    function addStock(){
        let item = {
            name : document.getElementById('name').value.trim(),
            Qty : parseInt(document.getElementById('qty').value),
            Cp : parseInt(document.getElementById('cp').value),
            Sp : parseInt(document.getElementById('sp').value),
            status:""
        }
        document.getElementById('name').value = "";
        document.getElementById('qty').value = "";
        document.getElementById('cp').value = "";
        document.getElementById('sp').value = "";
        if (!item.name || !item.Qty || !item.Cp || !item.Sp) {
            alert("All field are required");
            return;
        }else{
        addOrUpdateStock(item);
        }
    }

    // adding or updating stocks in database.
    function addOrUpdateStock(item){
        // taking transaction permission from db 
        let tx = db.transaction("inventory", "readwrite");
        let store = tx.objectStore("inventory");

        let getRequest = store.get(item.name);
        getRequest.onsuccess = (e) =>{
            let existingItem = e.target.result;

            if(existingItem){
                existingItem.Qty += item.Qty;

                existingItem.status = existingItem.Qty < 5 ? "low" : "ok";
                store.put(existingItem);
            }else{
                item.status = item.qty < 5 ? "low" : "ok";
                store.put(item);
            }
        };
        store.put(item);
        getAllInventory();
    }

    //Getting all the data of stocks from database.
    function getAllInventory(){
        let tx = db.transaction("inventory","readonly");
        let store = tx.objectStore("inventory");

        let request = store.getAll();
        request.onsuccess = (e) =>{
            let items = e.target.result;
            renderInventoryTable(items);
        };
    }

    // Show the stock list in the table
    function renderInventoryTable(item){
        let tbody = document.getElementById('stockTable');
        tbody.innerHTML = "";

        item.forEach(item => {
            let row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.Qty}</td>
            <td>${item.Cp}</td>
            <td>${item.Sp}</td>
            <td>${item.status}</td>`;

            tbody.appendChild(row);
        });
    }

     // Search item from Stock list function.
    function searchItem(name){
        let stockList = document.getElementById('stockTable'); 

        let tx = db.transaction("inventory","readonly");
        let store = tx.objectStore("inventory");

        let request = store.get(name);

        request.onsuccess = (e) => {
            let item = e.target.result;
            stockList.innerHTML = "";
                let row = 
                `<tr>
                    <td>${item.name}</td>
                    <td>${item.Qty}</td>
                    <td>${item.Cp}</td>
                    <td>${item.Sp}</td>
                    <td>${item.status}</td>
                </tr>`
            stockList.innerHTML = row;   
        }
    }

    //Sell item function.
    function addSellQty(name,qty){
        let item = {
            name:name,
            Qty:qty
        }
        let tx = db.transaction("inventory","readwrite");
        let store = tx.objectStore("inventory");

        let getRequest = store.get(item.name);
        getRequest.onsuccess = (e) =>{
            let existingItem = e.target.result;
            existingItem.Qty -= item.Qty;
            existingItem.status = existingItem.Qty < 5 ? "low" : "ok";
            store.put(existingItem);
            getAllInventory();
        } 
        document.getElementById("sellName").value = "";
        document.getElementById("sellQty").value = "";
        autoDeleteZeroStock();
    }

    // Auto Delete When Stock Will be 0.
    function autoDeleteZeroStock(){

        let tx = db.transaction("inventory", "readwrite");
        let store = tx.objectStore("inventory");

        let req = store.getAll();

        req.onsuccess = (e) => {
            let items = e.target.result;

            items.forEach(item => {
                if(Number(item.Qty) <= 0){
                    store.delete(item.name);
                }
            });
            getAllInventory();
        };

        tx.onerror = () => {
            console.error("Auto delete zero stock failed");
        };
    }



    // Udhaar Adding function.
    function addUdhaar(){

        // Taking Value From The table
        let productname = document.getElementById("productname").value.trim();
        let udhaarQty = document.getElementById("udhaarQty").value;
        let person = {
            name : document.getElementById('udhaarName').value.trim(),
            amount : parseInt(document.getElementById('udhaarAmount').value),
            paid: 0,
            remaining: 0,
            date : new Date().toLocaleDateString()
        }

        // If Any Fields Are Blank Return
        if(person.name === "" || isNaN(person.amount)){
            alert("Please Inter the value");
            return;
        }else{
            updateUdhaarDB(person);
        }
        addUdhaarHistory(person.name,person.amount);
        udhaarProfit(person.name,productname,udhaarQty);

        document.getElementById("productname").value="";
        document.getElementById("udhaarQty").value="";
        document.getElementById('udhaarName').value="";
        document.getElementById('udhaarAmount').value="";

        let tx = db.transaction("inventory","readwrite");
        let store = tx.objectStore("inventory");

        let  req = store.get(productname);
        req.onsuccess=(e)=>{

            let item = e.target.result;

            item.Qty -= udhaarQty;
            store.put(item);
            getAllInventory();
        }
    }

    // Updating Udhaar List In The Database
    function updateUdhaarDB(person){
        let tx = db.transaction("udhaar","readwrite");
        let store = tx.objectStore("udhaar");

        let request = store.get(person.name);

        request.onsuccess =(e)=>{
            let existingperson = e.target.result;

            if(existingperson){
                if(existingperson.remaining === 0){
                    existingperson.amount = person.amount;
                    existingperson.paid = 0;
                }else{
                    existingperson.amount += person.amount;
                }
                existingperson.remaining += person.amount;
                store.put(existingperson);
            }else{
                person.remaining = person.amount; // first time
                store.put(person);
            }
            updateUdhaarTable();
            updateUdhaarHistoryTable();
        };
    }

    // Updating Udhaar List In The Table
    function updateUdhaarTable(){
        if (!db) return;

        let tx = db.transaction("udhaar", "readonly");
        let store = tx.objectStore("udhaar");

        let request = store.getAll();

        request.onsuccess = (e) => {
            let items = e.target.result;
            let udhaarTable = document.getElementById("udhaarTable");
            udhaarTable.innerHTML = "";

            if (!items || items.length === 0) {
                udhaarTable.innerHTML = `<tr><td colspan="5">No Udhaar Found</td></tr>`;
                return;
            }

            items.forEach(item => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.amount}</td>
                    <td>${item.paid}</td>
                    <td>${item.remaining}</td>
                    <td>${item.date}</td>`;
                udhaarTable.appendChild(row);
            });
        };
    }
    
    //  Searching Persons In Udhaar List
    function showPerson(name){
        let udhaarTable = document.getElementById("udhaarTable");
        udhaarTable.innerHTML = "";

        let tx = db.transaction("udhaar","readonly");
        let store = tx.objectStore("udhaar");

        let request = store.get(name);

        request.onsuccess =(e)=>{
            item = e.target.result;
            let row = `
            <tr>
            <td>${item.name}</td>
            <td>${item.amount}</td>
            <td>${item.paid}</td>
            <td>${item.remaining}</td>
            <td>${item.date}</td>
            </tr>
            `

            udhaarTable.innerHTML = row;
        }
    }

    // Adding Udhaar History In Udhaar History DB
    function addUdhaarHistory(name,amount){
        let ut = db.transaction("udhaar","readonly");
        let st = ut.objectStore("udhaar");

        let request = st.get(name);

        request.onsuccess=(e)=>{
            let item = e.target.result;

            let tx = db.transaction("udhaarHistory","readwrite");
            let store = tx.objectStore("udhaarHistory");

            let History = {};
            if(amount > 0){
                History = {
                    name: name,
                    total: amount,
                    paid: 0,
                    remain: amount,
                    date: new Date().toLocaleDateString()
                }
            }else{
                History = {
                    name: name,
                    total: item.amount,
                    paid: item.paid,
                    remain: item.remaining,
                    date: new Date().toLocaleDateString()
                }
            }
            let addReq = store.add(History);

            addReq.onerror = () => {
                alert("Error adding history");
            };
            updateUdhaarHistoryTable();
        }
    }

    // Updating udhaar History table.
    function updateUdhaarHistoryTable(){
        let udhaarHistoryTable = document.getElementById('udhaarHistoryTable');
        udhaarHistoryTable.innerHTML = "";

        let tx = db.transaction("udhaarHistory","readonly");
        let store = tx.objectStore("udhaarHistory");
        
        let request = store.getAll();

        request.onsuccess =(e)=>{
            let item = e.target.result;

            item.forEach(item =>{
                let row = document.createElement('tr');

                row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.total}</td>
                <td>${item.paid}</td>
                <td>${item.remain}</td>
                <td>${item.date}</td>`;

                udhaarHistoryTable.appendChild(row);
            });
        }
    }

    // Search Udhaar Name in Udhaar History
    function searchInHistory(value){

        let udhaarHistoryTable = document.getElementById('udhaarHistoryTable');
        udhaarHistoryTable.innerHTML = "";

        value = value.trim().toLowerCase();
        if(value === "") return;

        let tx = db.transaction("udhaarHistory","readonly");
        let store = tx.objectStore("udhaarHistory");

        let request = store.getAll();

        request.onsuccess = (e)=>{
            let items = e.target.result;
            let found = false;

            items.forEach(item =>{
                if(item.name.toLowerCase() === value){
                    found = true;

                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>${item.total}</td>
                        <td>${item.paid}</td>
                        <td>${item.remain}</td>
                        <td>${item.date}</td>
                    `;

                    udhaarHistoryTable.appendChild(row);
                }
            });

            if(!found){
                udhaarHistoryTable.innerHTML =
                    `<tr><td colspan="5">No history found</td></tr>`;
            }
        };
    }

    // Deleting the person from the udhar list
    function deleteUdhaar(name){

        let tx = db.transaction("udhaar", "readwrite");
        let store = tx.objectStore("udhaar");

        store.delete(name);

        tx.oncomplete = () => {
            updateUdhaarTable();
        };
    }

    // Deleting Udhaar History From DB.
    function deleteHistory(name){
        let tx = db.transaction("udhaarHistory","readwrite");
        let store = tx.objectStore("udhaarHistory");

        let request = store.getAll();
        request.onsuccess=(e)=>{
            let item = e.target.result;

            item.forEach(item =>{
                if(item.name === name){
                    store.delete(item.id);
                }
            });
            updateUdhaarHistoryTable();
        }
    }
    
    function delUdhaarProfitHistory(name){
        let tx = db.transaction("udhaarProfit","readwrite");
        let store = tx.objectStore("udhaarProfit");

        let request = store.get(name);
        request.onsuccess=(e)=>{
            let item = e.target.result;
                 store.delete(item.name);
        }
            
    }

    //Paid Money Function
    function paidMoney(){
        let inputName = document.getElementById("paidName").value.trim();
        let inputAmount = parseInt(document.getElementById("paidAmount").value);

        let tx = db.transaction("udhaar","readwrite");
        let store = tx.objectStore("udhaar");

        let request = store.get(inputName);

        request.onsuccess = (e)=>{
            let item = e.target.result;

            if(item){
                item.paid = inputAmount;
                item.remaining -= inputAmount;

                store.put(item);
                addUdhaarHistory(inputName);
                updateUdhaarTable();
                updateUdhaarHistoryTable();
                calculateNetProfit(inputName,inputAmount);
            }
        }
    }

    // Calculating Daily Profit.
    function dailyProfit(name,qty){

        let today = new Date().toLocaleDateString("en-GB");

        let invTx = db.transaction("inventory", "readonly");
        let invStore = invTx.objectStore("inventory");
        let stockReq = invStore.get(name);

        stockReq.onsuccess = (e) => {

            let stock = e.target.result;
            if (!stock) return;

            let profit = (stock.Sp - stock.Cp) * qty; // calculating profit

            let dpTx = db.transaction("dailyProfit", "readwrite");
            let dpStore = dpTx.objectStore("dailyProfit");

            let req = dpStore.get(today);

            req.onsuccess = (ev) => {
                let item = ev.target.result;

                if (item) {
                    item.profit += profit;
                    dpStore.put(item);   
                } else {
                    dpStore.add({
                        date: today,
                        profit: profit
                    });
                }
            };
            showDailyProfit();
            calculateMonthlyProfit();
        };
    }

    // Showing Daily Profit In The UI
    function showDailyProfit(){
        let oneDayProfit = document.getElementById("oneDayProfit");
        oneDayProfit.innerHTML = "";

        let today = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

        let tx = db.transaction("dailyProfit","readonly");
        let store = tx.objectStore("dailyProfit");

        let req = store.get(today);

        req.onsuccess = (e) => {
            let item = e.target.result;

            if(item){
                oneDayProfit.innerHTML = "₹ " + Number(item.profit || 0);
            } else {
                oneDayProfit.innerHTML = "₹ 0";
            }
        };
    }

    // Deleting The Last Month All Days Profit
    function cleanupDailyProfit(){

        let today = new Date();
        let currentMonth = today.getMonth() + 1;
        let currentYear  = today.getFullYear();

        let tx = db.transaction("dailyProfit", "readwrite");
        let store = tx.objectStore("dailyProfit");

        let req = store.getAll();

        req.onsuccess = (e) => {
            let items = e.target.result;

            items.forEach(item => {
                
                let parts = item.date.split("/");
                let itemMonth = parseInt(parts[1]);
                let itemYear  = parseInt(parts[2]);

                if(itemMonth !== currentMonth || itemYear !== currentYear){
                    store.delete(item.date);
                }
            });
        };
    }

    // Calculating Monthly Profit And Saving In Monthly Profit DB
    function calculateMonthlyProfit(expense){

        let today = new Date();
        let monthKey = String(today.getMonth() + 1).padStart(2, "0") + "-" + today.getFullYear();

        let tx = db.transaction(["dailyProfit", "monthlyProfit"], "readwrite");
        let dailyStore = tx.objectStore("dailyProfit");
        let monthlyStore = tx.objectStore("monthlyProfit");

        // Getting All Daily Profit From Database. 
        let dailyReq = dailyStore.getAll();

        dailyReq.onsuccess = (e) => {
            let dailyItems = e.target.result;
            let monthlyTotal = 0;
            
            // Running Loop On All Data Of Daily Profit
            dailyItems.forEach(item => {
                let parts = item.date.split("/"); // DD/MM/YYYY
                let itemMonth = Number(parts[1]);
                let itemYear  = Number(parts[2]);

                if (
                    itemMonth === Number(monthKey.split("-")[0]) &&
                    itemYear  === Number(monthKey.split("-")[1])
                ) {
                    monthlyTotal += Number(item.profit || 0);
                }
            });

            // Getting Key Data From Monthly DB
            let monthReq = monthlyStore.get(monthKey);

            monthReq.onsuccess = (ev) => {

                let monthData = ev.target.result;
                let safeExpense = Number(expense || 0);

                if(isNaN(safeExpense)) safeExpense = 0;

                if(monthData){
                    monthData.profit  = monthlyTotal;
                    monthData.expense += Number(expense || 0)
                    monthlyStore.put(monthData);
                } else {
                    monthlyStore.add({
                        month: monthKey,
                        profit: monthlyTotal,
                        expense: 0
                    });
                }

                showMonthlyProfit(monthlyTotal);
                netProfit();
            };
        };
    }

    //  Delete Last Year ALL Monthly Profit.
    function cleanupYearlyMonthlyProfit(){

        let currentYear = new Date().getFullYear();

        let tx = db.transaction("monthlyProfit", "readwrite");
        let store = tx.objectStore("monthlyProfit");

        let req = store.getAll();

        req.onsuccess = (e) => {
            let items = e.target.result;

            items.forEach(item => {
                if(!item.month) return;

                // month format: MM-YYYY
                let parts = item.month.split("-");
                let itemYear = Number(parts[1]);

                if(itemYear < currentYear){
                    store.delete(item.month);
                }
            });
        };

        tx.onerror = () => {
            console.error("Yearly monthlyProfit cleanup failed");
        };
    }

    // Showing Monthly In UI
    function showMonthlyProfit(amount){
        let el = document.getElementById("oneMonthProfit");
        el.innerText = "₹ " + amount;
    }

    // Calculating Udhaar Profit.
    function udhaarProfit(name, productname, qty){

        if(!name || !productname || !qty){
            console.log("Invalid input", name, productname, qty);
            return;
        }

        let invTx = db.transaction("inventory", "readonly");
        let invStore = invTx.objectStore("inventory");

        let invReq = invStore.get(productname);

        invReq.onsuccess = (e) => {
            let stock = e.target.result;
            if(!stock){
                console.log("Stock not found");
                return;
            }
            let profit = (Number(stock.Sp) - Number(stock.Cp)) * Number(qty);

            let tx = db.transaction("udhaarProfit", "readwrite");
            let store = tx.objectStore("udhaarProfit");

            let req = store.get(name);

            req.onsuccess = (ev) => {
                let item = ev.target.result;

                if(item){
                    item.profit = Number(item.profit || 0) + profit;
                    store.put(item);
                } else {
                    store.add({
                        name: name,
                        profit: profit
                    });
                }
            };
            tx.onerror = (e) => console.log("TX error", e);
        };
    }

    // Calculating Net Profit Of current Month
    function netProfit(){
        let today = new Date();
        let month = String(today.getMonth() + 1).padStart(2, "0") + "-" + today.getFullYear();

        // Open transaction
        let tx = db.transaction(["monthlyProfit", "netProfit"], "readwrite");

        let monthlyStore = tx.objectStore("monthlyProfit");
        let netStore     = tx.objectStore("netProfit");

        //  Getting Particular Month Data.
        let req = monthlyStore.get(month);

        req.onsuccess = (e) => {
            let item = e.target.result;
            if(!item) return;

            // First get existing netProfit for this month
            let netReq = netStore.get(month);

            netReq.onsuccess = (ev) => {
                let data = ev.target.result;

                if(data){
                    // Update existing
                    data.netProfit = Number(item.profit || 0) - Number(item.expense || 0);
                    netStore.put(data);
                } else {
                    // Add new
                    netStore.put({
                        month: month,
                        netProfit: Number(item.profit || 0) - Number(item.expense || 0),
                        udhaarProfit:0
                    });
                }
            };

            // showNetProfit should run after transaction complete**
            tx.oncomplete = () => {
                showNetProfit();
            };

            tx.onerror = (err) => {
                console.error("Transaction failed:", err);
            };
        };
    }

    // Calculating Total Actual Realised Profit .
    function calculateNetProfit(name, amount) {

        amount = Number(amount);

        let today = new Date();
        let month = String(today.getMonth() + 1).padStart(2, "0") + "-" + today.getFullYear();

        // transaction for udhaarProfit and netProfit
        let tx = db.transaction(
            ["udhaarProfit", "netProfit"],
            "readwrite"
        );

        let udhaarStore = tx.objectStore("udhaarProfit");
        let netStore    = tx.objectStore("netProfit");

        // Step 1: Get udhaar profit
        let req = udhaarStore.get(name);

        req.onsuccess = (e) => {
            let item = e.target.result;
            if (!item) return;

            let udhaarProfit = Number(item.profit || 0);
            if(udhaarProfit <= 0){

                let netReq = netStore.get(month);
                netReq.onsuccess = (ev) => {
                    let netItem = ev.target.result;

                        netItem.netProfit = Number(netItem.netProfit || 0) +  Number(netItem.udhaarProfit || 0);
                        netStore.put(netItem);
                };
                showNetProfit();
            }else{
                let realisedProfit = 0;

                if (amount >= udhaarProfit) {
                    realisedProfit = udhaarProfit;
                    item.profit = 0;
                } else {
                    realisedProfit = amount;
                    item.profit = udhaarProfit - amount;
                }

                // update remaining udhaar profit
                udhaarStore.put(item);

                // Step 2: add realised udhaar profit to existing netProfit in DB
                let netReq = netStore.get(month);

                netReq.onsuccess = (ev) => {
                    let netItem = ev.target.result;

                        netItem.netProfit = Number(netItem.netProfit || 0);
                        netItem.udhaarProfit += realisedProfit;
                        netStore.put(netItem);
                };
                showNetProfit();
            }
        };
    }

    // Showing Total profit In UI.
    function showNetProfit(){

        let today = new Date();
        let month = String(today.getMonth() + 1).padStart(2, "0") + "-" + today.getFullYear();
        let profitEl = document.getElementById("OneMonthNetProfit");

        let tx = db.transaction("netProfit", "readonly");
        let store = tx.objectStore("netProfit");

        let req = store.get(month);

        req.onsuccess = (e) => {
            let item = e.target.result;

            if(item){
                let totalProfit = Number(item.netProfit || 0) + Number(item.udhaarProfit || 0)
                profitEl.innerText = "₹ " + Number(totalProfit || 0);
            } else {
                profitEl.innerText = "₹ 0";
            }
        };
    }

    //  Deleting Last Year All Month Total Profit.
    function cleanupYearlyNetProfit(){

        let currentYear = new Date().getFullYear();

        let tx = db.transaction("netProfit", "readwrite");
        let store = tx.objectStore("netProfit");

        let req = store.getAll();

        req.onsuccess = (e) => {
            let items = e.target.result;

            items.forEach(item => {
                if(!item.month) return;

                // month format: MM-YYYY
                let parts = item.month.split("-");
                let itemYear = Number(parts[1]);

                if(itemYear < currentYear){
                    store.delete(item.month);
                }
            });
        };

        tx.onerror = () => {
            console.error("NetProfit yearly cleanup failed");
        };
    }

    
    // Popup Low Stock Function
    function lowStocksPopup(){
        let tx = db.transaction("inventory","readonly");
        let store = tx.objectStore("inventory");

        let request = store.getAll();

        let item = {};
        request.onsuccess = (e) =>{
            item = e.target.result;

            let lowStockList = document.getElementById('lowStockList');
            lowStockList.innerHTML = "";

            item.forEach(item => {
            let li = document.createElement('li');
            if(item.status === "low"){
                li.innerHTML = item.name + " " + ":" + " " + item.status;
            }
            lowStockList.appendChild(li);
            });
        }
    }

    //  Backup All Database From the DB
    function backupDatabase(){

        if(!db){
            alert("Database not ready");
            return;
        }

        let backupData = {}; 

        let storeNames = Array.from(db.objectStoreNames);

        let tx = db.transaction(storeNames, "readonly");

        let completed = 0;

        storeNames.forEach(storeName => {

            let store = tx.objectStore(storeName);
            let request = store.getAll();

            request.onsuccess = (e) => {
                backupData[storeName] = e.target.result;
                completed++;

                if(completed === storeNames.length){
                    downloadBackupFile(backupData);
                }
            };
            request.onerror = () => {
                console.error("Error reading store:", storeName);
            };
        });
    }

    // Downloading that Backup File
    function downloadBackupFile(data){

        let jsonData = JSON.stringify(data, null, 2);

        let blob = new Blob([jsonData], { type: "application/json" });

        let url = URL.createObjectURL(blob);

        // hidden download link
        let a = document.createElement("a");
        a.href = url;
        a.download = "MyKiranaApp_Backup.json";

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        // memory clean
        URL.revokeObjectURL(url);
    }

    //  Restoring Data From the System
    function restoreDatabase(){

        let fileInput = document.getElementById("restoreFile");
        let file = fileInput.files[0];

        if(!file){
            alert("Please select backup file");
            return;
        }

        let reader = new FileReader();

        reader.onload = function(e){

            let backupData = JSON.parse(e.target.result);

            let storeNames = Object.keys(backupData);

            let tx = db.transaction(storeNames, "readwrite");

            storeNames.forEach(storeName => {

                if(!db.objectStoreNames.contains(storeName)){
                    console.warn("Store not found:", storeName);
                    return;
                }

                let store = tx.objectStore(storeName);

                store.clear();

                backupData[storeName].forEach(item => {
                    store.put(item);
                });
            });

            tx.oncomplete = () => {
                alert("Database restored successfully ");
            };

            tx.onerror = () => {
                alert("Restore failed ");
            };
        };
        reader.readAsText(file);
    }
