const regex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/

export default (email) => regex.test(email)
