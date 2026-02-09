// Variable global para almacenar los datos cargados
let datosCargados = [];

// Función para cargar datos con AJAX (XMLHttpRequest)
function cargarDatosAjax() {
    const resultadoDiv = document.getElementById('resultado-ajax');
    const datosContainer = document.getElementById('datos-container');
    
    // Limpiar resultados anteriores
    resultadoDiv.innerHTML = '<div class="loading">Cargando datos con AJAX</div>';
    resultadoDiv.className = 'resultado visible';
    datosContainer.innerHTML = '';
    
    var xhr = new XMLHttpRequest();
    var requestUrl = "https://api.restful-api.dev/objects";
    
    xhr.open("GET", requestUrl, true);
    
    xhr.onloadstart = function() {
        resultadoDiv.innerHTML = '<div class="loading">Cargando datos con AJAX</div>';
    };
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                datosCargados = JSON.parse(xhr.responseText);
                mostrarResultadoAjax(datosCargados.length + " productos cargados exitosamente con AJAX (XMLHttpRequest)");
                mostrarDatos(datosCargados);
            } catch (error) {
                mostrarErrorAjax("Error al procesar los datos JSON");
            }
        } else {
            mostrarErrorAjax("Error en la petición: " + xhr.status);
        }
    };
    
    xhr.onerror = function() {
        mostrarErrorAjax("Error de conexión con AJAX");
    };
    
    xhr.send();
}

// Función para cargar datos con Fetch API (más moderno)
function cargarDatosFetch() {
    const resultadoDiv = document.getElementById('resultado-ajax');
    const datosContainer = document.getElementById('datos-container');
    
    resultadoDiv.innerHTML = '<div class="loading">Cargando datos con Fetch API</div>';
    resultadoDiv.className = 'resultado visible';
    datosContainer.innerHTML = '';
    
    fetch("https://api.restful-api.dev/objects")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            datosCargados = data;
            mostrarResultadoAjax(data.length + " productos cargados exitosamente con Fetch API");
            mostrarDatos(data);
        })
        .catch(error => {
            mostrarErrorAjax("Error con Fetch: " + error.message);
        });
}

// Función para mostrar resultado exitoso de AJAX
function mostrarResultadoAjax(mensaje) {
    const resultadoDiv = document.getElementById('resultado-ajax');
    resultadoDiv.innerHTML = `<div class="info">✅ ${mensaje}</div>`;
}

// Función para mostrar error de AJAX
function mostrarErrorAjax(mensaje) {
    const resultadoDiv = document.getElementById('resultado-ajax');
    resultadoDiv.innerHTML = `<div class="error">❌ ${mensaje}</div>`;
}

// Función para mostrar los datos en la página
function mostrarDatos(datos) {
    const datosContainer = document.getElementById('datos-container');
    
    if (!datos || datos.length === 0) {
        datosContainer.innerHTML = '<div class="error">No hay datos para mostrar</div>';
        return;
    }
    
    let html = '';
    datos.forEach(producto => {
        html += `
            <div class="producto-card">
                <h3>${producto.name || 'Sin nombre'}</h3>
                <div class="id">ID: ${producto.id}</div>
                <div class="datos">
                    ${producto.data ? 
                        Object.entries(producto.data).map(([key, value]) => 
                            `<div class="dato-item">
                                <strong>${key}:</strong>
                                <span>${value}</span>
                            </div>`
                        ).join('') 
                        : '<em>Sin datos adicionales</em>'
                    }
                </div>
            </div>
        `;
    });
    
    datosContainer.innerHTML = html;
}

// Manejar el formulario antiguo (simulación)
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('form-antiguo');
    const resultadoForm = document.getElementById('resultado-formulario');
    
    // Verificar si hay parámetros en la URL (como lo haría un formulario antiguo)
    const urlParams = new URLSearchParams(window.location.search);
    const accion = urlParams.get('accion');
    
    if (accion === 'cargarDatos') {
        // Simular el comportamiento de un formulario antiguo
        resultadoForm.innerHTML = '<div class="loading">Cargando datos con Formulario...</div>';
        resultadoForm.className = 'resultado visible';
        
        // Simular una recarga de página con datos
        setTimeout(() => {
            // En un formulario real, esto vendría del servidor
            // Pero para el ejemplo, usamos la misma API
            fetch("https://api.restful-api.dev/objects")
                .then(response => response.json())
                .then(data => {
                    datosCargados = data;
                    resultadoForm.innerHTML = `<div class="info">✅ ${data.length} productos cargados con Formulario (página recargada)</div>`;
                    mostrarDatos(data);
                    
                    // Limpiar la URL para no recargar al refrescar
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(error => {
                    resultadoForm.innerHTML = `<div class="error">❌ Error con formulario: ${error.message}</div>`;
                });
        }, 1000);
    }
    
    // Prevenir envío real del formulario (para evitar recarga)
    formulario.addEventListener('submit', function(event) {
        event.preventDefault();
        
        resultadoForm.innerHTML = '<div class="loading">Enviando formulario (método antiguo)...</div>';
        resultadoForm.className = 'resultado visible';
        
        // Simular el comportamiento antiguo con redirección
        setTimeout(() => {
            // Agregar parámetro a la URL (simulando envío GET)
            const nuevaUrl = window.location.pathname + '?accion=cargarDatos';
            window.location.href = nuevaUrl;
        }, 500);
    });
});

// Función para comparar ambos métodos
function compararMetodos() {
    const comparacion = `
        <div class="info">
            <h4>Comparación de Métodos:</h4>
            <p><strong>AJAX/Fetch (Moderno):</strong></p>
            <ul>
                <li>No recarga la página</li>
                <li>Más rápido y fluido</li>
                <li>Permite actualizar partes específicas de la página</li>
                <li>Mejor experiencia de usuario</li>
            </ul>
            <p><strong>Formulario Antiguo:</strong></p>
            <ul>
                <li>Recarga toda la página</li>
                <li>Más simple de implementar</li>
                <li>Funciona sin JavaScript</li>
                <li>Mayor compatibilidad con navegadores antiguos</li>
            </ul>
        </div>
    `;
    
    const resultadoAjax = document.getElementById('resultado-ajax');
    resultadoAjax.innerHTML = comparacion;
    resultadoAjax.className = 'resultado visible';
}

// Agregar botón de comparación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const seccionAjax = document.querySelector('.section');
    const botonComparar = document.createElement('button');
    botonComparar.textContent = 'Comparar Métodos';
    botonComparar.onclick = compararMetodos;
    botonComparar.style.backgroundColor = '#FF9800';
    botonComparar.style.marginLeft = '10px';
    
    botonComparar.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#F57C00';
    });
    
    botonComparar.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#FF9800';
    });
    
    seccionAjax.appendChild(botonComparar);
});