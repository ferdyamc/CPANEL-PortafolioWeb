
let img; //variable para almacenar la imagen especifica de las colecciones.


function zoomIn(event){ //evento mousemove

    contenedor = this; //capturar el elemento contenedor especifico
    img = this.querySelector('img'); //capturar la imagen especifica (imagen hija del contenedor)

    let rect = contenedor.getBoundingClientRect(); //obtener un objeto con las cordenadas del elemento contenedor
    let clientX = event.clientX - rect.left; //obtener la posicion del cursor con base en la coordenada x 
    let clientY = event.clientY - rect.top; //obtener la posicion del cursor con base en la coordenada y 

    let mWidth = this.offsetWidth //obtner el ancho del elemento (contenedor)
    let mHeight = this.offsetHeight //obtner el alto del elemento (contenedor)

    clientX = clientX / mWidth * 100 //recalcula la posicion horizontal del cursor en porcentaje con respecto al ancho total del elemento
    clientY = clientY / mHeight * 100 //recalcula la posicion vertical del cursor en porcentaje con respecto al alto total del elemento

    img.style.transform = `translate(-${clientX}%, -${clientY}%) scale(2)`; //cambia la escala y la posicion de la imagen de acuerdo a los porcentajes de ancho y alto

};
function zoomOut(){ //evento mouseleave

    contenedor = this; //capturar el elemento contenedor especifico
    img = this.querySelector('img'); //capturar la imagen especifica (imagen hija del contenedor)
    img.style.transform = 'translate(-50%,-50%) scale(1)'; //reestablece la escala y la posicion original de la imagen

};