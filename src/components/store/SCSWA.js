

const imageurlinput = document.getElementById ( ' image - urt ' ) ;
const inputForm = document.querySelector ( ' form ' ) ;
const userOutputElement =document.getElementById ( ' user - output ' ) 
function renderUserInput ( msg , imageUrl ) {
  const renderedContent = `
   < div > < img src = " ${imageUrl} " alt = " ${msg} " >
   < / div >
    < p > ${msg} < / p > `
  userOutputElement.innerHTML = renderedContent ;
  userOutputElement.style.display = ' flex ' ;}