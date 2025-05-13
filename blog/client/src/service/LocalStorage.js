class LocalStorageService {

    // Method to set an item in localStorage with expiry
    static setItem(key, value, expiryInMinutes = null) {
        try {
            const data = {
                value,
                expiry: expiryInMinutes ? Date.now() + expiryInMinutes * 60000 : null
            };
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving to localStorage", error);
        }
    }

    // Method to get an item from localStorage
    static getItem(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const data = JSON.parse(item);
            if (data.expiry && Date.now() > data.expiry) {
                this.removeItem(key); // Remove expired item
                return null;
            }
            return data.value;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return null;
        }
    }

    // Method to clear all items from localStorage
    static clear() {
        localStorage.clear();
    }
    // Method to remove a specific item from localStorage
    static removeItem(key) {
        localStorage.removeItem(key);
    }

}

export default LocalStorageService;
