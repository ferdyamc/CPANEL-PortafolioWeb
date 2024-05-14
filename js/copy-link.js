let btnsheet = document.getElementById("btn-link-sheet");//botón para copiar la hója de calculo
let btndrive = document.getElementById("btn-link-drive");//botón para copiar la carpeta de drive

//Evento para copiar link de la hoja de cáculo y cambiar el estilo de ícono "copiar" por 1 segundo al hacer click en el ícono
btnsheet.addEventListener("click" , ()=>{
    navigator.clipboard.writeText(document.getElementById("text-link-sheet").textContent);
    btnsheet.classList.remove("fa-regular");
    btnsheet.classList.add("fa-solid");
    btnsheet.style.color = "white";

    setTimeout(()=>{
        btnsheet.classList.remove("fa-solid");
        btnsheet.classList.add("fa-regular");    
        btnsheet.style.color = "black"; 
    },1000)
})

//Evento para copiar link de la carpeta de drive y cambiar el estilo de ícono "copiar" por 1 segundo al hacer click en el ícono
btndrive.addEventListener("click" , ()=>{
    navigator.clipboard.writeText(document.getElementById("text-link-drive").textContent);
    btndrive.classList.remove("fa-regular");
    btndrive.classList.add("fa-solid");
    btndrive.style.color = "white";

    setTimeout(()=>{
        btndrive.classList.remove("fa-solid");
        btndrive.classList.add("fa-regular");    
        btndrive.style.color = "black"; 
    },1000)
})