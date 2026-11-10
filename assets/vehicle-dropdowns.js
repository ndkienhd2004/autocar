(() => {
 function init(){
 document.querySelectorAll('[data-vehicle-selector], [data-product-vehicle]').forEach(root=>{
 if(root.dataset.dropdownReady)return;root.dataset.dropdownReady='true';
 const data=window.dataVehicle||{};
 const year=root.querySelector('[data-vehicle-year]'),make=root.querySelector('[data-vehicle-make]'),model=root.querySelector('[data-vehicle-model]');
 if(!year||!make||!model)return;
 const trims=root.querySelector('[data-vehicle-trims]');
 const reset=(select,label)=>{select.replaceChildren(new Option(label,''));select.disabled=true;};
 function groupedOptions(select,items,topCount,getName){
   const groups=[['Top sellers',items.slice(0,topCount)],['All others',items.slice(topCount)]];
   groups.forEach(([label,entries])=>{if(!entries.length)return;const group=document.createElement('optgroup');group.label=label;entries.forEach(item=>{const name=getName(item);group.append(new Option(name,name));});select.append(group);});
 }

 function sync(){
 const extra=trims?[...trims.querySelectorAll('select')]:[];
 const valid=[year,make,model,...extra].every(s=>!!s.value);
 const property=document.querySelector('.product__vehicle-property-input');
 if(root.hasAttribute('data-product-vehicle')&&property)property.value=[year.value,make.value,model.value,...extra.map(s=>s.value)].filter(Boolean).join('-');
 const error=root.querySelector('.required-text-vehicle');if(error){error.dataset.required=valid?'false':'true';error.hidden=valid;}
 }
 function addTrim(items,level=0){
 if(!items?.length||!trims)return;
 const select=document.createElement('select');select.className=level?'dropdown-select-cabsize':'dropdown-select-trim';select.required=true;
 select.setAttribute('form',year.getAttribute('form')||'');select.setAttribute('aria-label',level?'Cab size':'Trim');select.append(new Option(level?'Cab size':'Trim',''));
 items.forEach(x=>{const name=typeof x==='string'?x:x.name;select.add(new Option(name,name));});trims.append(select);
 select.addEventListener('change',()=>{while(select.nextElementSibling)select.nextElementSibling.remove();const item=items.find(x=>(typeof x==='string'?x:x.name)===select.value);if(item?.trims)addTrim(item.trims,level+1);sync();});
 }
 Object.keys(data).sort((a,b)=>b-a).forEach(y=>year.add(new Option(y,y)));reset(make,'Make');reset(model,'Model');
 year.addEventListener('change',()=>{reset(make,'Make');reset(model,'Model');trims?.replaceChildren();groupedOptions(make,data[year.value]||[],6,item=>item.make);make.disabled=make.options.length<2;sync();});
 make.addEventListener('change',()=>{reset(model,'Model');trims?.replaceChildren();const models=(data[year.value]||[]).find(x=>x.make===make.value)?.models||[];const topSellerMake=(data[year.value]||[]).slice(0,6).some(item=>item.make===make.value);
 const getName=item=>typeof item==='string'?item:item.name;
 if(topSellerMake&&make.value!=='Honda')groupedOptions(model,models,['Ford','Chevrolet','GMC','Honda'].includes(make.value)?4:3,getName);
 else models.forEach(item=>{const name=getName(item);model.add(new Option(name,name));});model.disabled=model.options.length<2;sync();});
 model.addEventListener('change',()=>{trims?.replaceChildren();const item=(data[year.value]||[]).find(x=>x.make===make.value)?.models.find(x=>(typeof x==='string'?x:x.name)===model.value);addTrim(item?.trims);sync();});
 const params=new URLSearchParams(location.search);for(const [key,select] of [['year',year],['make',make],['model',model]]){if(params.get('vehicle_'+key)){select.value=params.get('vehicle_'+key);select.dispatchEvent(new Event('change'));}}
 if(root.hasAttribute('data-vehicle-selector'))root.addEventListener('submit',e=>{e.preventDefault();if(!root.reportValidity())return;const url=new URL('/products/camo-seat-covers',location.origin);for(const [key,select] of [['year',year],['make',make],['model',model]])url.searchParams.set('vehicle_'+key,select.value);location.assign(url.toString());});
 sync();
 });}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
