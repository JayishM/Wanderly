let budget=document.getElementById("budget");
let intrest=document.getElementById("intrest");
let disp=document.querySelector(".disp");
let btn=document.getElementById('btn');

btn.addEventListener("click",async()=>{
    let response=await fetch(`http://localhost:3000/rec?budget=${budget.value}&intrest=${intrest.value}`);
    let result = await response.json();
    disp.innerHTML=`<p>${result.rec}</p>`
});
