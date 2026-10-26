const gridContainer = document.getElementById('catalog-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderProducts(itemsToRender) {

    gridContainer.innerHTML = '';

    itemsToRender.forEach(item => {

        const precioFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(item.price);

        const card = document.createElement('article');
        card.classList.add('product-card');

        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.title;
        image.loading = 'lazy';

        const title = document.createElement('h3');
        title.textContent = item.title;

        const description = document.createElement('p');
        description.textContent = item.description;

        const price = document.createElement('p');
        price.classList.add('product-price');
        price.textContent = precioFormateado;

        const reserveButton = document.createElement('button');
        reserveButton.type = 'button';
        reserveButton.classList.add('card-btn');
        reserveButton.textContent = 'Lo quiero';
        reserveButton.setAttribute('aria-label', `Solicitar ${item.title}`);
        reserveButton.addEventListener('click', () => {
            const itemInput = document.getElementById('item');
            itemInput.value = item.title;
            const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            document.getElementById('booking').scrollIntoView({ behavior: motionPreference ? 'auto' : 'smooth' });
            itemInput.focus({ preventScroll: true });
        });

        card.append(image, title, description, price, reserveButton);

        gridContainer.appendChild(card);
    }); 
}

renderProducts(products);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => {
            const isActive = btn === button;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        const category = button.dataset.category;

        if (category === 'Todos') {
            renderProducts(products); 
        } else {
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts);
        }
    });
});

const form = document.getElementById('reservation-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const itemInput = document.getElementById('item');

function setFieldError(input, message) {
    const error = document.getElementById(`${input.id}-error`);
    error.textContent = message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
}

[nameInput, emailInput, itemInput].forEach(input => {
    input.addEventListener('input', () => setFieldError(input, ''));
});

form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    let isValid = true;
    let firstInvalidInput = null;

    [nameInput, emailInput, itemInput].forEach(input => setFieldError(input, ''));

    if (nameInput.value.trim().length < 3) {
        setFieldError(nameInput, 'Ingresa un nombre de al menos 3 caracteres.');
        isValid = false;
        firstInvalidInput ??= nameInput;
    }

    if (emailInput.value.trim() === '') {
        setFieldError(emailInput, 'El correo electrónico es obligatorio.');
        isValid = false;
        firstInvalidInput ??= emailInput;
    } else if (!emailInput.validity.valid) {
        setFieldError(emailInput, 'Ingresa un correo válido.');
        isValid = false;
        firstInvalidInput ??= emailInput;
    }

    if (itemInput.value.trim().length < 3) {
        setFieldError(itemInput, 'Indica qué equipo o vinilo buscas (mínimo 3 caracteres).');
        isValid = false;
        firstInvalidInput ??= itemInput;
    }

    if (!isValid) {
        firstInvalidInput.focus();
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    })
    .then(data => {
        if (!data.success) throw new Error('Submission failed');
        showToast('¡Solicitud enviada! Revisa tu correo.');
        form.reset();
        [nameInput, emailInput, itemInput].forEach(input => input.setAttribute('aria-invalid', 'false'));
    })
    .catch(() => {
        showToast('No fue posible enviar la solicitud. Intenta de nuevo.');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

const themeToggleBtn = document.getElementById('theme-toggle');
let currentTheme = null;

try {
    currentTheme = localStorage.getItem('theme');
} catch {
    // The theme still works for this page view when storage is unavailable.
}

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = 'Modo Claro';
    themeToggleBtn.setAttribute('aria-pressed', 'true');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggleBtn.setAttribute('aria-pressed', String(isDarkMode));

    themeToggleBtn.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
    try {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch {
        // Keep the selected theme for this page view when storage is unavailable.
    }
});

function showToast(mensaje) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = mensaje;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
