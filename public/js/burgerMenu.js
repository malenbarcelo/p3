// Burger Menu Controller
document.addEventListener('DOMContentLoaded', function() {
    const burgerIcon = document.querySelector('.burger-menu-icon');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (!burgerIcon || !sidebarMenu || !sidebarOverlay) return;

    // Función para abrir el menú
    function openMenu() {
        sidebarMenu.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    // Función para cerrar el menú
    function closeMenu() {
        sidebarMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // Abrir menú al hacer hover en el burger icon
    burgerIcon.addEventListener('mouseenter', openMenu);

    // Mantener abierto cuando el mouse está sobre el menú
    sidebarMenu.addEventListener('mouseenter', function() {
        sidebarMenu.classList.add('active');
        sidebarOverlay.classList.add('active');
    });

    // Cerrar cuando el mouse sale del menú
    sidebarMenu.addEventListener('mouseleave', closeMenu);

    // Cerrar al hacer click en el overlay
    sidebarOverlay.addEventListener('click', closeMenu);

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebarMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});
