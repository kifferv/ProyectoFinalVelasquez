
let carrito = [];
let total = 0;

//REFERENCIAS A LOS ELEMENTOS DEL DOM
const formularioIdentificacion = document.getElementById('formularioIdentificacion');
const inputUsuario = document.getElementById("inputUsuario");
const contenedorIdentificacion = document.getElementById("contenedorIdentificacion");
const contenedorUsuario = document.getElementById("contenedorUsuario");
const textoUsuario = document.getElementById("textoUsuario");

//FORMULARIO PARA INGRESO DE NOMBRE DE USUARIO
async function identificarUsuario(event) {
    event.preventDefault();
    usuario = inputUsuario.value;
    formularioIdentificacion.reset();
    actualizarUsuarioStorage();
    mostrarTextoUsuario();

//TOASTIFY
const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
    popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true})
    await Toast.fire({
    icon: 'success',
    title: 'Identificación exitosa!'
    })
}

function mostrarTextoUsuario() {
    // Verificar que el elemento exista antes de manipularlo
    if (contenedorIdentificacion && contenedorUsuario && textoUsuario) {
        contenedorIdentificacion.hidden = true;
        contenedorUsuario.hidden = false;
        textoUsuario.innerHTML += ` ${usuario}`;
    } else {
        console.error("Alguno de los elementos no se encuentra en el DOM.");
    }
}

function mostrarFormularioIdentificacion() {
    contenedorIdentificacion.hidden = false;
    contenedorUsuario.hidden = true;
    textoUsuario.innerHTML = ``;
}

//ACTUALIZAR EL ALMACENAMIENTO LOCAL CON NOMBRE DEL USUARIO
function actualizarUsuarioStorage() {
localStorage.setItem("usuario", usuario);
}

document.addEventListener("DOMContentLoaded", () => {
//APUNTANDO A ELEMENTOS HTML
const productosCarrito = document.querySelector(".productos-carrito");
const totalCarrito = document.querySelector(".total-carrito");
const botonLimpiarCarrito = document.querySelector(".limpiar-carrito");

//ENVÍO DE LA INFORMACIÓN DEL FORMULARIO DE IDENTIFICACIÓN
formularioIdentificacion.onsubmit = (event) => identificarUsuario(event);
botonLimpiarCarrito.addEventListener("click", limpiarCarrito);

window.onload = function() {

//CARGAR LOS DATOS CARRITO DESDE EL LOCALSTORAGE
const articulosCarritoStock = localStorage.getItem('productosCarrito');
const articulosCarritoTotalStock = localStorage.getItem('totalCarrito');

if (articulosCarritoStock) {
    carrito = JSON.parse(articulosCarritoStock);
    total = parseFloat(articulosCarritoTotalStock);
    mostrarCarrito();
}
};

function mostrarCarrito() {

//VACIAR CARRITO
productosCarrito.innerHTML = "";

const cantidades = {};

//ACTUALIZAR LAS CANTIDADES DE CADA PRODUCTO EN EL OBJETO
carrito.forEach(producto => {
    if (producto.nombre in cantidades) {
        cantidades[producto.nombre]++;
    } else {
        cantidades[producto.nombre] = 1;
    }
});

//CREAR UN ELEMENTO LI PARA CADA PRODUCTO EN EL OBJETO Y AGREGARLO AL CARRITO
for (const nombreProducto in cantidades) {
    const cantidad = cantidades[nombreProducto];
    const precio = productos.find(producto => producto.nombre === nombreProducto).precio;
    const li = document.createElement("li");

//BOTÓN PARA RESTAR PRODUCTOS DEL CARRO
    const btnReduce = document.createElement("button");
    btnReduce.textContent = "-";
    btnReduce.addEventListener("click", () => {
    const index = carrito.findIndex(p => p.nombre === nombreProducto);
    carrito.splice(index, 1);
    total -= precio;
    mostrarCarrito();
    });

//BOTÓN PARA SUMAR PRODUCTOS DEL CARRO
    const btnIncrease = document.createElement("button");
    btnIncrease.textContent = "+";
    btnIncrease.addEventListener("click", () => {
    carrito.push(productos.find(p => p.nombre === nombreProducto));
    total += precio;
    mostrarCarrito();
    });

li.innerText = `${cantidad} x ${nombreProducto} - $${(cantidad * precio).toFixed(2)}`;
li.appendChild(btnReduce);
li.appendChild(btnIncrease);
productosCarrito.appendChild(li);
}

//ACTUALIZA EL TOTAL
totalCarrito.innerText = `$${total.toFixed(0)}`;

//MANDAR INFORMACION AL LOCALSTORAGE
localStorage.setItem('productosCarrito', JSON.stringify(carrito));
localStorage.setItem('totalCarrito', total.toFixed(0));
}

function agregarProductoCarrito(id) {

const producto = productos.find(producto => producto.id === id);

//AGREGADO DE ITEMS AL CARRO DE COMPRAS
carrito.push(producto);

localStorage.setItem('productosCarrito', JSON.stringify(carrito));
localStorage.setItem('totalCarrito', total.toFixed(0));

total += producto.precio;

//MOSTRAR PRODUCTOS DEL CARRO DE COMPRAS
mostrarCarrito();
}

//LIMPIAR EL CARRO DE COMPRAS
function limpiarCarrito() {

//VACIA Y ACTUALIZA EL TOTAL DE CARRO DE COMRPAS A 0
carrito = [];
total = 0;

mostrarCarrito();

localStorage.removeItem('productosCarrito');
localStorage.removeItem('totalCarrito');
}

//EVENT LISTENERS AL BOTÓN AGREGAR Y LIMPIAR PRODUCTO 
const botonAgregarAlCarrito = document.querySelectorAll(".agregar-carrito");
botonAgregarAlCarrito.forEach(boton => {
boton.addEventListener("click", event => {
    const id = parseInt(event.target.dataset.id);
    agregarProductoCarrito(id);
});
});

//VINCULAR EL BOTÓN DE FINALIZAR COMPRA CON EL HTML
const finalizarCompraBoton = document.querySelector('.finalizar_compra');

//EVENT LISTENER AL BOTÓN DE FINALIZAR COMPRA
finalizarCompraBoton.addEventListener('click', function() {

//MUESTRA UN TOTAL DE COMPRA
const total = document.querySelector('.total-carrito').textContent;

const mensajeConfirmacion = `El total de su pedido es de ${total}.`;
//SWEET ALERT
Swal.fire({
    title: '¡Muchas gracias por su compra!',
    text: mensajeConfirmacion,
    icon: 'success'
});

//RESETEAR EL CARRITO
const productosCarrito = document.querySelector('.productos-carrito');
productosCarrito.innerHTML = '';
document.querySelector('.total-carrito').textContent = '$0';
});

//FETCH PARA BUSCAR LOS PRODUCTOS DE UNA API
fetch("https://64bda5312320b36433c7cbb1.mockapi.io/codercarData")
.then((response) => response.json())
.then((jsonResponse) => {
    productos.push(...jsonResponse);
    mostrarCarrito();
});
});
