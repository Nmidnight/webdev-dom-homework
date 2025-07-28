import { renderComments } from './renderFn.js'

export let commentsArr = []

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

export function fetchCommentsToServer() {
    const loader = document.querySelector('#comments-loader')
    return retryFetch(
        'https://wedev-api.sky.pro/api/v1/anastasiya-veremyova/comments',
        {
            method: 'GET',
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
