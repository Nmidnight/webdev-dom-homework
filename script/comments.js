import { renderComments } from './renderFn.js'

export let commentsArr = []

export function fetchCommentsToServer() {
    const loader = document.querySelector('.loader')
    return fetch(
        'https://wedev-api.sky.pro/api/v1/anastasiya-veremyova/comments',
        {
            method: 'GET',
        },
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки комментариев')
            }
            return response.json()
        })
        .then((data) => {
            commentsArr.length = 0
            commentsArr.push(...data.comments)
            renderComments()
            loader.remove()
            return data.comments
        })
        .catch((error) => {
            console.error('Ошибка при загрузке комментариев:', error)
            throw error
        })
}
