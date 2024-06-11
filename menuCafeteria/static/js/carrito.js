const modal_carrito = document.getElementById("modalCarrito");
const modalFormulario = document.getElementById("modal-formulario");

async function obtenerNumeroOrdenes() {
  try {
    const response = await fetch("/obtenerNumeroOrden/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify("pedido de numeros"),
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el numero");
    }

    const data = await response.json();
    console.log("Datos recibidos:", data); // Debugging: Verificar si los datos se reciben correctamente

    if (Array.isArray(data.numeros)) {
      const numerosExistentes = data.numeros;
      const nuevoNumero = generarNumeroUnico(numerosExistentes);
      console.log("Nuevo número de orden:", nuevoNumero);
      return nuevoNumero; // Retornar el nuevo número de orden
    } else {
      console.error(
        "La respuesta del servidor no contiene un array de números:",
        data
      );
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function generarNumeroUnico(numerosExistentes) {
  let nuevoNumero;
  do {
    nuevoNumero = Math.floor(Math.random() * 1000000).toString(); // Genera un número aleatorio de 6 dígitos
  } while (numerosExistentes.includes(nuevoNumero));
  return nuevoNumero;
}

function agregarAlCarrito(
  productoId,
  productoNombre,
  productoPrecio,
  productoCantidad
) {
  // Obtener el carrito del localStorage o crear uno nuevo si no existe
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificar si el producto ya está en el carrito
  let productoExistente = carrito.find((item) => item.id === productoId);

  if (productoExistente) {
    var cantidad = productoExistente.cantidad;

    if (cantidad >= productoCantidad) {
      alert("Cantidad máxima alcanzada");
    } else {
      productoExistente.cantidad += 1;
      alert("Producto agregado al carrito");
      console.log(productoCantidad);
      console.log(carrito);
    }
  } else {
    // Agregar el producto al carrito
    carrito.push({
      id: productoId,
      nombre: productoNombre,
      precio: productoPrecio,
      cantidad: 1,
      cantidadMaxima: productoCantidad,
    });
    alert("Producto agregado al carrito");
    console.log("Producto agregado");
    console.log(carrito);
  }

  // Guardar el carrito en localStorage después de agregar o actualizar un producto
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Emitir un evento personalizado para actualizar la vista del carrito
  const event = new Event("productoAgregado");
  document.dispatchEvent(event);
}

// Función para mostrar el carrito
function mostrarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificar si el carrito está vacío
  if (carrito.length === 0) {
    const carritoElement = document.getElementById("cuerpo-carrito");
    carritoElement.innerHTML = "<p>El carrito está vacío</p>";
    const precioTotalElement = document.getElementById("precio-total");
    precioTotalElement.value = "0.00";
    modal_carrito.style.display = "block";
    return;
  }

  // Generar el HTML para mostrar los productos en el carrito
  let carritoHtml = "";
  let precioTotal = 0;
  const carritoElement = document.getElementById("cuerpo-carrito");

  carrito.forEach((item) => {
    const precioSubTotal = item.precio * item.cantidad;
    carritoHtml += `
        <tr>
          <td>${item.nombre}</td>
          <td>
            <button class="btn-quantity" onclick="cambiarCantidad(${
              item.id
            }, -1, -1)" ${item.cantidad <= 1 ? "disabled" : ""}>-</button>
            ${item.cantidad}
            <button class="btn-quantity" onclick="cambiarCantidad(${
              item.id
            }, 1, 1)">+</button>
          </td>
          <td>$${item.precio.toFixed(2)}</td>
          <td>$${precioSubTotal.toFixed(2)}</td>
          <td><button class="btn-delete" onclick="eliminarItem(${
            item.id
          })">Eliminar</button></td>
        </tr>
      `;
    precioTotal += precioSubTotal;
  });

  // Actualizar el contenido del carrito en el DOM
  carritoElement.innerHTML = carritoHtml;

  // Actualizar el precio total en el DOM
  const precioTotalElement = document.getElementById("precio-total");
  precioTotalElement.value = precioTotal.toFixed(2);

  modal_carrito.style.display = "block";
}

// Función para cerrar el modal del carrito
function cerrarModalCarrito() {
  modal_carrito.style.display = "none";
}

// Event listener para cerrar el modal del carrito al hacer clic en el botón de cerrar
const closeButton = document.querySelector(".close");
if (closeButton) {
  closeButton.addEventListener("click", cerrarModalCarrito);
}

// Event listener para mostrar el carrito al hacer clic en la imagen del carrito
const carritoImagen = document.querySelector(".carrito-icon img");
if (carritoImagen) {
  carritoImagen.addEventListener("click", mostrarCarrito);
}

function cambiarCantidad(productoId, delta) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let productoExistente = carrito.find((item) => item.id === productoId);

  if (productoExistente) {
    if (
      productoExistente.cantidad + delta <= productoExistente.cantidadMaxima &&
      productoExistente.cantidad + delta >= 1
    ) {
      productoExistente.cantidad += delta;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
    } else if (
      productoExistente.cantidad + delta >
      productoExistente.cantidadMaxima
    ) {
      alert("¡Cantidad límite alcanzada!");
    }
  }
}

function eliminarItem(productoId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let indice = carrito.findIndex((item) => item.id === productoId);

  if (indice !== -1) {
    carrito.splice(indice, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito(); // Actualizar el modal del carrito después de eliminar un elemento
  }
}
function mostrarModalFormulario() {
  modal_carrito.style.display = "none";
  modalFormulario.style.display = "block";
}

function cerrarModal() {
  modalFormulario.style.display = "none";
}

function obtenerDatosFormulario() {
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  nuevaOrden(nombre, correo);
}

async function nuevaOrden(nombre, correo) {
  // Generar un nuevo número de orden único
  const numeroOrden = await obtenerNumeroOrdenes(); // Usar await para esperar la respuesta
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  modalFormulario.style.display = "none";
  console.log(nombre, correo);

  // // Crear una nueva orden vacía en el localStorage
  const nuevaOrden = {
    detalles: carrito,
    numero: numeroOrden,
    nombre: nombre,
    correo: correo,
  };

  console.log(nuevaOrden);

  console.log("Datos que se enviarán al servidor:", carrito);

  fetch("http://127.0.0.1:8000/obtenerOrdenes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"), // Añadir el token CSRF para la seguridad
    },
    body: JSON.stringify(nuevaOrden),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Orden guardada:", data);
      alert("Orden realizada con éxito.");
      alert("Se puede acercar a caja, su número del pedido es: " + numeroOrden);
      localStorage.removeItem("carrito");
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  console.log(nuevaOrden);
  console.log(numeroOrden);
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
