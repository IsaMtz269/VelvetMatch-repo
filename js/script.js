$(document).ready(function() {
 
    // 1. Envío del formulario de LOGIN
    $('#loginForm').on('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue
        var formData = $(this).serialize(); // Recolecta los datos
        
        $.ajax({
            type: 'POST',
            url: 'Login.php', 
            data: formData, 
            dataType: 'json', 
            success: function(response) {
                if (response.success) {
                    // ¡Esta es la lógica que querías!
                    // Recarga la página actual (sea Mundiales o Publicaciones)
                    window.location.reload();
                } else {
                    // Muestra el error en el modal, sin recargar
                    $('#login-error').text('Usuario o contraseña incorrectos.').removeClass('d-none');
                }
            },
            error: function() {
                // Error de conexión o del servidor
                $('#login-error').text('Error al conectar. Intenta de nuevo.').removeClass('d-none');
            }
        });
    });
});