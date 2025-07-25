import { escapeHtml } from './escapeHtml.js'
import { fetchCommentsToServer } from './comments.js'

const loaderForNewComment = document.createElement('div')
loaderForNewComment.id = 'loader-new-comment'
loaderForNewComment.classList.add('loader')
loaderForNewComment.style.display = 'none'

const container = document.querySelector('.container')
const addForm = container.querySelector('.add-form')
container.insertBefore(loaderForNewComment, addForm)

export function addComment() {
    const addFormButton = document.querySelector('.add-form-button')
    const userName = document.querySelector('.add-form-name')
    const userComment = document.querySelector('.add-form-text')

    addFormButton.addEventListener('click', () => {
        loaderForNewComment.innerHTML = 'Отправляем комментарий...'
        loaderForNewComment.style.display = 'block'
        if (userName.value.trim() === '' || userComment.value.trim() === '') {
            alert('Заполните все поля')
            loaderForNewComment.style.display = 'none'
            return
        }

        const form = document.querySelector('.add-form-button')
        form.disabled = true

        retryPostFetch(
            'https://wedev-api.sky.pro/api/v1/anastasiya-veremyova/comments',
            {
                method: 'POST',
                body: JSON.stringify({
                    text: escapeHtml(userComment.value),
                    name: escapeHtml(userName.value),
                    forceError: true,
                }),
            },
        )
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 400) {
                        return response.json().then((error) => {
                            throw new Error(error.error)
                        })
                    } else {
                        throw new Error('Ошибка при добавлении комментария')
                    }
                }
                return response.json()
            })
            .then(() => fetchCommentsToServer())
            .then(() => {
                userName.value = ''
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

function retryPostFetch(url, options, maxRetries = 3, delay = 1000) {
    return fetch(url, options)
        .then((response) => {
            if (response.status === 500 && maxRetries > 0) {
                console.log(
                    `Ошибка 500 при отправке, повторяем запрос. Осталось попыток: ${maxRetries - 1}`,
                )
                loaderForNewComment.textContent =
                    'Повторно отправляем комментарий...'
                loaderForNewComment.style.display = 'block'
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(
                            retryPostFetch(url, options, maxRetries - 1, delay),
                        )
                    }, delay)
                })
            }
            if (response.status === 500) {
                throw new Error('Сервер сломался, попробуй позже')
            }
            return response
        })
        .catch((error) => {
            throw error
        })
}
