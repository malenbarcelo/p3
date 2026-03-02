// Manejo de color para inputs de fecha
document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('input[type="date"].input-std');
    
    dateInputs.forEach(input => {
        // Función para actualizar la clase
        function updateClass() {
            if (input.value && input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        }
        
        // Actualizar al cargar
        updateClass();
        
        // Actualizar al cambiar
        input.addEventListener('change', updateClass);
        input.addEventListener('input', updateClass);
        input.addEventListener('blur', updateClass);
        input.addEventListener('focus', updateClass);
        
        // Observer para detectar cambios programáticos en atributos
        const observer = new MutationObserver(updateClass);
        observer.observe(input, { 
            attributes: true, 
            attributeFilter: ['value'] 
        });
        
        // Polling más agresivo para detectar cambios programáticos en la propiedad value
        let oldValue = input.value;
        setInterval(() => {
            const currentValue = input.value;
            if (currentValue !== oldValue) {
                oldValue = currentValue;
                updateClass();
            }
        }, 50); // Reducido a 50ms para mayor responsividad
    });
});
