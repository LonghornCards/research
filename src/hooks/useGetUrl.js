import { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';

const useGetUrl = (key) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const fileUrl = await Storage.get(key);
                setUrl(fileUrl);
            } catch (error) {
                console.error('Error getting file URL:', error);
            }
        };

        fetchUrl();
    }, [key]);

    return url;
};

export default useGetUrl;
