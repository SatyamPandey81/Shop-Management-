function today(){return new Date().toISOString().split("T")[0];}

let items = JSON.parse(localStorage.getItem("items")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let udhaar = JSON.parse(localStorage.getItem("udhaar")) || [];

// ===== STOCK =====
document.getElementById("addStockBtn").onclick = function(){
  let name = document.getElementById("name").value.trim();
  let barcode = document.getElementById("barcode").value.trim();
  let qty = Number(document.getElementById("qty").value);
  let cp = Number(document.getElementById("cp").value);
  let sp = Number(document.getElementById("sp").value);
  if(!name || !qty || !cp || !sp) return alert("Fill all fields");

  let item = items.find(i=>i.name===name);
  if(item){ item.qty+=qty; item.cp=cp; item.sp=sp;}
  else items.push({name,barcode,qty,cp,sp});
  localStorage.setItem("items",JSON.stringify(items));
  clearStockInputs();
  displayStock(); checkLowStock();
}

function clearStockInputs(){
  document.getElementById("name").value="";
  document.getElementById("barcode").value="";
  document.getElementById("qty").value="";
  document.getElementById("cp").value="";
  document.getElementById("sp").value="";
}

function displayStock(filter=""){
  let table = document.getElementById("stockTable"); table.innerHTML="";
  items.filter(i=>i.name.toLowerCase().includes(filter.toLowerCase())).forEach((i,index)=>{
    table.innerHTML+=`<tr>
      <td>${i.name}</td>
      <td>${i.qty}</td>
      <td>${i.cp}</td>
      <td>${i.sp}</td>
      <td class="${i.qty<=5?'low':''}">${i.qty<=5?'LOW':'OK'}</td>
      <td>
        <button onclick="changeQty(${index},1)">+</button>
        <button onclick="changeQty(${index},-1)">-</button>
        <button onclick="deleteStock(${index})">Delete</button>
      </td>
    </tr>`;
  });
}

function changeQty(index,delta){
  if(items[index].qty+delta<0) return alert("Quantity cannot be negative");
  items[index].qty+=delta;
  localStorage.setItem("items",JSON.stringify(items));
  displayStock(); checkLowStock();
}

function deleteStock(index){if(confirm("Delete this item?")){items.splice(index,1);localStorage.setItem("items",JSON.stringify(items));displayStock();}}

// ===== SELL =====
document.getElementById("sellBtn").onclick = function(){
  let name=document.getElementById("sellName").value.trim();
  let qty=Number(document.getElementById("sellQty").value);
  if(!name||!qty) return alert("Fill fields");
  let item = items.find(i=>i.name===name);
  if(!item) return alert("Item not found");
  if(item.qty<qty) return alert("Insufficient stock");
  if(item.sp<item.cp) alert("⚠ Selling below cost!");
  item.qty-=qty;
  let profit = (item.sp-item.cp)*qty;
  sales.push({date:today(),item:name,qty,profit});
  localStorage.setItem("sales",JSON.stringify(sales));
  localStorage.setItem("items",JSON.stringify(items));
  displayStock(); displayHistory(sales); calculateProfit();
  document.getElementById("sellName").value=""; document.getElementById("sellQty").value="";
}

// ===== EXPENSE =====
document.getElementById("addExpenseBtn").onclick=function(){
  let name=document.getElementById("expenseName").value.trim();
  let amount=Number(document.getElementById("expenseAmount").value);
  if(!name||!amount) return alert("Fill fields");
  expenses.push({date:today(),name,amount});
  localStorage.setItem("expenses",JSON.stringify(expenses));
  calculateProfit();
  document.getElementById("expenseName").value=""; document.getElementById("expenseAmount").value="";
}

// ===== PROFIT =====
function calculateProfit(){
  let daily = sales.filter(s=>s.date===today()).reduce((a,b)=>a+b.profit,0);
  let month = today().slice(0,7);
  let monthly = sales.filter(s=>s.date.startsWith(month)).reduce((a,b)=>a+b.profit,0);
  let expTotal = expenses.filter(e=>e.date.startsWith(month)).reduce((a,b)=>a+b.amount,0);
  document.getElementById("dailyProfit").innerText="Today's Profit: ₹"+daily;
  document.getElementById("monthlyProfit").innerText="This Month's Profit: ₹"+monthly;
  document.getElementById("netProfit").innerText="Net Profit (After Expenses): ₹"+(monthly-expTotal);
}

// ===== SALES HISTORY =====
function displayHistory(list,filter=""){
  let table = document.getElementById("historyTable"); table.innerHTML="";
  list.filter(s=>s.item.toLowerCase().includes(filter.toLowerCase())).forEach(s=>{
    table.innerHTML+=`<tr>
      <td>${s.date}</td><td>${s.item}</td><td>${s.qty}</td><td>₹${s.profit}</td>
    </tr>`;
  });
}
function filterHistory(){
  let date = document.getElementById("filterDate").value;
  displayHistory(sales.filter(s=>s.date===date));
}

// ===== UDHAAR =====
document.getElementById("addUdhaarBtn").onclick=function(){
  let name=document.getElementById("udhaarName").value.trim();
  let type=document.getElementById("udhaarType").value;
  let amount=Number(document.getElementById("udhaarAmount").value);
  if(!name||!amount) return alert("Fill fields");

  let existing = udhaar.find(u=>u.name===name && u.type===type);
  if(existing){
    existing.amount += amount;
  } else {
    udhaar.push({name,type,amount,date:today(),paid:0});
  }

  localStorage.setItem("udhaar",JSON.stringify(udhaar));
  displayUdhaar();
  document.getElementById("udhaarName").value=""; document.getElementById("udhaarAmount").value="";
}

function displayUdhaar(filter=""){
  let table = document.getElementById("udhaarTable"); table.innerHTML="";
  udhaar.filter(u=>u.name.toLowerCase().includes(filter.toLowerCase())).forEach((u,index)=>{
    let remaining = u.amount - u.paid;
    table.innerHTML+=`<tr>
      <td>${u.name}</td>
      <td>${u.type}</td>
      <td>₹${u.amount}</td>
      <td>₹${u.paid}</td>
      <td>₹${remaining}</td>
      <td>${u.date}</td>
      <td>
        <button onclick="addPayment(${index})">Add Payment</button>
        <button onclick="deleteUdhaar(${index})">Delete</button>
      </td>
    </tr>`;
  });
}

function addPayment(index){
  let remaining = udhaar[index].amount - udhaar[index].paid;
  let payment = prompt(`Enter amount to pay/receive (Remaining: ₹${remaining}):`);
  payment = Number(payment);
  if(!payment || payment <=0) return alert("Invalid amount");
  if(payment > remaining) return alert("Cannot exceed remaining amount");
  udhaar[index].paid += payment;
  localStorage.setItem("udhaar",JSON.stringify(udhaar));
  displayUdhaar();
}

function deleteUdhaar(index){if(confirm("Delete this entry?")){udhaar.splice(index,1);localStorage.setItem("udhaar",JSON.stringify(udhaar));displayUdhaar();}}

// ===== LOW STOCK POPUP =====
function checkLowStock(){
  let low = items.filter(i=>i.qty<=5);
  if(low.length>0){
    let list = document.getElementById("lowStockList"); list.innerHTML="";
    low.forEach(i=>{list.innerHTML+=`<li>${i.name} - Qty: ${i.qty}</li>`;});
    document.getElementById("lowStockPopup").style.display="flex";
  }
}
function closeLowStock(){document.getElementById("lowStockPopup").style.display="none";}

// ===== RESET MONTH =====
document.getElementById("resetMonthBtn").onclick=function(){
  if(confirm("Reset monthly data?")){sales=[];expenses=[];localStorage.setItem("sales",JSON.stringify(sales));localStorage.setItem("expenses",JSON.stringify(expenses));displayHistory([]);calculateProfit();}
}

// ===== BACKUP / RESTORE =====
function backupData(){
  const data={items,sales,expenses,udhaar};
  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const storeName = "KiranaStore";
  const url = URL.createObjectURL(blob);
  const a=document.createElement("a"); 
  a.href=url; 
  a.download=`${storeName}_backup_${today()}.json`; 
  a.click(); 
  URL.revokeObjectURL(url);
}
function restoreData(event){
  const file=event.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const data=JSON.parse(e.target.result);
      if(data.items) {items=data.items; localStorage.setItem("items",JSON.stringify(items));}
      if(data.sales) {sales=data.sales; localStorage.setItem("sales",JSON.stringify(sales));}
      if(data.expenses) {expenses=data.expenses; localStorage.setItem("expenses",JSON.stringify(expenses));}
      if(data.udhaar) {udhaar=data.udhaar; localStorage.setItem("udhaar",JSON.stringify(udhaar));}
      displayStock(); displayHistory(sales); calculateProfit(); displayUdhaar(); checkLowStock();
      alert("Data restored successfully!");
    }catch(err){alert("Invalid backup file.");}
  }
  reader.readAsText(file);
}

// ===== COLLAPSIBLE SECTIONS =====
function toggleSection(id){
  const div = document.getElementById(id);
  if(div.style.display==="none" || div.style.display===""){
    div.style.display="block";
  } else { div.style.display="none"; }
}

// ===== SEARCH FUNCTIONS =====
function searchStock(){ displayStock(document.getElementById("stockSearch").value); }
function searchSales(){ displayHistory(sales,document.getElementById("salesSearch").value); }
function searchUdhaar(){ displayUdhaar(document.getElementById("udhaarSearch").value); }

// ===== INITIAL LOAD =====
displayStock(); displayHistory(sales); calculateProfit(); displayUdhaar(); checkLowStock();
    
