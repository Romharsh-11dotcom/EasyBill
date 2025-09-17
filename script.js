let currentUser = {username:'', company:{}, customers:[], items:[], invoices:[]};
let currentPage = 1;

// Page Navigation
function goToPage(n){
  document.querySelectorAll('.page').forEach((p,i)=>{p.classList.remove('active');});
  document.querySelectorAll('.page')[n-1].classList.add('active');
  currentPage = n;
  populateInvoiceDropdowns();
  highlightNavButton();
}

function goNext(){if(currentPage<7) goToPage(currentPage+1);}
function goBack(){if(currentPage>1) goToPage(currentPage-1);}

// Highlight Navbar Button
function highlightNavButton(){
  document.querySelectorAll('#nav-left button').forEach((btn,i)=>{
    if(i+1===currentPage) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

// Dark Mode
document.getElementById('darkModeToggle').addEventListener('click',()=>{
  document.body.classList.toggle('dark-mode');
});

// Account
function createAccount(){
  let name=document.getElementById('username').value.trim();
  if(!name){alert('Enter username'); return;}
  currentUser.username=name;
  saveData();
  goNext();
}

// Company
document.getElementById('companyLogo').addEventListener('change',function(e){
  let reader=new FileReader();
  reader.onload=function(){
    currentUser.company.logo=reader.result;
    let preview=document.getElementById('logoPreview');
    preview.src=reader.result;
    preview.style.display='block';
  };
  reader.readAsDataURL(e.target.files[0]);
});
function saveCompany(){
  currentUser.company.name=document.getElementById('companyName').value;
  currentUser.company.pan=document.getElementById('companyPan').value;
  currentUser.company.address=document.getElementById('companyAddress').value;
  currentUser.company.contact=document.getElementById('companyContact').value;
  saveData();
  goNext();
}

// Customers
function addCustomer(){
  let c={
    name:document.getElementById('custName').value,
    contact:document.getElementById('custContact').value,
    pan:document.getElementById('custPan').value,
    email:document.getElementById('custEmail').value,
    address:document.getElementById('custAddress').value,
    ledger:[]
  };
  currentUser.customers.push(c); saveData(); renderCustomers();
}
function renderCustomers(){
  let list=document.getElementById('customerList'); list.innerHTML='';
  currentUser.customers.forEach((c,i)=>{
    list.innerHTML+=`<div class="card">${c.name} - ${c.contact} 
      <button onclick="deleteCustomer(${i})">Delete</button> 
      <button onclick="openLedger(${i})">Ledger</button>
    </div>`;
  });
}
function deleteCustomer(i){currentUser.customers.splice(i,1); saveData(); renderCustomers();}

// Ledger
function openLedger(index){
  let c=currentUser.customers[index];
  let ledgerDiv=document.getElementById('ledgerView');
  ledgerDiv.innerHTML=`<h3>${c.name} - Ledger</h3>`;
  if(c.ledger.length===0){ledgerDiv.innerHTML+="<p>No transactions yet.</p>";return;}
  c.ledger.forEach((l,i)=>{
    ledgerDiv.innerHTML+=`<div style="border:1px solid #2575fc;margin:5px;padding:5px;border-radius:8px;color:${l.status==='Paid'?'green':l.status==='Half Paid'?'orange':'red'};">
      <b>Invoice ${l.invoiceNo} - Total: ${l.total.toFixed(2)}</b><br>
      <select id="ledgerStatus${index}_${i}">
        <option value="Not Paid" ${l.status==='Not Paid'?'selected':''}>Not Paid</option>
        <option value="Half Paid" ${l.status==='Half Paid'?'selected':''}>Half Paid</option>
        <option value="Paid" ${l.status==='Paid'?'selected':''}>Paid</option>
      </select>
      <button onclick="saveLedger(${index},${i})">Save</button>
    </div>`;
  });
}
function saveLedger(custIndex, ledgerIndex){
  let status=document.getElementById(`ledgerStatus${custIndex}_${ledgerIndex}`).value;
  currentUser.customers[custIndex].ledger[ledgerIndex].status=status;
  saveData(); alert("Ledger updated!");
}

// Items
function addItem(){
  let it={
    name:document.getElementById('itemName').value,
    stock:+document.getElementById('itemStock').value,
    price:+document.getElementById('itemPrice').value,
    expiry:document.getElementById('itemExpiry').value
  };
  currentUser.items.push(it);
  saveData();
  renderItems();
}
function renderItems(){
  let list=document.getElementById('itemList'); list.innerHTML='';
  currentUser.items.forEach((it,i)=>{
    list.innerHTML+=`<div class="card">${it.name} - Stock:${it.stock} - Price:${it.price} - Exp:${it.expiry} 
      <button onclick="deleteItem(${i})">Delete</button> 
      <input type="number" id="addStock${i}" placeholder="Add Qty" style="width:60px;">
      <button onclick="addStock(${i})">➕ Stock</button>
    </div>`;
  });
}
function addStock(i){
  let qty=+document.getElementById(`addStock${i}`).value;
  if(qty>0){currentUser.items[i].stock+=qty; saveData(); renderItems();}
  else alert("Enter valid quantity");
}
function deleteItem(i){currentUser.items.splice(i,1); saveData(); renderItems();}

// Invoice
function populateInvoiceDropdowns(){
  let custSel=document.getElementById('invoiceCustomer'); custSel.innerHTML='<option value="">Select Customer</option>';
  currentUser.customers.forEach((c,i)=> custSel.innerHTML+=`<option value="${i}">${c.name}</option>`);
  let itemSel=document.getElementById('invoiceItem'); itemSel.innerHTML='<option value="">Select Item</option>';
  currentUser.items.forEach((it,i)=> itemSel.innerHTML+=`<option value="${i}">${it.name}</option>`);
}
function addInvoiceItem(){
  let idx=document.getElementById('invoiceItem').value;
  let qty=+document.getElementById('invoiceQty').value;
  if(idx===""||qty<=0){alert('Select item & qty');return;}
  let it=currentUser.items[idx]; 
  let list=document.getElementById('invoiceItemsList');
  list.innerHTML+=`<div data-name="${it.name}" data-price="${it.price}" data-qty="${qty}" data-expiry="${it.expiry}">${it.name} - Qty:${qty} - Price:${it.price} - Total:${(it.price*qty).toFixed(2)}</div>`;
}
function createInvoice(){
  let custIdx=document.getElementById('invoiceCustomer').value;
  if(custIdx===""){alert('Select Customer');return;}
  let vat=document.getElementById('enableVat').checked;
  let discount=+document.getElementById('discountRate').value||0;
  let items=[];
  document.querySelectorAll('#invoiceItemsList div').forEach(div=>{
    items.push({
      name:div.dataset.name,
      price:+div.dataset.price,
      qty:+div.dataset.qty,
      expiry:div.dataset.expiry,
      total:+div.dataset.price*+div.dataset.qty
    });
  });
  let invoiceNo=currentUser.invoices.length+1;
  let total=items.reduce((s,it)=>s+it.total,0);
  let discountAmt=total*discount/100;
  let vatAmt=vat?total*0.12:0;
  let grand=total+vatAmt-discountAmt;
  let inv={
    invoiceNo,
    date:new Date().toLocaleDateString(),
    customer:currentUser.customers[custIdx],
    items,
    discount,
    vat,
    grandTotal:grand
  };
  currentUser.invoices.push(inv);
  currentUser.customers[custIdx].ledger.push({invoiceNo,total:grand,status:'Not Paid'});
  saveData(); alert('Invoice Saved!'); renderInvoices(); viewInvoice(currentUser.invoices.length-1);
}

// Invoices List
function renderInvoices(){
  let list=document.getElementById('invoiceList'); list.innerHTML='';
  currentUser.invoices.forEach((inv,i)=>{
    list.innerHTML+=`<div class="card">Invoice ${inv.invoiceNo} - ${inv.customer.name} - Total:${inv.grandTotal.toFixed(2)} 
      <button onclick="viewInvoice(${i})">View</button> 
      <button onclick="deleteInvoice(${i})">Delete</button>
    </div>`;
  });
}
function deleteInvoice(i){
  let inv=currentUser.invoices[i];
  let cust=currentUser.customers.find(c=>c.name===inv.customer.name);
  if(cust) cust.ledger=cust.ledger.filter(l=>l.invoiceNo!==inv.invoiceNo);
  currentUser.invoices.splice(i,1);
  saveData(); renderInvoices();
}

// Invoice View
function viewInvoice(idx){
  goToPage(7);
  let inv=currentUser.invoices[idx],company=currentUser.company,customer=inv.customer;
  let html=`<div style="padding:15px;border:2px solid #2575fc;border-radius:12px;background:#f0f4ff;">
    <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
      <div>${company.logo?`<img src="${company.logo}" style="width:100px;height:80px;object-fit:contain;"><br>`:''}<b>${company.name||''}</b><br>PAN:${company.pan||''}<br>${company.address||''}<br>Contact:${company.contact||''}</div>
      <div>Date:${inv.date}<br>Invoice No:${inv.invoiceNo}</div>
    </div>
    <div>Customer: ${customer.name}<br>PAN:${customer.pan||''}<br>Contact:${customer.contact||''}<br>Email:${customer.email||''}<br>Address:${customer.address||''}</div>
    <table border="1" cellspacing="0" cellpadding="5" style="width:100%;margin-top:15px;text-align:center;">
      <tr><th>SN</th><th>Description</th><th>Rate</th><th>Qty</th><th>Exp Date</th><th>Total</th></tr>`;
  inv.items.forEach((it,i)=>{html+=`<tr><td>${i+1}</td><td>${it.name}</td><td>${it.price}</td><td>${it.qty}</td><td>${it.expiry}</td><td>${it.total.toFixed(2)}</td></tr>`;});
  html+=`</table>
    <div style="text-align:right;margin-top:10px;">
      Discount:${inv.discount||0}<br>VAT:${inv.vat? (inv.grandTotal*0.12).toFixed(2):0}<br><b>Grand Total:${inv.grandTotal.toFixed(2)}</b>
    </div>
    <div style="margin-top:20px;"><b>Signature:</b>________________
      <div class="status-container">
        <label>Paid <input type="radio" name="status${inv.invoiceNo}" data-invoice="${inv.invoiceNo}" value="Paid" ${inv.customer.ledger.find(l=>l.invoiceNo===inv.invoiceNo)?.status==='Paid'?'checked':''}></label>
        <label>Half Paid <input type="radio" name="status${inv.invoiceNo}" data-invoice="${inv.invoiceNo}" value="Half Paid" ${inv.customer.ledger.find(l=>l.invoiceNo===inv.invoiceNo)?.status==='Half Paid'?'checked':''}></label>
        <label>Not Paid <input type="radio" name="status${inv.invoiceNo}" data-invoice="${inv.invoiceNo}" value="Not Paid" ${inv.customer.ledger.find(l=>l.invoiceNo===inv.invoiceNo)?.status==='Not Paid'?'checked':''}></label>
      </div>
    </div>
  </div>`;  
  document.getElementById('invoiceView').innerHTML=html;

  // Auto-save radio changes
  document.querySelectorAll(`#invoiceView input[type="radio"]`).forEach(radio=>{
    radio.addEventListener('change', function(){
      let invNo = +this.dataset.invoice;
      let invObj = currentUser.invoices.find(inv=>inv.invoiceNo===invNo);
      if(invObj){
        let ledgerItem = invObj.customer.ledger.find(l=>l.invoiceNo===invNo);
        if(ledgerItem){
          ledgerItem.status = this.value;
          saveData();
        }
      }
    });
  });
}

// Save & Print
document.getElementById('saveInvoiceView').addEventListener('click',()=>{
  html2canvas(document.getElementById('invoiceView')).then(canvas=>{
    let link=document.createElement('a');
    link.download='invoice.png';
    link.href=canvas.toDataURL();
    link.click();
  });
});
document.getElementById('printInvoiceView').addEventListener('click',()=>{window.print();});

// Local Storage
function saveData(){localStorage.setItem('easyBillUser',JSON.stringify(currentUser));}
function loadData(){
  let data=localStorage.getItem('easyBillUser'); 
  if(data){currentUser=JSON.parse(data); renderCustomers(); renderItems(); renderInvoices(); populateInvoiceDropdowns(); highlightNavButton();}
}
window.onload=loadData;
