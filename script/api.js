import { renderComments } from './renderFn.js'
export let commentsArr = []

export function retryPostFetch(url, options, maxRetries = 3, delay = 1000) {
    return fetch(url, options)
        .then((response) => {
            if (response.status === 500 && maxRetries > 0) {
                console.log(
                    `Ошибка 500 при отправке, повторяем запрос. Осталось попыток: ${maxRetries - 1}`,
                )
                const loader = document.querySelector('#loader-new-comment')
                if (loader) {
                    loader.textContent = 'Повторно отправляем комментарий...'
                    loader.style.display = 'block'
                }
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

function retryFetch(url, options, maxRetries = 3, delay = 1000) {
    return fetch(url, options).then((response) => {
        if (response.status === 500 && maxRetries > 0) {
            console.log(
                `Ошибка 500 при загрузке, повторяем запрос. Осталось попыток: ${maxRetries - 1}`,
            )
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(retryFetch(url, options, maxRetries - 1, delay))
                }, delay)
            })
        }
        return response
    })
}

export function fetchCommentsToServer(token) {
    const loader = document.querySelector('#comments-loader')
    const authToken = token || localStorage.getItem('token')

    const headers = {}
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
    }

    return retryFetch(
        'https://wedev-api.sky.pro/api/v2/anastasiya-veremyova/comments',
        {
            method: 'GET',
            headers,
        },
    )
        .then((response) => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Неверный запрос')
                } else if (response.status === 500) {
                    throw new Error('Сервер сломался, попробуй позже')
                } else {
                    throw new Error('Ошибка загрузки комментариев')
                }
            }
            return response.json()
        })
        .then((data) => {
            commentsArr.length = 0
            commentsArr.push(...data.comments)
            renderComments()
            if (loader) loader.remove()
            return data.comments
        })
        .catch((error) => {
            console.error('Ошибка при загрузке комментариев:', error)

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

            if (loader) loader.remove()
            throw error
        })
}

export function fetchUserData(token) {
    return fetch('https://wedev-api.sky.pro/api/user/login', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        'Ошибка авторизации. Попробуйте войти заново.',
                    )
                } else {
                    throw new Error(
                        `Ошибка получения данных пользователя: ${response.status}`,
                    )
                }
            }
            return response.json()
        })
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Ошибка при получении данных пользователя:', error)
            throw error
        })
}

export function toggleLike(commentId, token) {
    return fetch(
        `https://wedev-api.sky.pro/api/v2/anastasiya-veremyova/comments/${commentId}/toggle-like`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка при лайке')
            }
            return response.json()
        })
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Ошибка при лайке:', error)
            throw error
        })
}
