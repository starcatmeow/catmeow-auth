export const getJWTPayload = (jwt) => {
    const payloadbase64 = jwt.split('.')[1]
    const payload = JSON.parse(window.atob(payloadbase64))
    return payload
}
export const isAuthenticated = () => {
    try{
        const token = localStorage.getItem('token')
        if(token == null)
            return false
        if(getJWTPayload(token).exp<Date.now()/1000)
            return false
    }catch{
        return false
    }
    return true
}