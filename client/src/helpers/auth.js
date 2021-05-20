import cookie from 'js-cookie'

// Set in Cookie
export const setCookie = (key, value) => {
    if (window !== 'undefiend') {
        cookie.set(key, value, {
            // 1 Day
            expires: 1
        }) 
    }
}

// remove from cookie
export const removeCookie = key => {
    if (window !== 'undefined') {
        cookie.remove(key, {
            expires: 1
        });
    }
};

// Get token from cookie
// send token when making request to server
export const getCookie = key => {
    if (window !== 'undefined') {
        return cookie.get(key);
    }
};

// Set user info in localstorage, keep it for 7 days
export const setLocalStorage = (key, value) => {
    if (window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Remove from localstorage
export const removeLocalStorage = key => {
    if (window !== 'undefined') {
        localStorage.removeItem(key);
    }
};

// Set user info in sessionStorage, keep it for only connection
export const setSessionStorage = (key, value) => {
    if (window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
};


// Set cookie and localstorage during signin
export const authenticate = (response, remember, next) => {
    console.log('AUTHENTICATE HELPER ON SIGNIN', response, remember);
    setCookie('token', response.data.token);
    if (remember) {
        setLocalStorage('user', response.data.user);
    } else {
        setSessionStorage('user', response.data.user);
    }

    next();
};

// Access user info from localstorage
// {"_id":"609473f80fb074245822e1d7","email":"lugepei1993@gmail.com","name":"Frank LU","subscriptionExpired":true}
export const isAuth = () => {
    if (window !== 'undefined') {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else if (sessionStorage.getItem('user')) {
                return JSON.parse(sessionStorage.getItem('user'));
            } else {
                return false;
            }
        }
    }
};

// clear localStorage and cookie when signout
export const signout = next => {
    removeCookie('token');
    removeLocalStorage('user');
    next();
};

// update localStorage when update user info
export const updateUser = (response, next) => {
    console.log('UPDATE USER IN LOCALSTORAGE', response);
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('user')) {
            let auth = JSON.parse(localStorage.getItem('user'));
            auth = response.data;
            localStorage.setItem('user', JSON.stringify(auth));
        } else {
            let auth = JSON.parse(sessionStorage.getItem('user'));
            auth = response.data;
            sessionStorage.setItem('user', JSON.stringify(auth));
        }
    }
    next();
};
