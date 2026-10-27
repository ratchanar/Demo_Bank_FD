const sampleDeposits = [
 {depositId:'FD001',customerId:'CUST101',principal:100000,rate:7,term:2,maturityDate:dateOffset(12)},
 {depositId:'FD002',customerId:'CUST102',principal:250000,rate:7.25,term:3,maturityDate:dateOffset(25)},
 {depositId:'FD003',customerId:'CUST103',principal:75000,rate:6.5,term:1,maturityDate:dateOffset(55)},
 {depositId:'FD004',customerId:'CUST104',principal:500000,rate:7.1,term:5,maturityDate:dateOffset(150)}
];
let deposits = sampleDeposits.map(x=>({...x})); let editingId = null;
const $ = id => document.getElementById(id);
function dateOffset(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function money(n){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:2,maximumFractionDigits:2}).format(n||0)}
function fmtDate(s){if(!s)return '—';const d=new Date(s+'T12:00:00');return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
function interest(d){return d.principal*d.rate*d.term/100}
function maturity(d){return d.principal+interest(d)}
function daysUntil(s){const today=new Date();today.setHours(0,0,0,0);const d=new Date(s+'T00:00:00');return Math.ceil((d-today)/86400000)}
function status(d){const days=daysUntil(d.maturityDate);if(days<0)return {text:'Matured',className:'matured'};if(days<=30)return {text:'Approaching',className:'soon'};return {text:'Active',className:''}}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){
 const totalP=deposits.reduce((s,d)=>s+d.principal,0),totalI=deposits.reduce((s,d)=>s+interest(d),0),totalM=deposits.reduce((s,d)=>s+maturity(d),0);
 $('totalPrincipal').textContent=money(totalP);$('totalInterest').textContent=money(totalI);$('totalMaturity').textContent=money(totalM);$('depositCount').textContent=`${deposits.length} deposit${deposits.length===1?'':'s'}`;
 const q=$('searchInput').value.trim().toLowerCase();const rows=deposits.filter(d=>[d.depositId,d.customerId,status(d).text].some(x=>String(x).toLowerCase().includes(q)));
 $('depositRows').innerHTML=rows.map(d=>{const st=status(d);return `<tr><td><strong>${escapeHtml(d.depositId)}</strong></td><td>${escapeHtml(d.customerId)}</td><td class="num">${money(d.principal)}</td><td class="num">${d.rate.toFixed(2)}%</td><td class="num">${d.term}</td><td class="num">${money(interest(d))}</td><td class="num"><strong>${money(maturity(d))}</strong></td><td>${fmtDate(d.maturityDate)}</td><td><span class="status ${st.className}">${st.text}</span></td><td><button class="btn secondary smallbtn" onclick="editDeposit('${escapeHtml(d.depositId)}')">Edit</button> <button class="btn danger smallbtn" onclick="deleteDeposit('${escapeHtml(d.depositId)}')">Delete</button></td></tr>`}).join('');
 $('emptyState').hidden=rows.length>0;
 const days=Number($('daysSelect').value);const upcoming=deposits.map(d=>({...d,days:daysUntil(d.maturityDate)})).filter(d=>d.days>=0&&d.days<=days).sort((a,b)=>a.days-b.days);
 $('reportCount').textContent=`${upcoming.length} deposit${upcoming.length===1?'':'s'} due in the next ${days} days`;
 $('maturityReport').innerHTML=upcoming.length?upcoming.map(d=>`<div class="reportitem"><div><strong>${escapeHtml(d.depositId)} · ${escapeHtml(d.customerId)}</strong><small>Maturity amount: ${money(maturity(d))}</small></div><div class="date"><b>${d.days===0?'Today':d.days===1?'Tomorrow':`In ${d.days} days`}</b>${fmtDate(d.maturityDate)}</div></div>`).join(''):'<div class="empty">No deposits due in this period.</div>';
 updatePreview();
}
function updatePreview(){const p=Number($('principal').value),r=Number($('rate').value),t=Number($('term').value);if(p>0&&r>0&&t>0){const i=p*r*t/100;$('calculationPreview').innerHTML=`Estimated simple interest: <strong>${money(i)}</strong><br>Estimated maturity amount: <strong>${money(p+i)}</strong>`}else{$('calculationPreview').textContent='Enter a positive principal, rate and term to preview the calculation.'}}
function clearForm(){editingId=null;$('depositForm').reset();$('formTitle').textContent='Add a fixed deposit';$('saveBtn').textContent='Add deposit';$('formMessage').textContent='';$('formMessage').className='message';$('calculationPreview').textContent='Enter a positive principal, rate and term to preview the calculation.'}
function editDeposit(id){const d=deposits.find(x=>x.depositId===id);if(!d)return;editingId=id;for(const key of ['depositId','customerId','principal','rate','term','maturityDate'])$(key).value=d[key];$('depositId').disabled=true;$('formTitle').textContent='Edit fixed deposit';$('saveBtn').textContent='Save changes';$('formMessage').textContent='Editing '+id+'. Deposit ID cannot be changed.';$('formMessage').className='message';updatePreview();window.scrollTo({top:0,behavior:'smooth'})}
function deleteDeposit(id){if(!confirm(`Delete fictional deposit ${id}?`))return;deposits=deposits.filter(d=>d.depositId!==id);if(editingId===id)clearForm();render()}
$('depositForm').addEventListener('submit',e=>{e.preventDefault();const depositId=$('depositId').value.trim().toUpperCase(),customerId=$('customerId').value.trim().toUpperCase(),principal=Number($('principal').value),rate=Number($('rate').value),term=Number($('term').value),maturityDate=$('maturityDate').value;const msg=$('formMessage');
 if(!depositId||!customerId||!maturityDate){msg.textContent='Please complete all fields.';msg.className='message error';return}
 if(!Number.isFinite(principal)||principal<=0||!Number.isFinite(rate)||rate<=0||!Number.isFinite(term)||term<=0){msg.textContent='Principal, annual interest rate and term must all be greater than zero.';msg.className='message error';return}
 if(rate>100||term>100){msg.textContent='For this demo, the rate and term must each be 100 or less.';msg.className='message error';return}
 if(deposits.some(d=>d.depositId.toUpperCase()===depositId&&d.depositId!==editingId)){msg.textContent='That Deposit ID already exists. Please use a unique ID.';msg.className='message error';return}
 const item={depositId,customerId,principal,rate,term,maturityDate};if(editingId){deposits=deposits.map(d=>d.depositId===editingId?item:d);msg.textContent='Deposit updated.'}else{deposits.push(item);msg.textContent='Deposit added.'}msg.className='message success';$('depositId').disabled=false;editingId=null;$('formTitle').textContent='Add a fixed deposit';$('saveBtn').textContent='Add deposit';$('depositForm').reset();$('calculationPreview').textContent='Enter a positive principal, rate and term to preview the calculation.';render();});
$('resetBtn').addEventListener('click',()=>{$('depositId').disabled=false;clearForm()});$('searchInput').addEventListener('input',render);$('daysSelect').addEventListener('change',render);$('principal').addEventListener('input',updatePreview);$('rate').addEventListener('input',updatePreview);$('term').addEventListener('input',updatePreview);
$('resetSampleBtn').addEventListener('click',()=>{if(confirm('Restore the original four fictional sample records? This replaces current demo changes.')){deposits=sampleDeposits.map(x=>({...x}));clearForm();render()}});
$('exportBtn').addEventListener('click',()=>{const head=['Deposit ID','Customer ID','Principal','Annual Interest Rate (%)','Term (Years)','Interest','Maturity Amount','Maturity Date','Status'];const lines=[head,...deposits.map(d=>[d.depositId,d.customerId,d.principal,d.rate,d.term,interest(d).toFixed(2),maturity(d).toFixed(2),d.maturityDate,status(d).text])].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='xyz_bank_fixed_deposits.csv';a.click();URL.revokeObjectURL(url)});
// Keep Deposit ID enabled when the form is reset or after an edit.
$('depositId').disabled=false;render();
