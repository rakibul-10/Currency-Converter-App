import countryList from "./countrylist.js";

const BASE_URL = `https://api.currencyapi.com/v3/latest?apikey=cur_live_7UStkUqQNBmahSoy8K635tE3Sjr5fK1UVPmVloZ2&base_currency=`;


const dropdownselects = document.querySelectorAll(".dropdowns select");
const btn=document.querySelector("form button");
const amountInput = document.querySelector("#amount");
const msgDiv = document.querySelector(".msg");


for(let selects of dropdownselects){
   for(let currcode in countryList){
       let newoption = document.createElement("option");
       newoption.innerText=currcode;
       newoption.value=currcode;
       if(currcode=="USD" && selects.id=="from") newoption.selected=true; 
       if(currcode=="BDT" && selects.id=="to") newoption.selected=true;
       selects.append(newoption);

       selects.addEventListener("change",(evnt)=>{
         updateflag(evnt.target);
       })
   }
}
 
const updateflag = (elemnt) => {
    let currcode = elemnt.value;  
    let countrycode = countryList[currcode]; 
    let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`; 
    let img = elemnt.parentElement.querySelector("img"); 
    img.src = newsrc;
    img.alt = `${countrycode} Flag`;
}

// Function to fetch conversion rate and update message
const updateConversion = async () => {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        msgDiv.innerText = "Please enter a valid amount.";
        return;
    }

    const fromCurrency = document.querySelector("#from").value;
    const toCurrency = document.querySelector("#to").value;

    try {
        const response = await fetch(BASE_URL + fromCurrency);
        const data = await response.json();

        // Get conversion rate for target currency
        const rate = data.data[toCurrency].value;

        // Calculate converted amount
        const convertedAmount = (amount * rate).toFixed(2);

        // Update message
        msgDiv.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } catch (error) {
        console.error("Error fetching currency data:", error);
        msgDiv.innerText = "Failed to fetch conversion rate. Try again later.";
    }
}

// Button click event
btn.addEventListener("click", (event) => {
    event.preventDefault();
    updateConversion();
});