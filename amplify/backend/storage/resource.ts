import { getUrl } from 'aws-amplify/storage';

const getUrlResult = await getUrl({
    key: filename,
    options: {
        accessLevel: 'protected'
    }
});

import { uploadData } from 'aws-amplify/storage';

try {
    const result = await uploadData({
        key: filename,
        data: file,
        options: {
            accessLevel: 'protected'
        }
    }).result;
    console.log('Succeeded: ', result);
} catch (error) {
    console.log('Error : ', error);
}

import { remove } from 'aws-amplify/storage';

try {
    await remove({
        key: filename,
        options: {
            accessLevel: 'protected'
        }
    });
} catch (error) {
    console.log('Error ', error);
}

import { list } from 'aws-amplify/storage';

try {
    const result = await list({
        prefix: 'photos/',
        options: {
            accessLevel: 'protected'
        }
    });
} catch (error) {
    console.log(error);
}