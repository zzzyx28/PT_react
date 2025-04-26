export function getStoredUser() {
    return JSON.parse(localStorage.getItem('fakeUser'))
  }
  
  export function saveUser(user) {
    localStorage.setItem('fakeUser', JSON.stringify(user))
  }
  
  export function clearUser() {
    localStorage.removeItem('fakeUser')
  }
  
  export function isLoggedIn() {
    return !!getStoredUser()
  }
  