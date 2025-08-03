import {
    fetchCommentsToServer,
    retryPostFetch,
    toggleLike,
    commentsArr,
} from './api.js'
import { renderComments } from './renderFn.js'
import { escapeHtml } from './escapeHtml.js'

export const loaderForNewComment = document.createElement('div')
loaderForNewComment.id = 'loader-new-comment'
loaderForNewComment.classList.add('loader')
loaderForNewComment.style.display = 'none'

const container = document.querySelector('.container')
const addForm = container.querySelector('.add-form')
container.insertBefore(loaderForNewComment, addForm)

export function addComment() {
    const addFormButton = document.querySelector('.add-form-button')
    const userComment = document.querySelector('.add-form-text')
    const token = localStorage.getItem('token')

    function updateUserName() {
        const userName = document.querySelector('.add-form-span')
        if (localStorage.getItem('userName')) {
            userName.textContent = localStorage.getItem('userName')
        } else {
            userName.textContent = 'Гость'
        }
    }

    updateUserName()

    window.updateUserName = updateUserName

    if (localStorage.getItem('token')) {
        addFormButton.disabled = false
    }

    addFormButton.addEventListener('click', () => {
        const currentToken = localStorage.getItem('token')
        loaderForNewComment.innerHTML = 'Отправляем комментарий...'
        loaderForNewComment.style.display = 'block'
        if (!token) {
            alert('Для добавления комментария необходимо войти')
            loaderForNewComment.style.display = 'none'
            addFormButton.disabled = true
            return
        }

        if (userComment.value.trim() === '') {
            alert('Заполните все поля')
            loaderForNewComment.style.display = 'none'
            return
        }

        const form = document.querySelector('.add-form-button')
        form.disabled = true

        const requestBody = {
            text: escapeHtml(userComment.value),
        }

        retryPostFetch(
            'https://wedev-api.sky.pro/api/v2/anastasiya-veremyova/comments',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
                body: JSON.stringify(requestBody),
            },
        )
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        if (response.status === 400) {
                            try {
                                const error = JSON.parse(text)
                                throw new Error(error.error)
                            } catch {
                                throw new Error('Неверный запрос')
                            }
                        } else if (response.status === 401) {
                            throw new Error(
                                'Ошибка авторизации. Попробуйте войти заново.',
                            )
                        } else {
                            throw new Error(
                                `Ошибка ${response.status}: ${text}`,
                            )
                        }
                    })
                }
                return response.json()
            })
            .then(() => fetchCommentsToServer())
            .then(() => {
                userComment.value = ''
                form.disabled = false
                loaderForNewComment.style.display = 'none'
            })
            .catch((error) => {
                if (error.message === 'Сервер сломался, попробуй позже') {
                    alert('Сервер сломался, попробуй позже')
                } else if (
                    error.name === 'TypeError' &&
                    error.message.includes('fetch')
                ) {
                    alert('Кажется, у вас сломался интернет, попробуйте позже')
                } else {
                    alert(error.message)
                }
                form.disabled = false
                loaderForNewComment.style.display = 'none'
            })
    })
}

export function handleLikeClick(likeButton) {
    return function () {
        const token = localStorage.getItem('token')
        const commentId = likeButton.getAttribute('data-id')

        if (!token) {
            alert('Для лайка необходимо войти')
            return
        }

        likeButton.classList.add('loading')

        if (commentId) {
            const commentObj = commentsArr.find((c) => c.id === commentId)

            toggleLike(commentId, token)
                .then((data) => {
                    if (commentObj && data.result) {
                        commentObj.likes = data.result.likes
                        commentObj.isLiked = data.result.isLiked
                    }
                    if (commentObj.isLiked === true) {
                        likeButton.classList.add('-active-like')
                    } else {
                        likeButton.classList.remove('-active-like')
                    }

                    const likesCounter = likeButton
                        .closest('.likes')
                        .querySelector('.likes-counter')
                    if (likesCounter && commentObj) {
                        likesCounter.textContent = commentObj.likes
                    }
                })
                .catch((error) => {
                    console.error('Ошибка при лайке:', error)
                    alert('Ошибка при лайке: ' + error.message)
                })
                .finally(() => {
                    likeButton.classList.remove('loading')
                })
        }
    }
}

export function handleQuoteClick(commentElement) {
    return function () {
        const userComment = document.querySelector('.add-form-text')
        const author = commentElement.querySelector(
            '.comment-header > div',
        ).textContent
        const text = commentElement.querySelector('.comment-text').textContent
        userComment.value = `"${text}"\n\nКомментарий от: ${author}\n\n`
    }
}

export function handlePopupClose() {
    const popup = document.querySelector('.popup')
    const popupClose = document.querySelector('.popup-close')
    const popupContainer = document.querySelector('.popup-container')

    popupClose.addEventListener('click', () => {
        popup.classList.remove('active')
    })

    popupContainer.addEventListener('click', (event) => {
        if (event.target === popupContainer) {
            popup.classList.remove('active')
        }
    })

    renderComments()
}
export function handlePopupOpen() {
    const popup = document.querySelector('.popup')
    const popupOpen = document.querySelector('.popup-open')
    popupOpen.addEventListener('click', () => {
        popup.classList.add('active')
    })
}
export function autorization() {
    const popup = document.querySelector('.popup')
    const popupFormSignIn = document.querySelector('.popup-form-signIn')
    const popupFormSignUp = document.querySelector('.popup-form-signUp')
    const nameInput = document.getElementById('name')
    const nameLabel = document.getElementById('name-label')
    popupFormSignIn.style.display = 'none'

    function switchToLogin() {
        nameLabel.style.display = 'none'
        nameInput.style.display = 'none'
        popupFormSignUp.style.display = 'none'
        popupFormSignIn.style.display = 'block'
        switchToLoginBtn.style.display = 'none'
        switchToRegisterBtn.style.display = 'block'
    }

    function switchToRegister() {
        nameLabel.style.display = 'block'
        nameInput.style.display = 'block'
        popupFormSignUp.style.display = 'block'
        popupFormSignIn.style.display = 'none'
        switchToLoginBtn.style.display = 'block'
        switchToRegisterBtn.style.display = 'none'
    }

    const popupForm = document.querySelector('.popup-content-form')

    const switchToLoginBtn = document.createElement('button')
    switchToLoginBtn.type = 'button'
    switchToLoginBtn.textContent = 'Уже есть аккаунт? Войти'
    switchToLoginBtn.style.cssText =
        'background: none; border: none; color: #bcec30; cursor: pointer; margin-top: 10px;'
    switchToLoginBtn.addEventListener('click', switchToLogin)
    popupForm.appendChild(switchToLoginBtn)

    const switchToRegisterBtn = document.createElement('button')
    switchToRegisterBtn.type = 'button'
    switchToRegisterBtn.textContent = 'Нет аккаунта? Зарегистрироваться'
    switchToRegisterBtn.style.cssText =
        'background: none; border: none; color: #bcec30; cursor: pointer; margin-top: 10px; display: none;'
    switchToRegisterBtn.addEventListener('click', switchToRegister)
    popupForm.appendChild(switchToRegisterBtn)

    popupFormSignUp.addEventListener('click', () => {
        const UserLogin = document.getElementById('login').value
        const UserPassword = document.getElementById('password').value
        const UserName = nameInput.value
        event.preventDefault()

        if (!UserLogin || !UserPassword || !UserName) {
            alert('Заполните все поля')
            return
        }

        fetch('https://wedev-api.sky.pro/api/user/', {
            method: 'POST',
            body: JSON.stringify({
                login: UserLogin,
                password: UserPassword,
                name: UserName,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(
                            errorData.error || 'Ошибка при регистрации',
                        )
                    })
                }

                const authHeader = response.headers.get('Authorization')
                let token = null

                if (authHeader && authHeader.startsWith('Bearer ')) {
                    token = authHeader.substring(7)
                }

                return response.json().then((data) => {
                    if (!token) {
                        token =
                            data.token || data.accessToken || data.access_token
                    }

                    return { data, token }
                })
            })
            .then(({ data, token }) => {
                localStorage.setItem('token', token)
                localStorage.setItem('userLogin', UserLogin)
                localStorage.setItem('userPassword', UserPassword)

                const userName = data.user?.name || UserName
                localStorage.setItem('userName', userName)

                if (data.user?.id) {
                    localStorage.setItem('id', data.user.id)
                }

                popup.classList.remove('active')
                updateAuthInterface()
                if (window.updateUserName) {
                    window.updateUserName()
                }
                alert('Регистрация прошла успешно!')
            })
            .catch((error) => {
                alert(error.message)
            })
    })

    popupFormSignIn.addEventListener('click', () => {
        const UserLogin = document.getElementById('login').value
        const UserPassword = document.getElementById('password').value
        event.preventDefault()

        if (!UserLogin || !UserPassword) {
            alert('Заполните все поля')
            return
        }
        fetch('https://wedev-api.sky.pro/api/user/login', {
            method: 'POST',
            body: JSON.stringify({
                login: UserLogin,
                password: UserPassword,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.error || 'Ошибка при входе')
                    })
                }

                const authHeader = response.headers.get('Authorization')
                let token = null

                if (authHeader && authHeader.startsWith('Bearer ')) {
                    token = authHeader.substring(7)
                }

                return response.json().then((data) => {
                    if (!token) {
                        token =
                            data.token || data.accessToken || data.access_token
                    }

                    if (!token && data.user) {
                        token =
                            data.user.token ||
                            data.user.accessToken ||
                            data.user.access_token
                    }

                    return { data, token }
                })
            })
            .then(({ data, token }) => {
                console.log('Login result - data:', data)
                console.log('Login result - token:', token)
                localStorage.setItem('token', token)
                localStorage.setItem('userLogin', UserLogin)
                localStorage.setItem('userPassword', UserPassword)

                const userName = data.user?.name || UserLogin
                localStorage.setItem('userName', userName)

                if (data.user?.id) {
                    localStorage.setItem('id', data.user.id)
                }

                popup.classList.remove('active')
                updateAuthInterface()
                if (window.updateUserName) {
                    window.updateUserName()
                }
                alert('Вход выполнен успешно!')
            })
            .catch((error) => {
                alert(error.message)
            })
    })
}
export function logOut() {
    const popupOpenBtn = document.querySelector('.popup-open')
    const helloUser = document.querySelector('.hello-user')
    popupOpenBtn.textContent = 'Войти'
    helloUser.style.display = 'none'
    localStorage.removeItem('token')
    localStorage.removeItem('userLogin')
    localStorage.removeItem('userPassword')
    localStorage.removeItem('userName')
    if (window.updateUserName) {
        window.updateUserName()
    }

    fetchCommentsToServer()
}

export function updateAuthInterface() {
    const popupOpenBtn = document.querySelector('.popup-open')
    const helloUser = document.querySelector('.hello-user')
    const addFormButton = document.querySelector('.add-form-button')

    if (localStorage.getItem('token') !== null) {
        helloUser.textContent = `Привет, ${localStorage.getItem('userName')}!`
        helloUser.style.display = 'block'
        popupOpenBtn.textContent = 'Выйти'
        popupOpenBtn.onclick = logOut

        if (addFormButton) {
            addFormButton.disabled = false
        }

        if (window.updateUserName) {
            window.updateUserName()
        }

        fetchCommentsToServer()
    } else {
        popupOpenBtn.textContent = 'Войти'
        helloUser.style.display = 'none'
        popupOpenBtn.onclick = null
    }
}

export function deleteComment(commentElement) {
    const deleteButton = commentElement.querySelector('.delete-button')
    const authorOfComment = commentElement.querySelector(
        '.comment-header > div',
    ).textContent
    const UserName = localStorage.getItem('userName')
    const token = localStorage.getItem('token')

    console.log('Author of comment:', authorOfComment)
    console.log('Current user:', UserName)

    if (authorOfComment && authorOfComment === UserName && token !== null) {
        deleteButton.style.display = 'block'
        deleteButton.addEventListener('click', () => {
            const commentId = deleteButton.getAttribute('data-id')
            fetch(
                `https://wedev-api.sky.pro/api/v2/anastasiya-veremyova/comments/${commentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
                .then((response) => {
                    if (response.ok) {
                        window.location.reload()
                    } else {
                        alert('Ошибка при удалении комментария')
                    }
                })
                .catch((error) => {
                    console.error('Error:', error)
                    alert('Ошибка при удалении комментария')
                })
        })
    } else {
        deleteButton.style.display = 'none'
    }
}
