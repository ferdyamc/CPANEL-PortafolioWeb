const url = "https://script.google.com/macros/s/AKfycbw3MQfNg_RpUIcGQtZ6ejdej9Kaa7eBDe2xVMG66f8VEAe6fOEI3uFwvyEhIv32H90wQg/exec";//URL de implementeación del APPSCRIPT
const form = document.getElementById("formulario");//Formualario (Post)
const nombre = document.getElementById("Nombre");//input nombre (Post)
const descripcion = document.getElementById("AreaDescripcion");//textarea descripción (Post)
const inpImagen = document.getElementById("ImgProyecto");//input img (Post)
const dataList = document.getElementById('lista-proyectos');//ul (lista de proyectos)
const estado1 = document.getElementById("text-status");//small (mensaje de estado de la response)
const estado2 = document.getElementById("text-end");//small (mensaje de estado de la response)
let result,spt,method;//(Variables para: obtener la imagen del input, obtener su base64, cambiar el "action" del body en el json de la request)
getData();//Mostrar la lista de proyectos al cargar la pagina

//Obtener datos de la Nube - rellenar lista -----------------------------------------------------------------(GET)
function getData(){
    document.querySelector("#progress-bar").style.display="block";
    // Limpia el contenido anterior del ul
    dataList.style.display="none";
    /*Obtener en formato JSON los datos de la hoja de calcula de google y llenar UL (listado de pyectos)*/
    fetch(url)
    .then(response => response.json())
    .then(data => {
        
        // Limpia el contenido anterior del ul
        dataList.innerHTML = '';
        // Itera sobre cada fila de los datos recibidos
        data.contents.forEach(row => {
            // Crea un elemento "li" con el contenido de la iteración y lo agrega al "ul"
            const li = document.createElement('li');
            li.classList.add("col-12");   
            li.innerHTML=`
                        <div class="col-12 d-flex flex-wrap">
                            <div class="col-1 col-lg-1 d-flex">
                                <span class="itemListId">${row[0]}</span>
                            </div>
                            <div class="col-2 col-lg-1 d-flex">
                                <img src="https://drive.google.com/thumbnail?id=${row[3]}" alt="" class="img-list itemListImg">
                            </div>
                            <div class="col-9 col-lg-2 d-flex">
                                <p class="m-0 itemListNombre">${row[1]}</p>
                            </div>
                            <div class="col-11 offset-1 mt-3 col-lg-6 offset-lg-0 mt-lg-0 d-flex">
                                <p class="m-0 itemListDescripcion pe-5">${row[2]}</p>
                            </div>
                            <div class="col-12 d-flex justify-content-end mt-3 col-lg-2 justify-content-lg-center mt-lg-0 gap-2 contenedor-edit-delete">
                                <button class="btn btn-outline-secondary btn-list btn-editar" onclick="editar(this)">Editar</button>
                                <button class="btn btn-outline-secondary btn-list" onclick="eliminar(${row[0]})">Eliminar</button>
                            </div>
                        </div>`
            dataList.appendChild(li);
            document.querySelector("#progress-bar").style.display="none";
            dataList.style.display="block";
            /* const imgelement = document.createElement('img');       
            //imgelement.src = `https://drive.google.com/thumbnail?id=${row[1]}`; // Modo para construir la imgane con thumbnail -> miniatura
            imgelement.src = `https://www.googleapis.com/drive/v3/files/${row[1]}?alt=media&key=AIzaSyB-98FDn9xxn2ngaVc3xCbjOowqYJwSl3A`;*/  
        })
    })
    .catch(error => console.error('Error:', error));
}

//Submit ----------------------------------------------------------------------------------------------------(POST)
form.addEventListener("submit", (event)=>{
    //Evitar eventos por defecto (evitar actualizar la pagina al hacer click)
    event.preventDefault();
    //Agregar clase al formulario (para visualiar los checks en los input)
    form.classList.add('was-validated');
    //Mostrar barra de progreso
    document.querySelector("#progress-bar-post").style.display="block";
    //Construir objeto con los datos necesarios (para enviar al appscript)
    method = "post";
    let obj = {
        base64:spt,
        type:inpImagen.files[0].type,
        name:inpImagen.files[0].name,
        nombre:nombre.value,
        descripcion:descripcion.value,
        action:method
    }
    //Utilizar api fetch para enviar el objeto al appscript (request)
    fetch(url,{
        method:"POST",
        body:JSON.stringify(obj),
    })
    .then(response => response.text())//Procesos que se ejecutan una vez realizada la request (response).
    .then(data => {
        //ocultar barra de progreso
        document.querySelector("#progress-bar-post").style.display="none";
        getData();
        form.reset();
        form.classList.remove('was-validated');
        estado1.style.display="block";
        estado2.textContent=" 200 Ok";
        estado2.classList.remove("text-danger");
        estado2.classList.add("text-success");
        desrtuirObjeto();
        ocultarPreview();

        setTimeout(()=>{
           estado1.style.display="none";
        },5000)
    })
    .catch(error => {
        console.error('Error:', error)
        estado1.style.display="block";
        estado2.textContent=" 400 Bad Request";
        estado2.classList.remove("text-success");
        estado1.classList.add("text-danger"); 
        setTimeout(()=>{
            estado2.style.display="none";
         },5000)
    });//capturar mensajes de error

})

//Convertir Imagen del input a base64
inpImagen.addEventListener("change", function(){
    //contruir instacia FileReader
    let fr = new FileReader();
    //Leer la imagen del input en el FileReader
    fr.readAsDataURL(inpImagen.files[0]);
    //función que se ejecuta una vez leida la imagen por el FileReader
    fr.onload = function(){
        result = fr.result;//Captura el valor obtenido
        spt = result.split("base64,")[1];//hace un split al valor obtenido por el FileReader (para retirar la palabra "base64,")
        construirObjeto(spt, inpImagen.files[0].type, inpImagen.files[0].name, nombre.value, descripcion.value);/*Muestra el objeto contruido*/
        mostrarPreview();/*Muestra el preview*/
        reloadscript();
    }
})

//Construir Objeto
function construirObjeto(base64, type, name, nombre, descripcion){
    let contenido = `{

   "nombre" : "${nombre}",

   "descripcion" : "${descripcion}",

   "type" : "${type}","name" : "${name}",
   
   "base64" : "${base64}" 

}`;
    document.getElementById("areaObjeto").textContent = contenido;
}

//Destruir objeto
function desrtuirObjeto(){
    document.getElementById("areaObjeto").value = "";
}

/*Mostrar preview*/
function mostrarPreview(){
    document.getElementById("item-mansory").style.display="block";
    document.getElementById("titulo-proyecto").textContent=nombre.value;
    document.getElementById("descripcion-proyecto").textContent=descripcion.value;
    document.getElementById("img-proyecto").src=result;
}

//Ocultar preview
function ocultarPreview(){
    document.getElementById("item-mansory").style.display="none";
    document.getElementById("titulo-proyecto").textContent="";
    document.getElementById("descripcion-proyecto").textContent="";
    document.getElementById("img-proyecto").src="";
}

//Btn eliminar ---------------------------------------------------------------------------------------------(DELETE)
function eliminar(idDelete){
    method = "delete";

    let objDelete = {
        id:idDelete,
        action:method
    }
    //Mostrar la barra de progreso
    document.querySelector("#progress-bar-delete").style.display="block";
    fetch(url,{
        method:"POST",
        body:JSON.stringify(objDelete),
    })
    .then(response => response.text())
    .then(text => {
        //Ocultar la barra de progreso
        document.querySelector("#progress-bar-delete").style.display="none";
        getData();
    })
    .catch(error => {
        getData();
        console.log("error : ", error);
    })
}

//Submit actualizar ----------------------------------------------------------------------------------------(UPDATE)
function formUpdate(e){
    e.preventDefault();
    let idReg = document.getElementById("idReg").value;
    let nombreUpdate = document.getElementById("nombreUpdate");
    let descripcionUpdate = document.getElementById("descripcionUpdate");
    let imgUpdate = document.getElementById("imgUpdate");
    let obj;

    nombreUpdate = nombreUpdate.value == "" ? "" : nombreUpdate.value;
    descripcionUpdate = descripcionUpdate.value == "" ? "" : descripcionUpdate.value;


    if(imgUpdate.files.length == 0){
        method="update-no-file";
        obj ={
            id : idReg,
            nombre : nombreUpdate,
            descripcion : descripcionUpdate,
            action : method
        }
    }else{
        method="update";
        obj ={
            id : idReg,
            nombre : nombreUpdate,
            descripcion : descripcionUpdate,
            base64 : spt,
            name : imgUpdate.files[0].name,
            type : imgUpdate.files[0].type,
            action : method
        }
    } 
    //Mostrar la barra de progreso
    document.querySelector("#progress-bar-update").style.display="block";
    fetch(url,{
        method:"POST",
        body:JSON.stringify(obj),
    })
    .then(response => response.text())
    .then(data => {
        
        //Ocultar la barra de progreso
        document.querySelector("#progress-bar-update").style.display="none";
        //Ocultar elemento con la clase "hijo"
        let b = document.querySelector(".hijo");
        b.classList.remove("d-block");
        b.style.display="none";
        //Actualizar lista
        getData();
    })
    .catch(error =>{
        console.log("Mensaje de error ",error)
    })
    console.log(obj);
}

//Btn editar (mostrar sección para actualizar)
function editar(btn){

    //Captura el elemento con la clase "hijo" que se agregan a los "li" (para validar si ya existe alguno)
    const hijo = document.querySelector(".hijo");    
    //valida si ya existe un elemento con la clase "hijo"
    if(hijo){
        //si existes lo elimina y regresa los estilos por defecto para todos los botones "Editar"
        hijo.remove();

        const allButtonsEdit = document.querySelectorAll(".btn-editar");

        allButtonsEdit.forEach(btn => {
            btn.classList.remove("btn-danger","btn-outline-secondary");
            btn.classList.add("btn-outline-secondary");
            btn.textContent="Editar";
            btn.removeAttribute("onclick");
            btn.setAttribute('onclick', 'editar(this)');
        })
    }

    //Agrega los nuevos estilos para el botón "Editar" que se presionó (lo convierte en el botón "CANCELAR")
    btn.classList.remove( "btn-outline-secondary");
    btn.classList.add("btn-danger");
    btn.textContent="Cancelar";
    btn.removeAttribute("onclick");
    btn.setAttribute('onclick', 'cancelarEditar(this)');

    //Captura el ancestro "li" mas cercano al botón ""Editar" presionado
    const listItem = btn.closest("li");

    //Captura los valor del "li" de la lista de proyectos que se quiere editar (id,nombre,descripción,imagen)
    const idEdit = listItem.querySelector(".itemListId").textContent;
    const nombreEdit = listItem.querySelector(".itemListNombre").textContent;
    const descripcionEdit = listItem.querySelector(".itemListDescripcion").textContent;
    const imgEdit = listItem.querySelector(".itemListImg").src;

    //recorta el atributo "src" del elemento "img" que contiene la imagen del proyecto (se recorta despues del simbolo = para obtener solo el id de la imagen en google drive, ya que el fomarto es el siguiente: "https://drive.google.com/thumbnail?id=1gClhxS6JnrT6UtBfKF1R2w4ch2KchD_S")
    const idImgEdit= imgEdit.split('=')[1];

    //Se construye una nueva url para consultar las propiedades "type, name" de la imagen en google drive
    const urlRequest = "https://www.googleapis.com/drive/v3/files/"+idImgEdit+"?fields=name,mimeType&key=AIzaSyB-98FDn9xxn2ngaVc3xCbjOowqYJwSl3A";

    //Petición a través del Api Fecth (Se consulta la Url)
    fetch(urlRequest)
    .then(response => {
        //Si la respuesta no es "ok"
        if (!response.ok) {
            //Generar un error con el mensaje:
            throw new Error('La respuesta no fue exitosa');
      }
      //Si no la respuesta es "ok" retorna un json con los datos de la respuesta
      return response.json();
    })
    .then(data => {
        //Luego de obtener la respuest: Construrir el HTML con la sección para actualizar el proyecto
        const htmlContent = `<div class="col-12 d-block hijo">
            <!--titulo-->
            <h1 class="text-light mt-5 mb-5 d-inline-block">Editar proyecto</h1>
            <!--contenedor Paneles-->
            <div class="row d-flex flex-wrap mb-5" id="contenedor-paneles">
                <!--panel formulario-->
                <div class="p-3" id="contenedor-formulario" style="min-height: 475px;">
                    <!--titulo panel-->
                    <span class="fs-5">Request</span>
                    <!--formulario-->
                    <form action="" class="p-3 needs-validation col-12" id="formularioUpdate" novalidate onsubmit="formUpdate(event)">
                        <!--campo id-->
                        <input type="text" name="id" id="idReg" required class="text-secondary mt-2 mb-3" autocomplete="off" value="${idEdit}" hidden>
                        <!--campo nombre-->
                        <input type="text" name="titulo" id="nombreUpdate" required class="text-secondary mt-2 mb-3" autocomplete="off" placeholder="${nombreEdit}">
                        <!--campo descripción-->
                        <textarea name="Descripcion" id="descripcionUpdate" cols="30" rows="3" required class="text-secondary mt-2 mb-3" placeholder="${descripcionEdit}"></textarea>
                        <!--campo img-->
                        <label for="imgUpdate" class="text-secondary form-label">Seleccionar imágen</label>
                        <input type="file" accept="image/*" id="imgUpdate" required class="text-secondary" onchange="changeImgUpdate(this)">
                        <!--botón submit-->
                        <button class="btn btn-outline-secondary col-12 mt-3" type="submit">Guardar</button> 
                    </form>
                    <div class="progress mt-3 border-0 mx-3" id="progress-bar-update">
                        <div class="progress-bar progress-bar-striped bg-secondary progress-bar-animated w-100">
                            Actualizando proyecto...
                        </div>
                    </div>
                </div>
                <!--panel objeto-->
                <div class="p-3" id="contenedor-objeto" style="height: 475px;">
                    <!--titulo panel-->
                    <span class="fs-5">Object</span>
                    <!--campo de visualización del objeto-->
                    <pre class="border-0" style="font-size: 12px; height: 375px;">
                    <code class="language-javascript" id="areaObjetoUpdate">{
                        
   "nombre" : "${nombreEdit}",

   "descripcion" : "${descripcionEdit}",

   "type" : "${data.mimeType}",

   "name" : "${data.name}",

   "base64" : ""
     
}</code>
                    </pre>
                </div>
                <!--panel preview-->
                <div class="p-3" id="contenedor-preiew" style="height: 475px;">
                    <!--titulo panel-->
                    <span class="fs-5">Preview</span>
                    <!--contendedor del preview-->
                    <div class="item-mansory p-2 d-block" id="item-mansory-update">
                        <!--aticulo preview-->
                        <article>
                            <!--img (animación de zoom en el archivo "zoom-proyecto.js")-->
                            <div class="box-img-mansory" onmousemove="zoomIn.call(this,event)" onmouseleave="zoomOut.call(this)">
                                <img src="${imgEdit}" alt="" class="img-proyecto" loading="lazy" id="img-proyecto-update">
                            </div>
                            <!--titulo-->
                            <h2 class="titulo-proyecto mt-3" id="titulo-proyecto-update">${nombreEdit}</h2>   
                            <!--descripción-->         
                            <p class="texto-proyecto" id="descripcion-proyecto-update">${descripcionEdit}</p>
                            <!--opciones github y view-->
                            <div class="d-flex justify-content-end border-0 w-auto">
                                <a class="py-1 px-2 border-0 rounded-2 btn-github text-light"  href="#">Ver GitHub</a>
                                <button class="py-1 px-2 border-0 rounded-2 ms-2 btn-icon"><i class="bi bi-eye text-light"></i></button>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </div>`;
    //Agregar el HTML al final del "li"
    listItem.innerHTML += htmlContent;
    reloadscript();
    })
    .catch(error => {
        //Mensaje de error por consola
        console.error('Hubo un problema con la solicitud:', error);
    });  
}

//Btn cancelar (ocultar sección para actualizar)
function cancelarEditar(btn){
    document.querySelector(".hijo").remove();
    btn.classList.remove("btn-danger","btn-outline-secondary");
    btn.classList.add("btn-outline-secondary");
    btn.textContent="Editar";
    btn.removeAttribute("onclick");
    btn.setAttribute('onclick', 'editar(this)');
}

//Change update img
function changeImgUpdate(img){
    let fr = new FileReader();
    fr.readAsDataURL(img.files[0]);
    fr.onload = function(){
        result = fr.result;
        spt = result.split("base64,")[1];
        console.log(spt);
        document.getElementById("img-proyecto-update").src=result;
    } 
}

function reloadscript(){
   let oldScript = document.getElementById("dynamic-js");

   if (oldScript) {
    document.body.removeChild(oldScript);
    let scriptElementJs = document.createElement('script');
    scriptElementJs.id = 'dynamic-js';
    scriptElementJs.src = 'js/prism-js/prism.js';
    document.body.appendChild(scriptElementJs);
}
    let oldCss = document.getElementById("dynamic-css");

    if (oldCss) {
    document.body.removeChild(oldScript);
    let scriptElementCss = document.createElement('link');
    scriptElementCss.id = 'dynamic-css';
    scriptElementCss.href = 'js/prism-js/prism.css';
    document.body.appendChild(scriptElementCss);
    }
}