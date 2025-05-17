const BASE_URL = 'http://localhost:3000/users';

const fetcher = async (url: string, options?: RequestInit) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur réseau');
    }

    try {
        const json = await response.json();
        return json;
    } catch (err) {
        return {};
    }
};

export const addFavorite = (id: number, type: 'activity' | 'restaurant') => {
    const endpoint = type === 'activity' ? `${BASE_URL}/add_activitie_fav` : `${BASE_URL}/add_restaurant_fav`;
    return fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify({ id }),
    });
};

export const removeFavorite = (id: number, type: 'activity' | 'restaurant') => {
    const endpoint = type === 'activity' ? `${BASE_URL}/remove_activitie_fav` : `${BASE_URL}/remove_restaurant_fav`;
    return fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify({ id }),
    });
};

export const getFavoriteActivities = () => {
    return fetcher(`${BASE_URL}/get_activities_fav`);
};

export const getFavoriteRestaurants = () => {
    return fetcher(`${BASE_URL}/get_restaurants_fav`);
};
