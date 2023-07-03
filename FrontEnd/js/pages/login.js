const loginForm = document.querySelector('form')
const inputEmail = document.getElementById('email')
const inputPassword = document.getElementById('password')
const submitButton = document.getElementById('connexion')
const errorContainer = document.getElementById('error-container')

loginForm.addEventListener('submit', (event) => {
    event.preventDefault() 

    let data = {
        email: inputEmail.value,
        password: inputPassword.value,
    }

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error("Email ou mot de passe incorrect")
            }
        })
        .then(response => {
            localStorage.setItem('token', response.token)
            location.href = 'index.html'
        })

        .catch(error => {
            errorContainer.textContent = "Email ou mot de passe incorrect"
            errorContainer.style.color = "red"
            console.error('Email ou mot de passe incorrect', error)
        })
})